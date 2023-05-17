<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
include_once 'permissionsAndSettingsForOneCourseFunction.php';


$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];
$examUserId = array_key_exists("examineeUserId", $jwtArray)
    ? $jwtArray["examineeUserId"]
    : "";
$examDoenetId = array_key_exists("doenetId", $jwtArray)
    ? $jwtArray["doenetId"]
    : "";

$doenetId = mysqli_real_escape_string($conn, $_REQUEST["doenetId"]);
$requestUserId = mysqli_real_escape_string($conn, $_REQUEST["userId"]);
$courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);
$attemptsAdjustment = mysqli_real_escape_string($conn, $_REQUEST['attemptsAdjustment']);

$success = true;
$message = "";

if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($userId == "") {
    $success = false;
    $message = "No access - Need to sign in";
}

if ($userId != ""){
    //Test for permission
    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );


  if ($requestorPermissions['canModifyActivitySettings'] != '1') {
        $success = false;
        $message = 'You are not allowed to modify activity settings';
  }

}


if ($success) {
    $sql = "UPDATE user_assignment
        SET numberOfAttemptsAllowedAdjustment='$attemptsAdjustment'
        WHERE userId='$requestUserId'
        AND doenetId='$doenetId'
        ";

    $result = $conn->query($sql);

}

$response_arr = [
    "success" => $success,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
