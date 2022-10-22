<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
// include "permissionsAndSettingsForOneCourseFunction.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);

if ($doenetId == "") {
	$success = false;
	$message = "Internal Error: missing doenetId";
}


if ($success){
// 	$permissions = permissionsAndSettingsForOneCourseFunction( $conn, $userId, $courseId );
// 	if ($permissions["canEditContent"] != '1'){
// 		$success = false;
// 		$message = "You need permission to edit content";
// 	}
// }

	$sql = "
	UPDATE user_assignment
	SET completed = 1, completedDate = NOW()
	WHERE doenetId = '$doenetId'
	AND userId = '$userId'
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