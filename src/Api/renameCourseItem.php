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
$newLabel = mysqli_real_escape_string($conn,$_REQUEST["newLabel"]);
$type = mysqli_real_escape_string($conn,$_REQUEST["type"]);

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
  //Pages are stored separate from the other items
  if ($type == 'page'){
    $sql = "
    UPDATE pages
    SET label = '$newLabel'
    WHERE doenetId = '$doenetId'
    AND courseId = '$courseId'
    ";
    $result = $conn->query($sql); 
  }else{
    $sql = "
    UPDATE course_content
    SET label = '$newLabel'
    WHERE doenetId = '$doenetId'
    AND courseId = '$courseId'
    ";
    $result = $conn->query($sql); 

  }
}

if ($success){
  $item = getCourseItemFunction($conn,$type,$doenetId);
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "item"=>$item
  );


// set response code - 200 OK
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>