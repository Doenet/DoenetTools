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

$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$collectionDoenetId = mysqli_real_escape_string($conn,$_REQUEST["collectionDoenetId"]);

$linkPageObjs = [];

if ($userId == ''){
  $success = FALSE;
  $message = "You need to be signed in to make a course";
}

//Test Permission to edit content
if ($success){
  echo "\nuserId -$userId-\n courseId -$courseId-\n";
  $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
  var_dump($permissions);

  if ($permissions["canEditContent"] != '1'){
    $success = FALSE;
    $message = "You need edit permission to add a collection link.";
  }
}

// if ($success){
//   $doenetId = include "randomId.php";
//   $doenetId = "_" . $doenetId;
  
//   if ($itemType == 'page'){
//     $sql = "
//     INSERT INTO pages (courseId,containingDoenetId,doenetId,label) 
//       VALUES('$courseId','$containingDoenetId','$doenetId','Untitled Page');
//     ";
//     $conn->query($sql);
//     $pageThatWasCreated = getCourseItemFunction($conn,$itemType,$doenetId);

//     //Create blank file for page
//     $filename = "../media/byPageId/$doenetId.doenet";
//     $dirname = dirname($filename);
//     if (!is_dir($dirname)) {
//         mkdir($dirname, 0755, true);
//     }

//     $newfile = fopen($filename, "w");
//     if ($newfile === false) {
//         $success = false;
//         $message = "Unable to open file!";
//     } else {
//         // don't write anything to file so that it is a blank file
//         fclose($newfile);
//     }

//   }else if ($itemType == 'order'){
//     //TODO: make sure this is the same id as the one entered as order in the structure
//     $orderDoenetIdThatWasCreated = $doenetId;
//   }else if ($itemType == 'collectionLink'){
//     //TODO: make sure this is the same id as the one entered as order in the structure
//     $collectionAliasDoenetIdThatWasCreated = $doenetId;
//   }
// }


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