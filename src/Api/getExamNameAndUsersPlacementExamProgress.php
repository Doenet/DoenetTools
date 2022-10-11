<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

//Needs shib login stuff and create account and cookie stuff
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$foundAttempt = FALSE;
$message = "";

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);

if ($userId == ""){
		$success = FALSE;
		$message = "No access - Need to sign in";
}else if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
}

if ($success){

	//TODO: update timelimit multiplier 1 or 120/65 in decimal?? if extended or maybe 2
	//comes from url with extended=true

	//how to know what attempt they are allowed?
	//assignment table numberOfAttemptsAllowed + user_assignment table numberOfAttemptsAllowedAdjustment 
	//= number allowed

	//Check finished is not null or timer expired

	$sql = "
		SELECT label
		FROM drive_content
		WHERE doenetId = '$doenetId'
	";

	// $result = $conn->query($sql);
	// if ($result->num_rows > 0) {
	// 	$row = $result->fetch_assoc();
	// 	$label = $row['label'];
		
	// }
}






$response_arr = array(
	"success" => $success,
	"message" => $message,
	"status" => $status, // 'Never Started' | 'In Progress' | 'Completed'
	"examName" => $examName,
	"firstName" => $firstName,
	"lastName" => $lastName,
);
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

