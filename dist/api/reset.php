<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

//TODO: DELETE THIS FILE!!!


$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";


$sql = "
DELETE FROM course
";
$result = $conn->query($sql); 

$sql = "
DELETE FROM course_user
";
$result = $conn->query($sql); 
  
$sql = "
DELETE FROM course_content
";
$result = $conn->query($sql); 

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>