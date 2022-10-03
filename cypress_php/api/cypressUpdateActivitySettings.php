<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: access");
	header("Access-Control-Allow-Methods: POST");
	header("Access-Control-Allow-Credentials: true");
	header('Content-Type: application/json');

	include '../api/db_connection.php';

	$success = TRUE;
	$message = "";

	$_POST = json_decode(file_get_contents("php://input"),true);

	$courseId = $_POST['courseId'];
	$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);
	$activitySettings = json_decode($_POST['activitySettings']);
	
	if (!$courseId){
		$success = FALSE;
		$message = "Internal Error: missing courseId";
		http_response_code(400);
	}

	if (!$doenetId){
		$success = FALSE;
		$message = "Internal Error: missing doenetId";
		http_response_code(400);
	}

	// $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
	// if ($permissions["canModifyActivitySettings"] != '1'){
	//   $success = FALSE;
	//   $message = "You need permission to edit content.";
	//   http_response_code(403);
	// }
	
	$settingsToUpdate = "
		assignedDate = '$activitySettings->assignedDate',
		dueDate = '$activitySettings->dueDate',
		timeLimit = $activitySettings->timeLimit,
		numberOfAttemptsAllowed = $activitySettings->numberOfAttemptsAllowed,
		attemptAggregation = '$activitySettings->attemptAggregation', 
		totalPointsOrPercent = $activitySettings->totalPointsOrPercent,
		gradeCategory = '$activitySettings->gradeCategory',
		individualize = $activitySettings->individualize,
		showSolution = $activitySettings->showSolution,
		showSolutionInGradebook = $activitySettings->showSolutionInGradebook,
		showFeedback = $activitySettings->showFeedback,
		showHints = $activitySettings->showHints,
		showCorrectness = $activitySettings->showCorrectness,
		showCreditAchievedMenu = $activitySettings->showCreditAchievedMenu,
		paginate = $activitySettings->paginate,
		showFinishButton = $activitySettings->showFinishButton,
		proctorMakesAvailable = $activitySettings->proctorMakesAvailable,
		pinnedUntilDate = '$activitySettings->pinnedUntilDate',
		pinnedAfterDate = '$activitySettings->pinnedAfterDate'
	";

	$sql = "INSERT INTO `assignment` SET
		doenetId = '$doenetId',
		courseId = '$courseId',
		$settingsToUpdate
		ON DUPLICATE KEY UPDATE
		$settingsToUpdate";

	$result = $conn->query($sql);

	if ($result == false) {
		$success = FALSE;
		$message = "Database error";
		http_response_code(500);
	}
	 
	$itemWeights = implode(",", $activitySettings->itemWeights);

	$sql = "UPDATE course_content
	SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.itemWeights',JSON_ARRAY($itemWeights))
	WHERE doenetId='$doenetId'
	AND courseId='$courseId'
	";
	$result = $conn->query($sql);

	if ($result == false) {
		$success = FALSE;
		$message = "Database error";
		http_response_code(500);
	}

	$response_arr = array(
		"success"=>$success,
		"message"=>$message
	);

	// make it json format
	echo json_encode($response_arr);
	
  $conn->close();
?>