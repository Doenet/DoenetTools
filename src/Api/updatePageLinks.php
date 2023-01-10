<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";

if ($userId == ''){
  $success = FALSE;
  $message = "You need to be signed in to make a course";
}

$_POST = json_decode(file_get_contents('php://input'), true);
if (!array_key_exists('courseId', $_POST)) {
  $success = false;
  $message = 'Missing courseId';
} elseif (!array_key_exists('pages', $_POST)) {
  $success = false;
  $message = 'Missing pages';
}

if ($success){
  $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
  $parentDoenetId = mysqli_real_escape_string($conn, $_POST['parentDoenetId']);
  $pages = array_map(function($page) use($conn) {
    return mysqli_real_escape_string($conn, $page);
  }, $_POST['pages']);
}


//Test Permission to edit content
if ($success){
  $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
  
  if ($permissions["canEditContent"] != '1'){
    $success = FALSE;
    $message = "You need edit permission to add a collection link.";
  }
}

$nextLabels = [];

if ($success){

  foreach ($pages AS &$doenetId){
      $sql = "
      SELECT sourcePageDoenetId
      FROM link_pages
      WHERE courseId = '$courseId'
      AND doenetId = '$doenetId'
      ";
      $result = $conn->query($sql);
      $row = $result->fetch_assoc();
      $sourcePage = $row['sourcePageDoenetId'];
      // Copy the original file to the doenetId
      $sourceFile = "../media/byPageId/$sourcePage.doenet";
      $destinationFile = "../media/byPageId/$doenetId.doenet";

      $dirname = dirname($destinationFile);
      if (!is_dir($dirname)) {
          mkdir($dirname, 0755, true);
      }
      if (!copy($sourceFile, $destinationFile)) {
          $success = FALSE;
          $message = "failed to copy";
      }
    //Update link pages timeOfLastUpdate and label
    $sql = "
    SELECT label
    FROM pages
    WHERE courseId = '$courseId'
    AND doenetId = '$sourcePage'
    ";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $label = $row['label'];
    array_push($nextLabels,$label);
    $escapedLabel = mysqli_real_escape_string($conn, $label);

    $sql = "
    UPDATE link_pages
    SET timeOfLastUpdate=NOW(), 
    label = '$escapedLabel'
    WHERE courseId = '$courseId'
      AND doenetId = '$doenetId'
    ";
    $conn->query($sql);
    }
  }



$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "nextLabels"=>$nextLabels,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>