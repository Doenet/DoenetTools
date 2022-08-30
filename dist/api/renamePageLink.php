<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "getCourseItemFunction.php";
include "permissionsAndSettingsForOneCourseFunction.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";

$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$label = mysqli_real_escape_string($conn,$_REQUEST["label"]);

if ($userId == ''){
  $success = FALSE;
  $message = "You need to be signed in to rename items.";
}

//Test Permission to rename
if ($success){
  $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
  if ($permissions["canEditContent"] != '1'){
    $success = FALSE;
    $message = "You need edit permission to rename items.";
  }
}

if ($success){

  $sql = "
  UPDATE link_pages
  SET label = '$label'
  WHERE doenetId = '$doenetId'
  ";
  $conn->query($sql); 

}


$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>