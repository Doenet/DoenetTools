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
} elseif (!array_key_exists('pagesDoenetIds', $_POST)) {
    $success = false;
    $message = 'Missing pagesDoenetIds';
} elseif (!array_key_exists('courseContentDoenetIds', $_POST)) {
    $success = false;
    $message = 'Missing courseContentDoenetIds';
} elseif (!array_key_exists('activitiesJson', $_POST)) {
    $success = false;
    $message = 'Missing activitiesJson';
} elseif (!array_key_exists('activitiesJsonDoenetIds', $_POST)) {
    $success = false;
    $message = 'Missing activitiesJsonDoenetIds';
} elseif (!array_key_exists('collectionsJson', $_POST)) {
    $success = false;
    $message = 'Missing collectionsJson';
} elseif (!array_key_exists('collectionsJsonDoenetIds', $_POST)) {
    $success = false;
    $message = 'Missing collectionsJsonDoenetIds';
} 

//Test Permission to edit content
if ($success){
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
    $pagesDoenetIds = array_map(function ($item) use ($conn) {
        return mysqli_real_escape_string($conn, $item);
    }, $_POST["pagesDoenetIds"]);
    $courseContentDoenetIds = array_map(function ($item) use ($conn) {
        return mysqli_real_escape_string($conn, $item);
    }, $_POST["courseContentDoenetIds"]);
    $activitiesJson = $_POST["activitiesJson"];
    $activitiesJsonDoenetIds = array_map(function ($item) use ($conn) {
        return mysqli_real_escape_string($conn, $item);
    }, $_POST["activitiesJsonDoenetIds"]);
    $collectionsJson = $_POST["collectionsJson"];
    $collectionsJsonDoenetIds = array_map(function ($item) use ($conn) {
        return mysqli_real_escape_string($conn, $item);
    }, $_POST["collectionsJsonDoenetIds"]);

    $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
    if ($permissions["canEditContent"] != '1'){
      $success = FALSE;
      $message = "You need edit permission to add a page or order.";
    }
}

if ($success) {
    
    //Mark pages deleted
    if (count($pagesDoenetIds) > 0){
        $list_of_pagesDoenetIds = join("','",$pagesDoenetIds);
        $list_of_pagesDoenetIds = "'" . $list_of_pagesDoenetIds . "'";
        $sql = "
        UPDATE pages
        SET isDeleted = '1'
        WHERE doenetId IN ($list_of_pagesDoenetIds)
        AND courseId='$courseId'
        ";
        $result = $conn->query($sql);
    }

    if (count($collectionsJsonDoenetIds) > 0){
        for($i = 0; $i < count($collectionsJsonDoenetIds); $i++){
            $collectionsJsonDoenetId = $collectionsJsonDoenetIds[$i];
            $collectionJson = $collectionsJson[$i];
            $json = json_encode($collectionJson);
            $sql = "
            UPDATE course_content
            SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.pages',JSON_MERGE('[]','$json'))
            WHERE doenetId='$collectionsJsonDoenetId'
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
