<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
include 'permissionsAndSettingsForOneCourseFunction.php';


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


  if ($requestorPermissions['canViewAndModifyGrades'] != '1') {
        $success = false;
        $message = 'You are only allowed to view your own data';
  }else{
      $userId = $requestUserId;
  }

}


$numberOfAttemptsAllowedAdjustment = 0;
$baseAttemptsAllowed = 0;

if ($success) {
    $sql = "SELECT numberOfAttemptsAllowedAdjustment
        FROM user_assignment
        WHERE userId='$userId'
        AND doenetId='$doenetId'
        ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($row["numberOfAttemptsAllowedAdjustment"] > 0) {
            $numberOfAttemptsAllowedAdjustment =
                $row["numberOfAttemptsAllowedAdjustment"];
        }
    }

    $sql = "SELECT numberOfAttemptsAllowed
        FROM assignment
        WHERE doenetId='$doenetId'
        ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($row["numberOfAttemptsAllowed"] > 0) {
            $baseAttemptsAllowed =
                $row["numberOfAttemptsAllowed"];
        }
    }



}

$response_arr = [
    "success" => $success,
    "numberOfAttemptsAllowedAdjustment" => $numberOfAttemptsAllowedAdjustment,
    "baseAttemptsAllowed" => $baseAttemptsAllowed,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
