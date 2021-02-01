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


$sql="UPDATE drive_content SET hideUnpublished = 1 WHERE itemId='$itemId';";

$result = $conn->query($sql); 
echo $sql;

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
