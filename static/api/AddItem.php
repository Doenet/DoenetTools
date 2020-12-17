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
$parentId = mysqli_real_escape_string($conn,$_REQUEST["parentId"]);
$itemId = mysqli_real_escape_string($conn,$_REQUEST["itemId"]);
$label = mysqli_real_escape_string($conn,$_REQUEST["label"]);
$type = mysqli_real_escape_string($conn,$_REQUEST["type"]);

$success = TRUE;
$results_arr = array();
//If not given parentId then use the user's drive
if ($parentId == ""){
  $parentId = "content";
}


$sql="
INSERT INTO drive_$driveId 
(parentId,itemId,label,creationDate,isDeleted,itemType)
VALUES
('$parentId','$itemId','$label',NOW(),'0','$type')
";
$result = $conn->query($sql); 


$response_arr = array(
  "success"=>$success
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>