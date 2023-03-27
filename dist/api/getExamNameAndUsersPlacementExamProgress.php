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

	
	//Assignment number of attempts
	//Blank means infinite attempts
	$sql = "
		SELECT numberOfAttemptsAllowed
		FROM assignment
		WHERE doenetId = '$doenetId'
	";

	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		$row = $result->fetch_assoc();
			$assignment_numberOfAttemptsAllowed = $row['numberOfAttemptsAllowed'];
	}else{
		$success = false;
    $message = "Internal Error: activity not found in database.";
	}

	//Users numberOfAttemptsAllowedAdjustment
	//blank means zero
	$numberOfAttemptsAllowed = $assignment_numberOfAttemptsAllowed;
	$numberOfAttemptsAllowedAdjustment = 0;
	if ($assignment_numberOfAttemptsAllowed != ""){
		//TODO: test this code
		$sql = "
		SELECT numberOfAttemptsAllowedAdjustment
		FROM user_assignment
		WHERE doenetId = '$doenetId'
		AND userId = '$userId'
	";

	$result = $conn->query($sql);
		if ($result->num_rows > 0) {
			$row = $result->fetch_assoc();
				$numberOfAttemptsAllowedAdjustment = $row['numberOfAttemptsAllowedAdjustment'];
				if ($numberOfAttemptsAllowedAdjustment != ""){
					$numberOfAttemptsAllowed = $numberOfAttemptsAllowed + $numberOfAttemptsAllowedAdjustment;
				}
		}
	}

	//TODO: Figure out if the exam is done.  
	//Requires knowing if time was extended
	//Set Finish on user_assignment_attempt if time expired


	$status = 'Not Started';
	if ($assignment_numberOfAttemptsAllowed != ""){
		
	//Test if not started or if completed
	//Else is In Progress
	$sql = "
		SELECT began, finished
		FROM user_assignment_attempt
		WHERE doenetId = '$doenetId'
		AND userId = '$userId'
		AND attemptNumber = '$attemptNumber'
	";

	$result = $conn->query($sql);
		if ($result->num_rows > 0) {
			$row = $result->fetch_assoc();
			$began = $row['began'];
			$finished = $row['finished'];
			if ($finished != ""){
				$status = 'Completed';
			}else if ($began == ""){
				$status = 'Not Started';
			}else{
				$status = 'In Progress';
			}
		}
	}

	//Get User's First Name and Last Name
	$sql = "
	SELECT firstName, lastName
	FROM user
	WHERE userId = '$userId'
	";

	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		$row = $result->fetch_assoc();
		$firstName = $row['firstName'];
		$lastName = $row['lastName'];
	}

	//Get examName which is the label of the course content
	$sql = "
	SELECT label
	FROM course_content
	WHERE doenetId = '$doenetId'
	";

	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		$row = $result->fetch_assoc();
		$examName = $row['label'];
	}

}


$response_arr = array(
	"success" => $success,
	"message" => $message,
	"status" => $status, // 'Not Started' | 'In Progress' | 'Completed'
	"examName" => $examName,
	"firstName" => $firstName,
	"lastName" => $lastName,
);
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

