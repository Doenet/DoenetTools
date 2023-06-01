<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";

$jwtArray = include "jwtArray.php";
$requestorUserId = $jwtArray["userId"];
$examUserId = $jwtArray["examineeUserId"];
$examDoenetId = $jwtArray["doenetId"];

// $device = $jwtArray['deviceName'];

$cid = mysqli_real_escape_string($conn, $_REQUEST["cid"]);
$attemptNumber = mysqli_real_escape_string($conn, $_REQUEST["attemptNumber"]);
$doenetId = mysqli_real_escape_string($conn, $_REQUEST["activityId"]);
$allowLoadState = mysqli_real_escape_string($conn, $_REQUEST["allowLoadState"]);

$effectiveUserId = $requestorUserId;

$paramUserId = mysqli_real_escape_string($conn, $_REQUEST["userId"]);

$success = true;
$message = "";
if ($cid == "") {
    $success = false;
    $message = "Internal Error: missing cid";
} elseif ($attemptNumber == "") {
    $success = false;
    $message = "Internal Error: missing attemptNumber";
} elseif ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing activityId (doenetId)";
} elseif ($allowLoadState == "") {
    $success = false;
    $message = "Internal Error: missing allowLoadState";
} elseif ($effectiveUserId == "") {
    if ($examUserId == "") {
        $success = false;
        $message = "No access - Need to sign in";
    } elseif ($examDoenetId != $doenetId) {
        $success = false;
        $message = "No access for doenetId: $doenetId";
    } else {
        $effectiveUserId = $examUserId;
    }
}

//find courseId
if ($success) {
    $result = $conn->query(
        "SELECT courseId
        FROM course_content
        WHERE doenetId='$doenetId'"
    );
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $courseId = $row['courseId'];
    } else {
        $success = false;
        $message = 'Content not found or no permission to view content';
    }
}

//Check permissions for using a paramUserId
if ($success && $paramUserId != "" && $paramUserId != $effectiveUserId) {
    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $requestorUserId,
        $courseId
    );

    if ($requestorPermissions["canViewAndModifyGrades"] == "1") {
        $effectiveUserId = $paramUserId;
    } else {
        $success = false;
        $message = "You are only allowed to view your own data";
    }
}


if ($success) {
    $loadedState = false;

    if ($allowLoadState == "true") {
        $sql = "SELECT saveId, variantIndex, activityInfo, activityState
            FROM activity_state
            WHERE userId = '$effectiveUserId'
            AND doenetId = '$doenetId'
            AND cid = '$cid'
            AND attemptNumber='$attemptNumber'
            ";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $variantIndex = $row["variantIndex"];
            $activityInfo = $row["activityInfo"];
            $activityState = $row["activityState"];
            $saveId = $row["saveId"];
            $loadedState = true;

            // TODO: check if instructor changed cid
        }
    }
}

$response_arr = [
    "success" => $success,
    "loadedState" => $loadedState,
    "variantIndex" => $variantIndex,
    "activityInfo" => $activityInfo,
    "activityState" => $activityState,
    "saveId" => $saveId,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
