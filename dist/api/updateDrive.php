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
$label = mysqli_real_escape_string($conn,$_REQUEST["label"]);
$type = mysqli_real_escape_string($conn,$_REQUEST["type"]);

$success = TRUE;
$results_arr = array();

//TODO: Check for permisions first

if ($type == "update drive label"){
  $sql = "
  UPDATE drive
  SET label='$label'
  WHERE driveId = '$driveId'
  ";
$result = $conn->query($sql); 
}
if ($type == "delete drive"){
  $sql = "
  UPDATE drive
  SET isDeleted='1'
  WHERE driveId = '$driveId'
  ";
$result = $conn->query($sql); 
}

$response_arr = array(
  "success"=>$success
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>