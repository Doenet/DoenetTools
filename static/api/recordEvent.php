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
$assignmentId =  mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$contentId =  mysqli_real_escape_string($conn,$_POST["contentId"]);
$attemptNumber =  mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$verb =  mysqli_real_escape_string($conn,$_POST["verb"]);
$object =  mysqli_real_escape_string($conn,$_POST["object"]);
$result =  mysqli_real_escape_string($conn,$_POST["result"]);
$context =  mysqli_real_escape_string($conn,$_POST["context"]);
$version =  mysqli_real_escape_string($conn,$_POST["version"]);
$timestamp =  mysqli_real_escape_string($conn,$_POST["timestamp"]);


$sql = "INSERT INTO event (agent,deviceName,assignmentId,contentId,attemptNumber,verb,object,result,context,version,timestamp,timestored)
VALUES ('$userId','$device','$assignmentId','$contentId','$attemptNumber','$verb','$object','$result','$context','$version','$timestamp',NOW())";

$result = $conn->query($sql);

http_response_code(200);

$conn->close();

?>

