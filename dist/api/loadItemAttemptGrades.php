<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$assignmentId =  mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);
$itemNumber =  mysqli_real_escape_string($conn,$_REQUEST["itemNumber"]);
$attemptNumber =  mysqli_real_escape_string($conn,$_REQUEST["attemptNumber"]);


	$sql = "
	SELECT submissionNumber, itemState, submittedDate, valid
	FROM user_assignment_attempt_item_submission
	WHERE username='$remoteuser' 
	AND assignmentId='$assignmentId'
	AND itemNumber='$itemNumber'
	AND attemptNumber='$attemptNumber'
	ORDER BY submissionNumber DESC
	";


$result = $conn->query($sql);

$response_arr = array();

if ($result->num_rows > 0){
	

	$row = $result->fetch_assoc();

	$response_arr = array(
		"submissionNumber" => $row["submissionNumber"],
		"itemState" => $row["itemState"],
		"submittedDate" => $row["submittedDate"],
		"valid" => $row["valid"],
	);
   
}



 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

