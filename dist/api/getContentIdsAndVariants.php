<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$foundAttempt = FALSE;
$message = "";

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$searchUserId = mysqli_real_escape_string($conn,$_REQUEST["userId"]);


	//check user has permission to edit drive
	$sql = "
		SELECT contentId,generatedVariant
		FROM user_assignment_attempt
		WHERE userId = '$searchUserId'
		AND doenetId = '$doenetId'
    ORDER BY attemptNumber ASC
	";

	$result = $conn->query($sql); 

	$attemptInfo = [];
	if ($result->num_rows > 0) {
		$foundAttempt = TRUE;
	
		while($row = $result->fetch_assoc()){

			array_push($attemptInfo,array(
				"contentId"=>$row['contentId'],
				"variant"=>$row['generatedVariant']
			));
		}
	}

$response_arr = array(
	"success" => $success,
	"message" => $message,
	"foundAttempt" => $foundAttempt,
	"attemptInfo" => $attemptInfo,
);
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

