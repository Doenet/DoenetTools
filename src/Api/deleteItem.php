<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

// $parentFolderId = mysqli_real_escape_string($conn,$_REQUEST["parentFolderId"]);
$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
$itemId = mysqli_real_escape_string($conn,$_REQUEST["itemId"]);

$success = TRUE;
$message = "";


if ($driveId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing driveId';
}elseif ($itemId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing itemId';
}elseif ($userId == ""){
  $success = FALSE;
  $message = "You need to be signed in to delete";
}


if ($success){
  //Check for permissions
  $sql = "
  SELECT canDeleteItemsAndFolders
  FROM drive_user
  WHERE userId = '$userId'
  AND driveId = '$driveId'
  ";
  $result = $conn->query($sql); 
  if ($result->num_rows > 0){
  $row = $result->fetch_assoc();
  $canDelete = $row["canDeleteItemsAndFolders"];
  if (!$canDelete){
    $success = FALSE;
    $message = "No permission to delete";
  }
  }
}

if ($success){
  $sql="
  UPDATE drive_content 
  SET isDeleted='1'
  WHERE driveId = '$driveId'
  AND itemId = '$itemId'
  ";
  $result = $conn->query($sql); 
}
//AND parentFolderId = '$parentFolderId'


$response_arr = array(
  "success"=>$success,
  "message"=>$message
  );;

// set response code - 200 OK
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>