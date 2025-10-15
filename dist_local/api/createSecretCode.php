<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";

$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);

$permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
//TODO: update to canAccessData when available
if ($permissions["isOwner"] != '1'){
	$success = FALSE;
	$message = "You need permission to access event data.";
}

if ($success){
	$secretCode = include "randomId.php";


	$sql = "
	INSERT INTO eventSecretCodes
	(userId,secretCode,timestamp)
	VALUES
	('$userId','$secretCode' ,NOW())
	";
	$conn->query($sql);
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
	"secretCode"=>$secretCode,
  );

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>