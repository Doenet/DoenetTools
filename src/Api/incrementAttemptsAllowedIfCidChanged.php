<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
include "db_connection.php";

date_default_timezone_set("UTC");
// America/Chicago

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];
$examUserId = array_key_exists("examineeUserId", $jwtArray)
    ? $jwtArray["examineeUserId"]
    : "";
$examDoenetId = array_key_exists("doenetId", $jwtArray)
    ? $jwtArray["doenetId"]
    : "";

$_POST = json_decode(file_get_contents("php://input"), true);
$doenetId = mysqli_real_escape_string($conn, $_POST["doenetId"]);

//TODO: check if attempt is older than given attempt

$success = true;
$message = "";

if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($userId == "") {
    if ($examUserId == "") {
        $success = false;
        $message = "No access - Need to sign in";
    } elseif ($examDoenetId != $doenetId) {
        $success = false;
        $message = "No access for doenetId: $doenetId";
    } else {
        $userId = $examUserId;
    }
}

if ($success) {
    // get cid from course_content
    // use it only as long as it is assigned
    // and either
    // - activity is globally assigned
    // - activity is assigned to user via user_assignment
    $sql = "SELECT isGloballyAssigned, courseId,
        CAST(jsonDefinition as CHAR) AS json
        FROM course_content
        WHERE doenetId = '$doenetId'
        AND isAssigned = 1
        ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $json = json_decode($row["json"], true);
        if ($row["isGloballyAssigned"]) {
            $cid = $json["assignedCid"];
        } else {
            // not globally assigned.  See if assigned to user.
            $sql = "SELECT doenetId
                    FROM user_assignment
                    WHERE doenetId = '$doenetId' AND userId='$userId' AND isUnassigned='0'
                    ";
            $result2 = $conn->query($sql);
            if ($result2->num_rows > 0) {
                $cid = $json["assignedCid"];
            }
        }
    }

    if ($cid) {
        $cidChanged = false;

        // found a cid for assignment
        // now check that use has a different cid from their latest attempt
        $sql = "SELECT cid, attemptNumber
                FROM activity_state
                WHERE userId = '$userId'
                AND doenetId = '$doenetId'
                AND attemptNumber = (SELECT MAX(attemptNumber) FROM user_assignment_attempt WHERE userId='$userId' AND doenetId='$doenetId')
                ";

        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $attemptCid = $row["cid"];
            $lastAttemptNumber = $row["attemptNumber"];

            if ($attemptCid != $cid) {
                // the instructor must have changed the cid since this attempt was started
                $cidChanged = true;
            }
        }

        if ($cidChanged) {
            // add a new attempt
            $newAttemptNumber = $lastAttemptNumber + 1;
            $sql = "INSERT INTO user_assignment_attempt
                (doenetId,userId,attemptNumber,began)
                VALUES
                ('$doenetId','$userId','$newAttemptNumber',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))
                ";

            $conn->query($sql);

            // also clear saveId from page_state and activity state
            // so other devices know that there has been an new attempt number

            $sql = "UPDATE activity_state SET
                saveId = NULL
                WHERE userId='$userId'
                AND doenetId='$doenetId'
                AND attemptNumber < '$newAttemptNumber'
                ";

            $conn->query($sql);

            $sql = "UPDATE page_state SET
                saveId = NULL
                WHERE userId='$userId'
                AND doenetId='$doenetId'
                AND attemptNumber < '$newAttemptNumber'
                ";

            $conn->query($sql);


            // we increment the user's numberOfAttemptsAllowedAdjustment
            $sql = "UPDATE user_assignment
                SET numberOfAttemptsAllowedAdjustment = coalesce(numberOfAttemptsAllowedAdjustment, 0) + 1
                WHERE userId = '$userId'
                AND doenetId = '$doenetId'
                ";

            $conn->query($sql);
        }
    }

}

$response_arr = [
    "success" => $success,
    "message" => $message,
    "cidChanged" => $cidChanged,
    "newAttemptNUmber" => $newAttemptNumber
];

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
