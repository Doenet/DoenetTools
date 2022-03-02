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
$CID = mysqli_real_escape_string($conn, $_POST["CID"]);
$attemptNumber = mysqli_real_escape_string($conn, $_POST["attemptNumber"]);
$coreInfo = mysqli_real_escape_string($conn, $_POST["coreInfo"]);
$coreState = mysqli_real_escape_string($conn, $_POST["coreState"]);
$rendererState = mysqli_real_escape_string($conn, $_POST["rendererState"]);
$saveId = mysqli_real_escape_string($conn, $_POST["saveId"]);
$serverSaveId = mysqli_real_escape_string($conn, $_POST["serverSaveId"]);
$updateTableOnContentChange = mysqli_real_escape_string(
    $conn,
    $_POST["updateTableOnContentChange"]
);

$success = true;
$message = "";
if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($CID == "") {
    $success = false;
    $message = "Internal Error: missing CID";
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

// TODO: check if CID of assignment has changed,
// if so, include {CIDchanged: true} in response
// in order to alert the user

// TODO: do we need to save a timestamp?

$stateOverwritten = false;
$savedState = false;

if ($success) {
    if ($serverSaveId != "") {
        $sql = "UPDATE page_state SET
            coreState = '$coreState',
            rendererState = '$rendererState',
            saveId = '$saveId',
            deviceName = '$device',
            timestamp = CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
            WHERE userId='$userId'
            AND doenetId='$doenetId'
            AND attemptNumber='$attemptNumber'
            AND CID = '$CID'
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

        // attempt to insert a rows in page_state

        $sql = "INSERT INTO page_state
            (userId,doenetId,CID,attemptNumber,deviceName,saveId,coreInfo,coreState,rendererState,timestamp)
            VALUES ('$userId','$doenetId','$CID','$attemptNumber','$device','$saveId','$coreInfo','$coreState','$rendererState',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))
        ";

        $conn->query($sql);

        if ($conn->affected_rows > 0) {
            // successfully added a new row to page_state

            // if attemptNumber is greater than 1, then delete the saveId from previous attempts
            // so that updating that saveId from any other device will fail

            if ($attemptNumber > 1) {
                $sql = "UPDATE page_state SET
                saveId = NULL
                WHERE userId='$userId'
                AND doenetId='$doenetId'
                AND attemptNumber < '$attemptNumber'
                ";

                $conn->query($sql);
            }
        } else {
            // no rows were inserted
            // so the saveId was changed by another device

            $modifiedDBRecord = false;

            if ($updateTableOnContentChange == "1") {
                // if the CID changed,
                // then update the table rather than getting information from the table

                $sql = "SELECT CID
                    FROM page_state
                    WHERE userId='$userId'
                    AND doenetId='$doenetId'
                    AND attemptNumber = '$attemptNumber'
                    ";

                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    if ($row["CID"] != $CID) {
                        // update the matching row in page_state
                        // to match current CID and state
                        $sql = "UPDATE page_state SET
                            CID = '$CID',
                            coreState = '$coreState',
                            rendererState = '$rendererState',
                            saveId = '$saveId',
                            deviceName = '$device',
                            timestamp = CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
                            WHERE userId='$userId'
                            AND doenetId='$doenetId'
                            AND attemptNumber='$attemptNumber'
                            ";

                        $conn->query($sql);

                        $modifiedDBRecord = true;

                        if (!($conn->affected_rows > 0)) {
                            // something went wrong
                            $success = false;
                            $message = "Database error 1";
                        }
                    }
                }
            }

            if (!$modifiedDBRecord) {
                // get information from the latest attemptNumber

                $stateOverwritten = true;

                $sql = "SELECT CID, attemptNumber, saveId, deviceName, coreInfo, coreState, rendererState
                    FROM page_state
                    WHERE userId = '$userId'
                    AND doenetId = '$doenetId'
                    AND attemptNumber = (SELECT MAX(attemptNumber) FROM page_state WHERE userId = '$userId' AND doenetId = '$doenetId')
                    ";

                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();

                    $newCID = $row["CID"];
                    $newAttemptNumber = $row["attemptNumber"];
                    $saveId = $row["saveId"];
                    $newDevice = $row["deviceName"];
                    $newCoreInfo = $row["coreInfo"];
                    $newCoreState = $row["coreState"];
                    $newRendererState = $row["rendererState"];
                } else {
                    // something strange happened (another process changed the database in between queries?)
                    $success = false;
                    $message = "Database error 2";
                }
            }
        }
    }
}

$response_arr = [
    "success" => $success,
    "saveId" => $saveId,
    "stateOverwritten" => $stateOverwritten,
    "CID" => $newCID,
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
