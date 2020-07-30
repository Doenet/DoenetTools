<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$device = $jwtArray['deviceName'];
$userId = $jwtArray['userId'];

$sql = "UPDATE user_device
        SET signedIn='0'
        WHERE userId='$userId' AND deviceName = '$device'";
$result = $conn->query($sql);

// set response code - 200 OK
http_response_code(200);

$domain = $ini_array['dbhost']; 
$isSecure = true;  
if ($domain=="127.0.0.1"){
  $domain = 'localhost'; 
  $isSecure = false;  
}
$isHttpOnly = true;
$expirationTime = -10;
setcookie("JWT", "", $expirationTime, "/", $domain, $isSecure, $isHttpOnly);

// make it json format
// echo json_encode($response_arr);

$conn->close();

