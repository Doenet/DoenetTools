<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];
$examUserId = $jwtArray['examineeUserId'];
$examDoenetId = $jwtArray['doenetId'];

$success = TRUE;
$foundAttempt = FALSE;
$message = "";



$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);

if ($userId == ""){
	if ($examUserId == ""){
		$success = FALSE;
		$message = "No access - Need to sign in";
	}else if ($examDoenetId != $doenetId){
		$success = FALSE;
		$message = "No access for doenetId: $doenetId";
	}else{
		$userId = $examUserId;
	}

}

if ($success){

	$contentId = null;

	$sql = "
		SELECT contentId
		FROM user_assignment_attempt
		WHERE userId = '$userId'
		AND doenetId = '$doenetId'
		ORDER BY attemptNumber DESC
		LIMIT 1
	";

	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		$row = $result->fetch_assoc();
		$contentId = $row['contentId'];
		
		if ($contentId){$foundAttempt = TRUE;}
	}
}






$response_arr = array(
	"success" => $success,
	"message" => $message,
	"foundAttempt" => $foundAttempt,
	"contentId" => $contentId,
);
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

