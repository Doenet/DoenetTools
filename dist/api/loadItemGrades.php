<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$assignmentId =  mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);
$attemptNumber =  mysqli_real_escape_string($conn,$_REQUEST["attemptNumber"]);

//Assume latest attempt if no attempt number is given
if ($attemptNumber == "" ){
	$sql = "
	SELECT credit, attemptNumber, itemNumber
	FROM user_assignment_attempt_item
	WHERE username='$remoteuser' 
	AND assignmentId='$assignmentId'
	AND attemptNumber= (SELECT MAX(attemptNumber) AS attemptNumber FROM user_assignment_attempt_item WHERE username='$remoteuser'  AND assignmentId='$assignmentId'  )
	ORDER BY itemNumber
	";
}else{
	$sql = "
SELECT credit, attemptNumber, itemNumber
FROM user_assignment_attempt_item
WHERE username='$remoteuser' 
AND assignmentId='$assignmentId'
AND attemptNumber= '$attemptNumber'
ORDER BY itemNumber
";
}



$result = $conn->query($sql);

$assignmentItems_arr = array();



if ($result->num_rows > 0){
	

    while($row = $result->fetch_assoc()){ 
			$attemptNumber = $row['attemptNumber'];  //make sure it's defined
			$itemNumber = $row['itemNumber'];
			$title = "item $itemNumber";
			$credit = $row["credit"];
			$items_arr = array(
				"title" => $title,
				"credit" => $credit,
				"itemNumber" => $itemNumber,
			);
		array_push($assignmentItems_arr, $items_arr);
		}
   
	}

	$sql = "
SELECT credit
FROM user_assignment_attempt
WHERE username='$remoteuser' 
AND assignmentId='$assignmentId'
AND attemptNumber= '$attemptNumber'
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$attemptCredit = $row['credit'];

$response_arr = array(
		"assignmentItems" => $assignmentItems_arr,
		"attemptNumber" => $attemptNumber,
		"attemptCredit" => $attemptCredit,
	);

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

