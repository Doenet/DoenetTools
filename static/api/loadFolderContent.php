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
$isRepo = mysqli_real_escape_string($conn,$_REQUEST["isRepo"]);

$success = TRUE;
$contents_arr = array();
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

  //ADD FOLDERS AND REPOS
  $sql="
  SELECT 
    f.folderId as folderId,
    f.label as label,
    f.parentId as parentId,
    f.creationDate as creationDate,
    f.isRepo as isRepo
  FROM folder AS f
  WHERE userId = '$userId'
  AND parentId = '$parentId'
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

  array_push($contents_arr, $item);
  }
}


$response_arr = array(
  "contents"=>$contents_arr,
  "success"=>$success
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();


?>