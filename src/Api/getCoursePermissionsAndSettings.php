<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "permissionsAndSettingsFunction.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";


if ($userId == ''){
  $success = FALSE;
  $message = "You need to be signed in to view courses.";
}

//TODO: Check canViewCourse
$permissionsAndSettings = [];

if ($success){
  $permissionsAndSettings = getpermissionsAndSettings($conn,$userId);
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "permissionsAndSettings"=>$permissionsAndSettings,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>