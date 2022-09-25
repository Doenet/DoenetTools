<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require 'defineDBAndUserAndCourseInfo.php';

$success = TRUE;
$message = "";


if ($userId == '' && $examUserId == ''){
  $success = FALSE;
  $message = "You need to be signed in to view courses.";
}

//Don't let them see the settings as they aren't public info
if (!$success){
  $permissionsAndSettings = [];
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