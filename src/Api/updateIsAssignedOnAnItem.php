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

// if (array_key_exists('driveId', get_defined_vars())) {
$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$isAssigned = mysqli_real_escape_string($conn,$_REQUEST["isAssigned"]);

if ($courseId == "") {
	$success = false;
	$message = "Internal Error: missing courseId";
}else	if ($doenetId == "") {
	$success = false;
	$message = "Internal Error: missing doenetId";
}else	if ($isAssigned == "") {
	$success = false;
	$message = "Internal Error: missing isAssigned";
}

if ($isAssigned == 'true'){
	$isAssigned = 1;
}else{
	$isAssigned = 0;
}


if ($success){
	$permissions = permissionsAndSettingsForOneCourseFunction( $conn, $userId, $courseId );
	if ($permissions["canEditContent"] != '1'){
		$success = false;
		$message = "You need permission to edit content";
	}
}

if ($success){
	$sql = "
	UPDATE course_content
	SET isAssigned = $isAssigned
	WHERE doenetId = '$doenetId'
	";

$result = $conn->query($sql);
	
}



$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  );

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>