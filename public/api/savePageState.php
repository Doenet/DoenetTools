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
$doenetId = mysqli_real_escape_string($conn, $_POST["activityId"]);
$cid = mysqli_real_escape_string($conn, $_POST["cid"]);
$pageNumber = mysqli_real_escape_string($conn, $_POST["pageNumber"]);
$attemptNumber = mysqli_real_escape_string($conn, $_POST["attemptNumber"]);
$coreInfo = mysqli_real_escape_string($conn, $_POST["coreInfo"]);
$coreState = mysqli_real_escape_string($conn, $_POST["coreState"]);
$rendererState = mysqli_real_escape_string($conn, $_POST["rendererState"]);
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
    $message = "Internal Error: missing activityId (doenetId)";
} elseif ($cid == "") {
    $success = false;
    $message = "Internal Error: missing cid";
} elseif ($pageNumber == "") {
    $success = false;
    $message = "Internal Error: missing pageNumber";
} elseif ($attemptNumber == "") {
    $success = false;
    $message = "Internal Error: missing attemptNumber";
} elseif ($coreInfo == "") {
    $success = false;
    $message = "Internal Error: missing coreInfo";
} elseif ($coreState == "") {
    $success = false;
    $message = "Internal Error: missing coreState";
} elseif ($rendererState == "") {
    $success = false;
    $message = "Internal Error: missing rendererState";
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
        $sql = "UPDATE page_state SET
            coreState = '$coreState',
            rendererState = '$rendererState',
            saveId = '$saveId',
            deviceName = '$device'
            WHERE userId='$userId'
            AND doenetId='$doenetId'
            AND pageNumber='$pageNumber'
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
        // so either there is no page_state saved
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
            // attempt to insert a rows in page_state

            $sql = "INSERT INTO page_state
                (userId,doenetId,cid,pageNumber,attemptNumber,deviceName,saveId,coreInfo,coreState,rendererState)
                VALUES ('$userId','$doenetId','$cid','$pageNumber','$attemptNumber','$device','$saveId','$coreInfo','$coreState','$rendererState')
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
                    FROM page_state
                    WHERE userId='$userId'
                    AND doenetId='$doenetId'
                    AND pageNumber = '$pageNumber'
                    AND attemptNumber = '$attemptNumber'
                    ";

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();
                        if ($row["cid"] != $cid) {
                            // update the matching row in page_state
                            // to match current cid and state
                            $sql = "UPDATE page_state SET
                            cid = '$cid',
                            coreInfo = '$coreInfo',
                            coreState = '$coreState',
                            rendererState = '$rendererState',
                            saveId = '$saveId',
                            deviceName = '$device'
                            WHERE userId='$userId'
                            AND doenetId='$doenetId'
                            AND pageNumber='$pageNumber'
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

                    $sql = "SELECT cid, pageNumber, attemptNumber, saveId, deviceName, coreInfo, coreState, rendererState
                        FROM page_state
                        WHERE userId = '$userId'
                        AND doenetId = '$doenetId'
                        AND pageNumber = '$pageNumber'
                        AND attemptNumber ='$attemptNumber'
                        ";

                    $result = $conn->query($sql);

                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();

                        $newCid = $row["cid"];
                        $saveId = $row["saveId"];
                        $newDevice = $row["deviceName"];
                        $newCoreInfo = $row["coreInfo"];
                        $newCoreState = $row["coreState"];
                        $newRendererState = $row["rendererState"];
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
    "coreInfo" => $newCoreInfo,
    "coreState" => $newCoreState,
    "rendererState" => $newRendererState,
    "device" => $newDevice,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
