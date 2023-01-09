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
} elseif (!array_key_exists('containingDoenetId', $_POST)) {
  $success = false;
  $message = 'Missing containingDoenetId';
} elseif (!array_key_exists('parentDoenetId', $_POST)) {
  $success = false;
  $message = 'Missing parentDoenetId';
} elseif (!array_key_exists('sourceCollectionDoenetId', $_POST)) {
  $success = false;
  $message = 'Missing sourceCollectionDoenetId';
} elseif (!array_key_exists('newSourcePageDoenetIds', $_POST)) {
  $success = false;
  $message = 'Missing newSourcePageDoenetIds';
} elseif (!array_key_exists('pageLinksToDelete', $_POST)) {
  $success = false;
  $message = 'Missing pageLinksToDelete';
} elseif (!array_key_exists('labels', $_POST)) {
  $success = false;
  $message = 'Missing labels';
} 


if ($success){
  $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
  $containingDoenetId = mysqli_real_escape_string($conn, $_POST['containingDoenetId']);
  $parentDoenetId = mysqli_real_escape_string($conn, $_POST['parentDoenetId']);
  $sourceCollectionDoenetId = mysqli_real_escape_string($conn, $_POST['sourceCollectionDoenetId']);
  $newSourcePageDoenetIds = array_map(function($item) use($conn) {
    return mysqli_real_escape_string($conn, $item);
  }, $_POST['newSourcePageDoenetIds']);
  $pageLinksToDelete = array_map(function($item) use($conn) {
    return mysqli_real_escape_string($conn, $item);
  }, $_POST['pageLinksToDelete']);
  $labels = array_map(function($item) use($conn) {
    return mysqli_real_escape_string($conn, $item);
  }, $_POST['labels']);
}


//Test Permission to edit content
if ($success){
  $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
  
  if ($permissions["canEditContent"] != '1'){
    $success = FALSE;
    $message = "You need edit permission to add a collection link.";
  }
}

if ($success){

  if (count($pageLinksToDelete) > 0){
    $list_of_pageLinksToDelete = join("','",$pageLinksToDelete);
    $list_of_pageLinksToDelete = "'" . $list_of_pageLinksToDelete . "'";  
    $sql = "
    DELETE FROM link_pages
    WHERE doenetId IN ($list_of_pageLinksToDelete)
    AND courseId='$courseId'
    ";
    $conn->query($sql); 
    //Delete collection link files
    foreach($pageLinksToDelete AS &$pageLinkDoenetId){
        $fileLocation = "../media/byPageId/$pageLinkDoenetId.doenet";
        unlink($fileLocation);
    }
  }
}

//Make DoenetIds and copy collection doenetId files to new doenetIds
$linkPageObjs = [];

if ($success){

  for ($i = 0; $i < count($newSourcePageDoenetIds); $i++){
    $sourcePage = $newSourcePageDoenetIds[$i];
    $label = $labels[$i];
    $escapedLabel = mysqli_real_escape_string($conn, $label);
    $doenetId = include "randomId.php";
    $doenetId = "_" . $doenetId;

    

  $sql = "
  INSERT INTO link_pages 
  (courseId,containingDoenetId,parentDoenetId,doenetId,sourceCollectionDoenetId,sourcePageDoenetId,label,timeOfLastUpdate)
  VALUES
  ('$courseId','$containingDoenetId','$parentDoenetId','$doenetId','$sourceCollectionDoenetId','$sourcePage','$escapedLabel',NOW())
  ";
  $conn->query($sql);

  $linkPageObjs[$doenetId] = Array(
    "sourcePageDoenetId"=>$sourcePage,
    "label"=>$label
  );

  }

  //update all page link files to source content
  $sql = "
  SELECT 
  sourcePageDoenetId,
  doenetId
  FROM link_pages
  WHERE sourceCollectionDoenetId = '$sourceCollectionDoenetId'
  ";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){  
      $sourcePage = $row['sourcePageDoenetId'];
      $doenetId = $row['doenetId'];
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
    
    }
  }
  $sql = "
  UPDATE link_pages
  set timeOfLastUpdate=NOW()
  WHERE sourceCollectionDoenetId = '$sourceCollectionDoenetId'
  ";
  $conn->query($sql);
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