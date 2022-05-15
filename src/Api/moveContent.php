<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include "permissionsAndSettingsForOneCourseFunction.php";
include "lexicographicalRankingSort.php";

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = "";

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (!array_key_exists('courseId', $_POST)) {
    $success = false;
    $message = 'Missing courseId';
} elseif (!array_key_exists('doenetIdsToMove', $_POST)) {
    $success = false;
    $message = 'Missing doenetIdsToMove';
} elseif (!array_key_exists('destParentDoenetId', $_POST)) {
    $success = false;
    $message = 'Missing destParentDoenetId';
} elseif (!array_key_exists('destPreviousContainingItemDoenetId', $_POST)) {
    $success = false;
    $message = 'Missing destPreviousContainingItemDoenetId';
} 

//Test Permission to edit content
if ($success){
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
    $doenetIdsToMove = array_map(function ($item) use ($conn) {
        return mysqli_real_escape_string($conn, $item);
    }, $_POST["doenetIdsToMove"]);
    $destParentDoenetId = $_POST["destParentDoenetId"];
    $destPreviousContainingItemDoenetId = $_POST["destPreviousContainingItemDoenetId"];
    

    $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
    if ($permissions["canEditContent"] != '1'){
      $success = FALSE;
      $message = "You need permission to edit content.";
    }
}

if ($success) {

    if (count($doenetIdsToMove) > 0){
       foreach($doenetIdsToMove as $doenetId ){
           echo "doenetId $doenetId\n";
           if ($sortOrder == ""){
               //First item need to check database
               $sql = "SELECT sortOrder
               FROM `course_content`
               WHERE courseId = '$courseId' 
               AND sortOrder >= (Select sortOrder From `course_content` WHERE doenetId='$destPreviousContainingItemDoenetId' AND isDeleted = 0)
               AND isDeleted = 0
               ORDER BY sortOrder
               LIMIT 2";
               $result = $conn->query($sql); 
               $row = $result->fetch_assoc() ;
               $prev = $row['sortOrder'] ?: "";
               $row = $result->fetch_assoc();
               $next = $row['sortOrder'] ?: "";
               $sortOrder = SortOrder\getSortOrder($prev, $next);
           }else{
               //Place each item after the previous one
                $sortOrder = SortOrder\getSortOrder($sortOrder, $next);
            }

           $sql = "
           UPDATE course_content
           SET parentDoenetId = '$destParentDoenetId',
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
