<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];
$examUserId = array_key_exists("examineeUserId", $jwtArray)
    ? $jwtArray["examineeUserId"]
    : "";
$examDoenetId = array_key_exists("doenetId", $jwtArray)
    ? $jwtArray["doenetId"]
    : "";

$_POST = json_decode(file_get_contents("php://input"), true);
$doenetId = mysqli_real_escape_string($conn, $_POST["activityId"]);
$attemptNumber = mysqli_real_escape_string($conn, $_POST["attemptNumber"]);

$weights = array_map(function ($item) use ($conn) {
    return mysqli_real_escape_string($conn, $item);
}, $_POST["weights"]);

$success = true;
$message = "";

if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($attemptNumber == "") {
    $success = false;
    $message = "Internal Error: missing attemptNumber";
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
    // make sure have a row in user_assignment
    $sql = "INSERT INTO user_assignment
            (doenetId,userId)
            VALUES
            ('$doenetId','$userId')
            ";

    $conn->query($sql);

    $sql = "SELECT 
            began
            FROM user_assignment_attempt
            WHERE userId = '$userId'
            AND doenetId = '$doenetId'
            AND attemptNumber = '$attemptNumber'
            ";
    $result = $conn->query($sql);


    if ($result->num_rows < 1) {
        $sql = "INSERT INTO user_assignment_attempt
                (doenetId,userId,attemptNumber,began)
                VALUES
                ('$doenetId','$userId','$attemptNumber',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))
                ";

        $conn->query($sql);

        // also clear saveId from page_state and activity state
        // so other devices know that there has been an new attempt number

        $sql = "UPDATE activity_state SET
            saveId = NULL
            WHERE userId='$userId'
            AND doenetId='$doenetId'
            AND attemptNumber < '$attemptNumber'
            ";

        $conn->query($sql);

        $sql = "UPDATE page_state SET
            saveId = NULL
            WHERE userId='$userId'
            AND doenetId='$doenetId'
            AND attemptNumber < '$attemptNumber'
            ";

        $conn->query($sql);
    } else {
        $row = $result->fetch_assoc();
        $began = $row["began"];

        // update start time only if null
        // (which would happen only for proctored exams)
        if ($began == null) {
            $sql = "UPDATE user_assignment_attempt
                SET began=CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
                WHERE userId = '$userId'
                AND doenetId = '$doenetId'
                AND attemptNumber = '$attemptNumber'
                ";
            $conn->query($sql);
        }
    }

    $sql = "SELECT itemNumber
        FROM  user_assignment_attempt_item
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        ";

    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $itemNumber = $row["itemNumber"];
        if ($itemNumber > count($weights)) {
            $sql = "DELETE FROM user_assignment_attempt_item
                WHERE userId = '$userId'
                AND doenetId = '$doenetId'
                AND attemptNumber = '$attemptNumber'  
                AND itemNumber = '$itemNumber'
                ";
            $conn->query($sql);
        }
    }

    for ($itemNumber = 1; $itemNumber < count($weights) + 1; $itemNumber++) {
        // insert or update item weights
        $weight = $weights[$itemNumber - 1];

        $sql = "INSERT INTO user_assignment_attempt_item 
                    (userId,doenetId,attemptNumber,itemNumber,weight)
                    values
                    ('$userId','$doenetId','$attemptNumber','$itemNumber','$weight')
                    ON DUPLICATE KEY UPDATE weight='$weight'
                    ";
        $result = $conn->query($sql);
    }
}

$response_arr = [
    "access" => true,
    "success" => $success,
    "message" => $message,
];

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
