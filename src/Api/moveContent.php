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
      $message = "You need edit permission to add a page or order.";
    }
}

if ($success) {
    echo "\ncourseId\n";
    var_dump($courseId);
    echo "\ncourseContentTableDoenetIds\n";
    var_dump($courseContentTableDoenetIds);
    echo "\ncourseContentTableNewParentDoenetId\n";
    var_dump($courseContentTableNewParentDoenetId);
    echo "\npreviousContainingDoenetIds\n";
    var_dump($previousContainingDoenetIds);

    // if (count($baseCollectionsDoenetIds) > 0){
    //     $list_of_baseCollectionsDoenetIds = join("','",$baseCollectionsDoenetIds);
    //     $list_of_baseCollectionsDoenetIds = "'" . $list_of_baseCollectionsDoenetIds . "'";
    //     $sql = "
    //     UPDATE course_content
    //     SET isDeleted = '1'
    //     WHERE doenetId IN ($list_of_baseCollectionsDoenetIds)
    //     AND courseId='$courseId'
    //     ";
    //     $result = $conn->query($sql);
    // }
    // if (count($baseActivitiesDoenetIds) > 0){
    //     $list_of_baseActivitiesDoenetIds = join("','",$baseActivitiesDoenetIds);
    //     $list_of_baseActivitiesDoenetIds = "'" . $list_of_baseActivitiesDoenetIds . "'";
    //     $sql = "
    //     UPDATE course_content
    //     SET isDeleted = '1'
    //     WHERE doenetId IN ($list_of_baseActivitiesDoenetIds)
    //     AND courseId='$courseId'
    //     ";
    //     $result = $conn->query($sql);
    // }
    // if (count($baseSectionsDoenetIds) > 0){
    //     $list_of_baseSectionsDoenetIds = join("','",$baseSectionsDoenetIds);
    //     $list_of_baseSectionsDoenetIds = "'" . $list_of_baseSectionsDoenetIds . "'";
    //     $sql = "
    //     UPDATE course_content
    //     SET isDeleted = '1'
    //     WHERE doenetId IN ($list_of_baseSectionsDoenetIds)
    //     AND courseId='$courseId'
    //     ";
    //     $result = $conn->query($sql);
    // }
    
    // //Mark pages deleted
    // if (count($pagesDoenetIds) > 0){
    //     $list_of_pagesDoenetIds = join("','",$pagesDoenetIds);
    //     $list_of_pagesDoenetIds = "'" . $list_of_pagesDoenetIds . "'";
    //     $sql = "
    //     UPDATE pages
    //     SET isDeleted = '1'
    //     WHERE doenetId IN ($list_of_pagesDoenetIds)
    //     AND courseId='$courseId'
    //     ";
    //     $result = $conn->query($sql);
    // }

    // if (count($collectionsJsonDoenetIds) > 0){
    //     for($i = 0; $i < count($collectionsJsonDoenetIds); $i++){
    //         $collectionsJsonDoenetId = $collectionsJsonDoenetIds[$i];
    //         $collectionJson = $collectionsJson[$i];
    //         $json = json_encode($collectionJson);
    //         $sql = "
    //         UPDATE course_content
    //         SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.pages',JSON_MERGE('[]','$json'))
    //         WHERE doenetId='$collectionsJsonDoenetId'
    //         AND courseId='$courseId'
    //         ";
    //         $result = $conn->query($sql);
    //     }
    // }

    // if (count($activitiesJsonDoenetIds) > 0){
    //     for($i = 0; $i < count($activitiesJsonDoenetIds); $i++){
    //         $activitiesJsonDoenetId = $activitiesJsonDoenetIds[$i];
    //         $activitiesJson = $activitiesJson[$i];
    //         $json = json_encode($activitiesJson);
    //         $sql = "
    //         UPDATE course_content
    //         SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.order',JSON_MERGE('{}','$json'))
    //         WHERE doenetId='$activitiesJsonDoenetId'
    //         AND courseId='$courseId'
    //         ";
    //         $result = $conn->query($sql);
    //     }
    // }


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
