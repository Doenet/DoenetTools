<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include "permissionsAndSettingsForOneCourseFunction.php";
include "cidFromSHA.php";

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = "";

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (!array_key_exists('courseId', $_POST)) {
    $success = false;
    $message = 'Missing courseId';
} elseif (!array_key_exists('courseContentTableDoenetIds', $_POST)) {
    $success = false;
    $message = 'Missing courseContentTableDoenetIds';
} elseif (!array_key_exists('courseContentTableNewParentDoenetId', $_POST)) {
    $success = false;
    $message = 'Missing courseContentTableNewParentDoenetId';
} elseif (!array_key_exists('previousContainingDoenetIds', $_POST)) {
    $success = false;
    $message = 'Missing previousContainingDoenetIds';
} 

//Test Permission to edit content
if ($success){
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
    $courseContentTableDoenetIds = array_map(function ($item) use ($conn) {
        return mysqli_real_escape_string($conn, $item);
    }, $_POST["courseContentTableDoenetIds"]);
    $courseContentTableNewParentDoenetId = $_POST["courseContentTableNewParentDoenetId"];
    $previousContainingDoenetIds = array_map(function ($item) use ($conn) {
        return mysqli_real_escape_string($conn, $item);
    }, $_POST["previousContainingDoenetIds"]);

    $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
    if ($permissions["canEditContent"] != '1'){
      $success = FALSE;
      $message = "You need permission to edit content.";
    }
}

if ($success) {
    // echo "\ncourseId\n";
    // var_dump($courseId);
    // echo "\ncourseContentTableDoenetIds\n";
    // var_dump($courseContentTableDoenetIds);
    // echo "\ncourseContentTableNewParentDoenetId\n";
    // var_dump($courseContentTableNewParentDoenetId);
    // echo "\npreviousContainingDoenetIds\n";
    // var_dump($previousContainingDoenetIds);

    if (count($courseContentTableDoenetIds) > 0){
       foreach($courseContentTableDoenetIds as $doenetId ){
           //TODO: Determine new sortOrder position
           $sortOrder = 'o';
           $sql = "
           UPDATE course_content
           SET parentDoenetId = '$courseContentTableNewParentDoenetId',
           sortOrder = '$sortOrder'
           WHERE doenetId = '$doenetId'
           AND courseId='$courseId'
           ";
           $result = $conn->query($sql);
       }
    }
}


$response_arr = array(
    "success"=>$success,
    "message"=>$message
    );
  
  
  // set response code - 200 OK
  http_response_code(200);
  
  // make it json format
  echo json_encode($response_arr);
  $conn->close();

?>
