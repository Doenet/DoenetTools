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
$folderId = mysqli_real_escape_string($conn,$_REQUEST["folderId"]);
$label = mysqli_real_escape_string($conn,$_REQUEST["label"]);
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
  $sql="
  INSERT INTO folder 
  (driveId,folderId,parentId,label,userId,creationDate)
  VALUES
  ('$driveId','$folderId','$parentId','$label','$userId',NOW())
  ";
  $result = $conn->query($sql); 

}

// var_dump($results_arr);

$response_arr = array(
  "success"=>$success
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>