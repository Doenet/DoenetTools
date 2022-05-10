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
$studentUserId = mysqli_real_escape_string($conn,$_REQUEST["userId"]);

if ($doenetId == ""){
	$success = FALSE;
	$message = 'Internal Error: missing doenetId';
}

//If javascript didn't send a userId use the signed in $userId
if ($studentUserId == ""){
  $studentUserId = $userId;
}

//We let users see their own grades
//But if it's a different student you need to 
//have permission
if ($success && $studentUserId != $userId){
  //TODO: Need a permission related to see grades (not du.canEditContent)
  $sql = "
  SELECT du.canEditContent 
  FROM drive_user AS du
  LEFT JOIN drive_content AS dc
  ON dc.driveId = du.driveId
  WHERE du.userId = '$userId'
  AND dc.doenetId = '$doenetId'
  AND du.canEditContent = '1'
  ";

  $result = $conn->query($sql);
  if ($result->num_rows < 1) {
    $success = FALSE;
    $message = "You don't have permission to view $studentUserId ";
  }
}


if($success) {

	// check if can show solution in gradebook
	$sql = "
  SELECT showSolutionInGradebook
  FROM assignment
  WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  $showSolutionInGradebook = $row['showSolutionInGradebook'];

	$sql = "
		SELECT 
		cid,
		generatedVariant,
		attemptNumber
		FROM user_assignment_attempt
		WHERE userId = '$studentUserId'
		AND doenetId = '$doenetId'
    ORDER BY attemptNumber ASC
	";

	$result = $conn->query($sql); 

	$attemptInfo = [];
	if ($result->num_rows > 0) {
		$foundAttempt = TRUE;
	
		while($row = $result->fetch_assoc()){

			array_push($attemptInfo,array(
				"attemptNumber" => $row['attemptNumber'],
				"cid"=>$row['cid'],
				"variant"=>$row['generatedVariant']
			));
		}
	}
}

$response_arr = array(
	"success" => $success,
	"message" => $message,
	"foundAttempt" => $foundAttempt,
	"attemptInfo" => $attemptInfo,
	"showSolutionInGradebook" => $showSolutionInGradebook
);
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

