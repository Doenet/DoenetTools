<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";
include "getCourseItemFunction.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";

$itemType = mysqli_real_escape_string($conn,$_REQUEST["itemType"]);
$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$containingDoenetId = mysqli_real_escape_string($conn,$_REQUEST["containingDoenetId"]);

if ($userId == ''){
  $success = FALSE;
  $message = "You need to be signed in to make a course";
}

//Test Permission to edit content
if ($success){
  $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
  if ($permissions["canEditContent"] != '1'){
    $success = FALSE;
    $message = "You need edit permission to add a page or order.";
  }
}

if ($success){
  $doenetId = include "randomId.php";
  if ($itemType == 'page'){
    $sql = "
    INSERT INTO pages (courseId,containingDoenetId,doenetId) 
      VALUES('$courseId','$containingDoenetId','$doenetId');
    ";
    $conn->query($sql);
    $pageThatWasCreated = getCourseItemFunction($conn,$itemType,$doenetId);
  }else if ($itemType == 'order'){
    //TODO: make sure this is the same id as the one entered as order in the structure
    $orderDoenetIdThatWasCreated = $doenetId;
  }
}


$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "pageThatWasCreated"=>$pageThatWasCreated,
  "orderDoenetIdThatWasCreated"=>$orderDoenetIdThatWasCreated,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>