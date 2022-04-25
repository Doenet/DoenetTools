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
// var_dump($_POST);
if (!array_key_exists('courseId', $_POST)) {
    $success = false;
    $message = 'Missing courseId';
} elseif (!array_key_exists('isCopy', $_POST)) {
    $success = false;
    $message = 'Missing isCopy';
} elseif (!array_key_exists('originalPageDoenetId', $_POST)) {
    $success = false;
    $message = 'Missing originalPageDoenetId';
} elseif (!array_key_exists('sourceType', $_POST)) {
    $success = false;
    $message = 'Missing sourceType';
} elseif (!array_key_exists('sourceDoenetId', $_POST)) {
    $success = false;
    $message = 'Missing sourceDoenetId';
} elseif (!array_key_exists('destinationType', $_POST)) {
    $success = false;
    $message = 'Missing destinationType';
} elseif (!array_key_exists('destinationDoenetId', $_POST)) {
    $success = false;
    $message = 'Missing destinationDoenetId';
} elseif (!array_key_exists('sourceJSON', $_POST)) {
    $success = false;
    $message = 'Missing sourceJSON';
} elseif (!array_key_exists('destinationJSON', $_POST)) {
    $success = false;
    $message = 'Missing destinationJSON';
} 

//Test Permission to edit content
if ($success){
    $isCopy = mysqli_real_escape_string($conn, $_POST['isCopy']);
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
    $originalPageDoenetId = mysqli_real_escape_string($conn, $_POST['originalPageDoenetId']);
    $sourceType = mysqli_real_escape_string($conn, $_POST['sourceType']);
    $sourceDoenetId = mysqli_real_escape_string($conn, $_POST['sourceDoenetId']);
    $destinationType = mysqli_real_escape_string($conn, $_POST['destinationType']);
    $destinationDoenetId = mysqli_real_escape_string($conn, $_POST['destinationDoenetId']);

    $sourceJSON = json_encode($_POST['sourceJSON']);
    $destinationJSON = json_encode($_POST['destinationJSON']);


    $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
    if ($permissions["canEditContent"] != '1'){
      $success = FALSE;
      $message = "You need edit permission to add a page or order.";
    }
}

if ($success) {
    if ($isCopy){
        //TODO replace destinationJSON with new doenetId for page
    }
    //UPDATE SOURCE
    if ($sourceType == 'bank'){
        $sql = "
        UPDATE course_content
        SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.pages',JSON_MERGE('[]','$sourceJSON'))
        WHERE doenetId='$sourceDoenetId'
        AND courseId='$courseId'
        ";
        $result = $conn->query($sql);
    }else if ($sourceType == 'activity'){
        $sql = "
        UPDATE course_content
        SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.order',JSON_MERGE('{}','$sourceJSON'))
        WHERE doenetId='$sourceDoenetId'
        AND courseId='$courseId'
        ";
        $result = $conn->query($sql);
    }

    //UPDATE DESTINATION
    if ($destinationType == 'bank'){
        $sql = "
        UPDATE course_content
        SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.pages',JSON_MERGE('[]','$destinationJSON'))
        WHERE doenetId='$destinationDoenetId'
        AND courseId='$courseId'
        ";
        $result = $conn->query($sql);
    }else if ($destinationType == 'activity'){
        $sql = "
        UPDATE course_content
        SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.order',JSON_MERGE('{}','$destinationJSON'))
        WHERE doenetId='$destinationDoenetId'
        AND courseId='$courseId'
        ";
        $result = $conn->query($sql);
    }

    //Update page in the pages table
    $sql = "
    UPDATE pages
    SET containingDoenetId='$destinationDoenetId'
    WHERE doenetId='$originalPageDoenetId'
    AND courseId='$courseId'
    ";
    $result = $conn->query($sql);

  
    // if ($makeMultiPage){
    //     $sql = "
    //     UPDATE course_content
    //     SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.isSinglePage',false)
    //     WHERE doenetId='$doenetId'
    //     AND courseId='$courseId'
    //     ";
    //     $result = $conn->query($sql);
    // }
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
