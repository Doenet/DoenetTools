<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];
$examUserId = $jwtArray["examineeUserId"];
$examDoenetId = $jwtArray["doenetId"];

$device = $jwtArray["deviceName"];

$_POST = json_decode(file_get_contents("php://input"), true);
$doenetId = mysqli_real_escape_string($conn, $_POST["doenetId"]);
$cid = mysqli_real_escape_string($conn, $_POST["cid"]);
$attemptNumber = mysqli_real_escape_string($conn, $_POST["attemptNumber"]);
$variantIndex = mysqli_real_escape_string($conn, $_POST["variantIndex"]);
$activityInfo = mysqli_real_escape_string($conn, $_POST["activityInfo"]);
$activityState = mysqli_real_escape_string($conn, $_POST["activityState"]);
$saveId = mysqli_real_escape_string($conn, $_POST["saveId"]);
$serverSaveId = mysqli_real_escape_string($conn, $_POST["serverSaveId"]);
$updateDataOnContentChange = mysqli_real_escape_string(
    $conn,
    $_POST["updateDataOnContentChange"]
);

$success = true;
$message = "";
if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($cid == "") {
    $success = false;
    $message = "Internal Error: missing cid";
} elseif ($attemptNumber == "") {
    $success = false;
    $message = "Internal Error: missing attemptNumber";
} elseif ($variantIndex == "") {
    $success = false;
    $message = "Internal Error: missing variantIndex";
} elseif ($activityInfo == "") {
    $success = false;
    $message = "Internal Error: missing activityInfo";
} elseif ($activityState == "") {
    $success = false;
    $message = "Internal Error: missing activityState";
} elseif ($saveId == "") {
    $success = false;
    $message = "Internal Error: missing saveId";
    // }elseif ($serverSaveId == ""){
    //   $success = FALSE;
    //   $message = 'Internal Error: missing serverSaveId';
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

// TODO: check if cid of assignment has changed,
// if so, include {cidChanged: true} in response
// in order to alert the user

$stateOverwritten = false;
$savedState = false;

if ($success) {
    if ($serverSaveId != "") {
        $sql = "UPDATE activity_state SET
            activityState = '$activityState',
            saveId = '$saveId',
            deviceName = '$device'
            WHERE userId='$userId'
            AND doenetId='$doenetId'
            AND attemptNumber='$attemptNumber'
            AND cid = '$cid'
            AND saveId = '$serverSaveId'
            ";

        $conn->query($sql);
        if ($conn->affected_rows > 0) {
            $savedState = true;
        }
    }

    if (!$savedState) {
        // no rows were updated
        // so either there is no activity_state saved
        // or the saveId was changed by another device

        // as long as we aren't updating data on content change
        // first check if there is a new attept number
        // (as could be no row at the current attempt number even if we passed it to a new attempt number)
        if ($updateDataOnContentChange != "1") {
            // get new attempt number from user_assignment_attempt
            // since that gets updated as soon as a new attempt is created

            $sql = "SELECT MAX(attemptNumber) as maxAttemptNumber
                FROM user_assignment_attempt 
                WHERE userId = '$userId' 
                AND doenetId = '$doenetId'
                ";

            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $newAttemptNumber = $row["maxAttemptNumber"];
            } else {
                // something strange happened
                $success = false;
                $message = "Database error 1";
            }

            if ($newAttemptNumber !== $attemptNumber) {
                $stateOverwritten = true;
                
                // Note: don't need any more information if attempt number changes
                // as will reset activity
            }
        }

        if ($success && !$stateOverwritten) {
            // attempt to insert a rows in activity_state

            $sql = "INSERT INTO activity_state
                (userId,doenetId,cid,attemptNumber,deviceName,saveId,variantIndex,activityInfo,activityState)
                VALUES ('$userId','$doenetId','$cid','$attemptNumber','$device','$saveId','$variantIndex','$activityInfo','$activityState')
            ";

            $conn->query($sql);

            if ($conn->affected_rows < 1) {
                // no rows were inserted
                // so the saveId was changed by another device

                $modifiedDBRecord = false;

                if ($updateDataOnContentChange == "1") {
                    // if the cid changed,
                    // then update the table rather than getting information from the table

                    $sql = "SELECT cid
                    FROM activity_state
                    WHERE userId='$userId'
                    AND doenetId='$doenetId'
                    AND attemptNumber = '$attemptNumber'
                    ";

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();
                        if ($row["cid"] != $cid) {
                            // update the matching row in activity_state
                            // to match current cid and state
                            $sql = "UPDATE activity_state SET
                            cid = '$cid',
                            variantIndex = '$variantIndex',
                            activityInfo = '$activityInfo',
                            activityState = '$activityState',
                            saveId = '$saveId',
                            deviceName = '$device'
                            WHERE userId='$userId'
                            AND doenetId='$doenetId'
                            AND attemptNumber='$attemptNumber'
                            ";

                            $conn->query($sql);

                            $modifiedDBRecord = true;

                            if (!($conn->affected_rows > 0)) {
                                // something went wrong
                                $success = false;
                                $message = "Database error 2";
                            }
                        }
                    }
                }

                if (!$modifiedDBRecord) {

                    // need additional information since keeping same attempt number

                    $stateOverwritten = true;
                    $newAttemptNumber = $attemptNumber;

                    $sql = "SELECT cid, attemptNumber, saveId, deviceName, variantIndex, activityInfo, activityState
                        FROM activity_state
                        WHERE userId = '$userId'
                        AND doenetId = '$doenetId'
                        AND attemptNumber = '$attemptNumber'
                        ";

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();

                        $newCid = $row["cid"];
                        $saveId = $row["saveId"];
                        $newDevice = $row["deviceName"];
                        $newVariantIndex = $row["variantIndex"];
                        $newActivityInfo = $row["activityInfo"];
                        $newActivityState = $row["activityState"];
                    } else {
                        // something strange happened (another process changed the database in between queries?)
                        $success = false;
                        $message = "Database error 3";
                    }
                }
            }
        }
    }
}

$response_arr = [
    "success" => $success,
    "saveId" => $saveId,
    "stateOverwritten" => $stateOverwritten,
    "cid" => $newCid,
    "attemptNumber" => $newAttemptNumber,
    "variantIndex" => $newVariantIndex,
    "activityInfo" => $newActivityInfo,
    "activityState" => $newActivityState,
    "device" => $newDevice,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
