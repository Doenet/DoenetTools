<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$parentId = mysqli_real_escape_string($conn,$_REQUEST["parentId"]);
$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
$isRepo = mysqli_real_escape_string($conn,$_REQUEST["isRepo"]);

$success = TRUE;
$results_arr = array();
//If not given parentId then use the user's drive
if ($parentId == ""){
  // $sql="
  // SELECT
  //  driveId 
  // FROM user
  // WHERE userId = '$userId'
  // ";
  
  // $result = $conn->query($sql); 
  // $row = $result->fetch_assoc();
  $parentId = "content";
  $isRepo = FALSE;
}

if ($isRepo){
//Is the user is a part of the group or is the repo public?
//TODO: Set $success = FALSE if user doesn't have access
}



if ($success){
  $results_arr[$parentId] = selectChildren($parentId,$userId,$driveId,$conn);
  $children_arr = array_keys($results_arr[$parentId]);
  foreach ($children_arr as &$childId){
    $results_arr[$childId] = selectChildren($childId,$userId,$driveId,$conn);
  }
}

// var_dump($results_arr);

$response_arr = array(
  "results"=>$results_arr,
  "success"=>$success
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

function selectChildren($parentId,$userId,$driveId,$conn){
  $return_arr = array();
  //ADD FOLDERS AND REPOS
  $sql="
  SELECT 
    f.folderId as folderId,
    f.label as label,
    f.parentId as parentId,
    f.creationDate as creationDate,
    f.isRepo as isRepo,
    f.isDeleted as isDeleted
  FROM folder AS f
  WHERE userId = '$userId'
  AND parentId = '$parentId'
  AND driveId = '$driveId'
  AND isDeleted = 0
  ";

  $result = $conn->query($sql); 
  while($row = $result->fetch_assoc()){ 
    $type = "Folder";
    if ($row['isRepo']){$type = "Repo";}
  $item = array(
    "id"=>$row['folderId'],
    "label"=>$row['label'],
    "parentId"=>$parentId,
    "type"=>$type
  );
  $return_arr[$row['folderId']] = $item;
  // array_push($return_arr, $item);
  }
  return $return_arr;
}


?>