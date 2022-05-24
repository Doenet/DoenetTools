<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include "permissionsAndSettingsForOneCourseFunction.php";

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = "";
//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (!array_key_exists('courseId', $_POST)) {
    $success = false;
    $message = 'Missing courseId';
} elseif (!array_key_exists('doenetId', $_POST)) {
    $success = false;
    $message = 'Missing doenetId';
} elseif (!array_key_exists('newJSON', $_POST)) {
    $success = false;
    $message = 'Missing newJSON';
} 
//Test Permission to edit content
if ($success){
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
    $doenetId = mysqli_real_escape_string($conn, $_POST['doenetId']);
    $json = json_encode($_POST['newJSON']);
    $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
    if ($permissions["canEditContent"] != '1'){
      $success = FALSE;
      $message = "You need edit permission to add a page or order.";
    }
}

if ($success) {
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
    $doenetId = mysqli_real_escape_string($conn, $_POST['doenetId']);
    $json = json_encode($_POST['newJSON']);
    $sql = "
    UPDATE course_content
    SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.pages',JSON_MERGE('[]','$json'))
    WHERE doenetId='$doenetId'
    AND courseId='$courseId'
    ";
    $result = $conn->query($sql);
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
