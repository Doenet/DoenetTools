<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];
$examUserId = $jwtArray["examineeUserId"];
$examDoenetId = $jwtArray["doenetId"];

// $device = $jwtArray['deviceName'];

$CID = mysqli_real_escape_string($conn, $_REQUEST["CID"]);
$attemptNumber = mysqli_real_escape_string($conn, $_REQUEST["attemptNumber"]);
$doenetId = mysqli_real_escape_string($conn, $_REQUEST["doenetId"]);
$allowLoadState = mysqli_real_escape_string(
    $conn,
    $_REQUEST["allowLoadState"]
);

$paramUserId = mysqli_real_escape_string($conn, $_REQUEST["userId"]);

$success = true;
$message = "";
if ($CID == "") {
    $success = false;
    $message = "Internal Error: missing CID";
} elseif ($attemptNumber == "") {
    $success = false;
    $message = "Internal Error: missing attemptNumber";
} elseif ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($allowLoadState == "") {
    $success = false;
    $message = "Internal Error: missing allowLoadState";
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
    $effectiveUserId = $userId;
    if ($paramUserId !== "") {
        //TODO: Need a permission related to see grades (not du.canEditContent)
        $sql = "
            SELECT du.canEditContent 
            FROM drive_user AS du
            LEFT JOIN drive_content AS dc
            ON dc.driveId = du.driveId
            WHERE du.userId = '$userId'
            AND dc.doenetId = '$doenetId'
            AND du.canEditContent = '1'
    ";

        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $effectiveUserId = $paramUserId;
        }
    }

    $loadedState = false;

    if ($allowLoadState == "true") {
        $sql = "SELECT saveId, activityInfo, activityState
            FROM activity_state
            WHERE userId = '$effectiveUserId'
            AND doenetId = '$doenetId'
            AND CID = '$CID'
            AND attemptNumber='$attemptNumber'
            ";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $activityInfo = $row["activityInfo"];
            $activityState = $row["activityState"];
            $saveId = $row["saveId"];
            $loadedState = true;

            // TODO: check if instructor changed CID
        }
    }


}

$response_arr = [
    "success" => $success,
    "loadedState" => $loadedState,
    "activityInfo" => $activityInfo,
    "activityState" => $activityState,
    "saveId" => $saveId,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
