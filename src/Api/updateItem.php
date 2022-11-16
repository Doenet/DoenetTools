<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
$itemId = mysqli_real_escape_string($conn,$_REQUEST["itemId"]);
$label = mysqli_real_escape_string($conn,$_REQUEST["label"]);
$instruction = mysqli_real_escape_string($conn,$_REQUEST["instruction"]);

$success = TRUE;
$results_arr = array();

//TODO: Check for permisions first


if ($instruction == "rename"){
  $sql = "
  UPDATE drive_content
  SET label='$label'
  WHERE driveId = '$driveId'
  AND itemId = '$itemId'
  ";
$result = $conn->query($sql); 
}
// if ($type == "delete drive"){
//   $sql = "
//   UPDATE drive
//   SET isDeleted='1'
//   WHERE driveId = '$driveId'
//   ";
// $result = $conn->query($sql); 
// }

$response_arr = array(
  "success"=>$success
  );

// set response code - 200 OK
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>