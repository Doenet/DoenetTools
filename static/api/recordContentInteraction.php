<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";

$jwtArray = include "jwtArray.php";
$emailaddress = $jwtArray['email'];
$device = $jwtArray['deviceName'];

$_POST = json_decode(file_get_contents("php://input"),true);
$assignmentId =  mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$contentId =  mysqli_real_escape_string($conn,$_POST["contentId"]);
$stateVariables =  mysqli_real_escape_string($conn,$_POST["stateVariables"]);

$sql = "INSERT INTO content_interactions
        SET email='$emailaddress', 
        deviceName='$device',
        assignmentId='$assignmentId',
        contentId='$contentId',
        stateVariables='$stateVariables',
        timestamp=NOW()";
        echo $sql;
$result = $conn->query($sql);

http_response_code(200);

$conn->close();

?>

