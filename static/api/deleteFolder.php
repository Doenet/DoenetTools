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
// $isRepo = mysqli_real_escape_string($conn,$_REQUEST["isRepo"]);

$success = TRUE;
$results_arr = array();


if ($success){
  // $sql="
  // DELETE FROM folder 
  // WHERE driveId = '$driveId'
  // AND folderId = '$folderId'
  // AND parentId = '$parentId'
  // ";
    $sql="
  UPDATE folder 
  SET isDeleted='1'
  WHERE driveId = '$driveId'
  AND folderId = '$folderId'
  AND parentId = '$parentId'
  ";
  echo $sql;
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