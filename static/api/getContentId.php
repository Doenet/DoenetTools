<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];


$itemId =  mysqli_real_escape_string($conn,$_REQUEST["itemId"]);

$sql = "SELECT * FROM drive_content where itemId='$itemId';";
$resultCheck = $conn->query($sql); 
// echo $sqlAssigmentCheck;
$responseAssignment = 0;
$response_arr = array();
if ($resultCheck->num_rows > 0){
  $responseAssignment = 1;
  $row = $resultCheck->fetch_assoc();
  $response_arr = array(
      "contentId" => $row['contentId']
  );
}
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();
