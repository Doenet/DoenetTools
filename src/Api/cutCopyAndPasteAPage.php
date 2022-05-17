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
} elseif (!array_key_exists('originalPageDoenetIds', $_POST)) {
    $success = false;
    $message = 'Missing originalPageDoenetIds';
} elseif (!array_key_exists('sourceTypes', $_POST)) {
    $success = false;
    $message = 'Missing sourceTypes';
} elseif (!array_key_exists('sourceDoenetIds', $_POST)) {
    $success = false;
    $message = 'Missing sourceDoenetIds';
} elseif (!array_key_exists('destinationType', $_POST)) {
    $success = false;
    $message = 'Missing destinationType';
} elseif (!array_key_exists('destinationDoenetId', $_POST)) {
    $success = false;
    $message = 'Missing destinationDoenetId';
} elseif (!array_key_exists('sourceJSONs', $_POST)) {
    $success = false;
    $message = 'Missing sourceJSONs';
} elseif (!array_key_exists('destinationJSON', $_POST)) {
    $success = false;
    $message = 'Missing destinationJSON';
} 

//Test Permission to edit content
if ($success){
    $isCopy = mysqli_real_escape_string($conn, $_POST['isCopy']);
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
    $originalPageDoenetIds = array_map(function($item) use($conn) {
       return array_map(function($inneritem) use($conn) {
            return mysqli_real_escape_string($conn, $inneritem);
        }, $item);
      }, $_POST['originalPageDoenetIds']);
    $sourceTypes = array_map(function($item) use($conn) {
        return mysqli_real_escape_string($conn, $item);
      }, $_POST['sourceTypes']);
    $sourceDoenetIds = array_map(function($item) use($conn) {
        return mysqli_real_escape_string($conn, $item);
      }, $_POST['sourceDoenetIds']);
    $sourceJSONs = array_map(function($item) use($conn) {
        // return mysqli_real_escape_string($conn, $item);
        return json_encode($item);
    }, $_POST['sourceJSONs']);

    $destinationType = mysqli_real_escape_string($conn, $_POST['destinationType']);
    $destinationDoenetId = mysqli_real_escape_string($conn, $_POST['destinationDoenetId']);
    $destinationJSON = json_encode($_POST['destinationJSON']);

    $clonePageLabel = mysqli_real_escape_string($conn, $_POST['clonePageLabel']);
    $clonePageParent = mysqli_real_escape_string($conn, $_POST['clonePageParent']);



    $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
    if ($permissions["canEditContent"] != '1'){
      $success = FALSE;
      $message = "You need edit permission to add a page or order.";
    }
}

if ($success) {
    for($i = 0; $i < count($sourceDoenetIds);$i++){
        $sourceType = $sourceTypes[$i];
        $sourceDoenetId = $sourceDoenetIds[$i];
        $sourceJSON = $sourceJSONs[$i];
        $originalPageDoenetIdArray = $originalPageDoenetIds[$i];

        //If source is the same as the destination only use destination so skip source update
        if ($sourceDoenetId != $destinationDoenetId){
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
            foreach ($originalPageDoenetIdArray as $originalPageDoenetId){
            //Update page in the pages table
            $sql = "
            UPDATE pages
            SET containingDoenetId='$destinationDoenetId'
            WHERE doenetId='$originalPageDoenetId'
            AND courseId='$courseId'
            ";
                $result = $conn->query($sql);
            }
        }
    }
    //UPDATE DESTINATION
    // if ($isCopy || $destinationDoenetId != $sourceDoenetId){
        //Replace destinationJSON with new doenetId for page
        // if ($isCopy){
        //     $target = $originalPageDoenetId . "2";
        //     $destinationJSON = str_replace($target,$pageInsertedDoenetId,$destinationJSON);
        // }
        

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
    // }
    
//     if ($isCopy){
//         $pageInsertedDoenetId = include "randomId.php";
//         $pageInsertedDoenetId = "_" . $pageInsertedDoenetId;
        

//         //Create a copy of original file for page
//         $sourceFilePath = "../media/byPageId/$originalPageDoenetId.doenet";
//         $destFilePath = "../media/byPageId/$pageInsertedDoenetId.doenet";
//         if (!copy($sourceFilePath, $destFilePath)) {
//           $success = false;
//           $message = "failed to copy media\n";
//         }
//         //Insert page into the pages table
//         $sql = "
//         INSERT INTO pages
//         (courseId,containingDoenetId,doenetId,label)
//         values
//         ('$courseId','$destinationDoenetId','$pageInsertedDoenetId','$clonePageLabel')
//         ";
//         $result = $conn->query($sql);
//         $pageInserted = array(
//             "type"=>"page",
//             "label"=>$clonePageLabel,
//             "containingDoenetId"=>$destinationDoenetId,
//             "doenetId"=>$pageInsertedDoenetId,
//             "parentDoenetId"=>$clonePageParent,
//           );
//     }else{

//     }



    

  
//     // if ($makeMultiPage){
//     //     $sql = "
//     //     UPDATE course_content
//     //     SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.isSinglePage',false)
//     //     WHERE doenetId='$doenetId'
//     //     AND courseId='$courseId'
//     //     ";
//     //     $result = $conn->query($sql);
//     // }
}

$response_arr = array(
    "success"=>$success,
    "message"=>$message,
    "pageInserted"=>$pageInserted,
    );
  
  
  // set response code - 200 OK
  http_response_code(200);
  
  // make it json format
  echo json_encode($response_arr);
  $conn->close();

?>
