<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

// echo "userId".$userId;
$sql="SELECT * FROM user_device WHERE email='devuser@example.com' AND userId = 'devuserid' ORDER BY id DESC LIMIT 1";


$result = $conn->query($sql);
$row = $result->fetch_assoc();
$signInCode = $row["signInCode"];
$deviceName = $row["deviceName"];
$userId = $row["userId"];


  $response_arr = array(
    "deviceName" => $deviceName,
    "signInCode"=>$signInCode,
    "userId"=>$userId,
    );
// http_response_code(200);
echo json_encode($response_arr);
 $conn->close();
?>