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

//Make DoenetIds and copy collection doenetId files to new doenetIds
$linkPageObjs = [];

if ($success){

  for ($i = 0; $i < count($newSourcePageDoenetIds); $i++){
    $sourcePage = $newSourcePageDoenetIds[$i];
    $label = $labels[$i];
    $doenetId = include "randomId.php";
    $doenetId = "_" . $doenetId;

    //Copy the original file to the doenetId
    $sourceFile = "../media/byPageId/$sourcePage.doenet";
    $destinationFile = "../media/byPageId/$doenetId.doenet";
    echo "label $label \n";
    echo "sourceFile $sourceFile \n";
    echo "destinationFile $destinationFile \n";
    // $dirname = dirname($destinationFile);
    // if (!is_dir($dirname)) {
    //     mkdir($dirname, 0755, true);
    // }
    // if (!copy($sourceFile, $destinationFile)) {
    //     $success = FALSE;
    //     $message = "failed to copy";
    // }
    

    // //TODO: make this more efficient
    // if ($success){

    //   $sql = "
    //   INSERT INTO link_pages 
    //   (courseId,containingDoenetId,parentDoenetId,doenetId,sourceCollectionDoenetId,sourcePageDoenetId,label,timeOfLastUpdate)
    //   VALUES
    //   ('$courseId','$containingDoenetId','$parentDoenetId','$doenetId','$collectionDoenetId','$sourcePage','$label',NOW())
    //   ";
    //   $conn->query($sql);

    //   $linkPageObjs[$doenetId] = Array("sourcePage"=>$sourcePage,"label"=>$label);
    // }

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