<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$device = $jwtArray['deviceName'];

$_POST = json_decode(file_get_contents("php://input"),true);
$branchId =  mysqli_real_escape_string($conn,$_POST["branchId"]);
$contentId =  mysqli_real_escape_string($conn,$_POST["contentId"]);
$stateVariables =  mysqli_real_escape_string($conn,$_POST["stateVariables"]);
$variant =  mysqli_real_escape_string($conn,$_POST["variant"]);
$attemptNumber =  mysqli_real_escape_string($conn,$_POST["attemptNumber"]);

$sql = "INSERT INTO content_interactions (userId,deviceName,branchId,contentId,stateVariables,variant,attemptNumber,timestamp)
VALUES ('$userId','$device','$branchId','$contentId','$stateVariables','$variant','$attemptNumber',NOW())";

$result = $conn->query($sql);

http_response_code(200);

$conn->close();

?>