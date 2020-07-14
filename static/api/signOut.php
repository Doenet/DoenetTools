<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$emailaddress = $jwtArray['email'];
$device = $jwtArray['deviceName'];

$sql = "UPDATE user_device
        SET signedIn='0'
        WHERE email='$emailaddress' AND deviceName = '$device'";
$result = $conn->query($sql);

// set response code - 200 OK
http_response_code(200);

// make it json format
// echo json_encode($response_arr);

$conn->close();

