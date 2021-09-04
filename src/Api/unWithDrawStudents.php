<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);
$driveId = mysqli_real_escape_string($conn,$_POST["driveId"]);

$email = mysqli_real_escape_string($conn,$_POST["email"]);



	$sql = "
	UPDATE enrollment SET dateWithdrew = NULL , withDrew = 0 WHERE driveId = '$driveId' AND email='$email';
	";
  $result = $conn->query($sql);
$response_arr = array(
	"success" => 1
);
         
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

