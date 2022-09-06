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

//In the future update the timeOfLastUpdate timestamp
// //Make DoenetIds and copy collection doenetId files to new doenetIds
// $linkPageObjs = [];
// $sourcePages = [];
// if ($success){

//   $sql = "
//     SELECT  
//     CAST(jsonDefinition as CHAR) AS json
//     FROM course_content
//     WHERE doenetId='$collectionDoenetId'
//   ";
//   $result = $conn->query($sql);
//     if ($result->num_rows > 0) {
//         $row = $result->fetch_assoc();
//         $json = json_decode($row["json"], true);
//         $sourcePages = $json['pages'];
//     }else{
//       $success = FALSE;
//       $message = "Collection not found.";
//   }
// }

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
      // echo "sourceFile $sourceFile\n";
      // echo "destinationFile $destinationFile\n";
      // echo "\n--------\n\n";
      $dirname = dirname($destinationFile);
      if (!is_dir($dirname)) {
          mkdir($dirname, 0755, true);
      }
      if (!copy($sourceFile, $destinationFile)) {
          $success = FALSE;
          $message = "failed to copy";
      }
    }
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