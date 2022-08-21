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

if ($userId == ''){
  $success = FALSE;
  $message = "You need to be signed in to make a course";
}

$_POST = json_decode(file_get_contents('php://input'), true);
if (!array_key_exists('courseId', $_POST)) {
  $success = false;
  $message = 'Missing courseId';
} elseif (!array_key_exists('containingDoenetId', $_POST)) {
  $success = false;
  $message = 'Missing containingDoenetId';
} elseif (!array_key_exists('collectionDoenetId', $_POST)) {
  $success = false;
  $message = 'Missing collectionDoenetId';
} elseif (!array_key_exists('parentDoenetId', $_POST)) {
  $success = false;
  $message = 'Missing parentDoenetId';
}

if ($success){
  $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
  $containingDoenetId = mysqli_real_escape_string($conn, $_POST['containingDoenetId']);
  $collectionDoenetId = mysqli_real_escape_string($conn, $_POST['collectionDoenetId']);
  $parentDoenetId = mysqli_real_escape_string($conn, $_POST['parentDoenetId']);
  
}


//Test Permission to edit content
if ($success){
  $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
  
  if ($permissions["canEditContent"] != '1'){
    $success = FALSE;
    $message = "You need edit permission to add a collection link.";
  }
}

//Make DoenetIds and copy collection doenetId files to new doenetIds
$linkPageObjs = [];
$sourcePages = [];
if ($success){

  $sql = "
    SELECT  
    CAST(jsonDefinition as CHAR) AS json
    FROM course_content
    WHERE doenetId='$collectionDoenetId'
  ";
  $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $json = json_decode($row["json"], true);
        $sourcePages = $json['pages'];
    }else{
      $success = FALSE;
      $message = "Collection not found.";
  }
}

if ($success){
  //Delete previous page links so they don't build up
  $sql = "
  DELETE FROM link_pages 
  WHERE parentDoenetId = '$parentDoenetId'
  ";
  $conn->query($sql);

  foreach ($sourcePages AS &$sourcePage){
    $doenetId = include "randomId.php";
    $doenetId = "_" . $doenetId;

    //Copy the original file to the doenetId
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
    

    //TODO: make this more efficient
    if ($success){
      $sql = "
      SELECT label
      FROM pages
      WHERE doenetId='$sourcePage'
      ";
      $result = $conn->query($sql);
      $row = $result->fetch_assoc();
      $nextLabel = $row['label'] . " Link";

      $sql = "
      INSERT INTO link_pages 
      (courseId,containingDoenetId,parentDoenetId,doenetId,sourceCollectionDoenetId,label)
      VALUES
      ('$courseId','$containingDoenetId','$parentDoenetId','$doenetId','$collectionDoenetId','$nextLabel')
      ";
      $conn->query($sql);

      $linkPageObjs["$doenetId"] = Array("sourcePage"=>$sourcePage,"nextLabel"=>$nextLabel);
    }

  }
  
}


$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "linkPageObjs"=>$linkPageObjs,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>