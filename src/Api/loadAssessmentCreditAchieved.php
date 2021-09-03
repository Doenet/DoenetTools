<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_REQUEST["attemptNumber"]);

$success = TRUE;
$message = "";
if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}elseif ($attemptNumber == ""){
  $success = FALSE;
  $message = 'Internal Error: missing attemptNumber';
}

$databaseError = FALSE;


// look credit for assignment from user_asssignment
$sql = "SELECT credit
        FROM user_assignment
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        ";

$result = $conn->query($sql);
if ($result->num_rows < 1){ 
  $databaseError = 1;
  $credit_for_assignment = 0;
  $success = FALSE;
} else {

  $row = $result->fetch_assoc();
  $credit_for_assignment = $row['credit'];

}

// Get credit for attempt from user_assignment_attempt
$sql = "SELECT credit
        FROM user_assignment_attempt
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        ";
$result = $conn->query($sql);

if ($result->num_rows < 1){
  $databaseError = 2;
  $credit_for_attempt = 0;
  $success = FALSE;
} else {
  $row = $result->fetch_assoc();
  $credit_for_attempt = $row['credit'];
}


// Get credit for each item of attempt from user_assignment_attempt_item
$sql = "SELECT credit
    FROM user_assignment_attempt_item
    WHERE userId = '$userId'
    AND doenetId = '$doenetId'
    AND attemptNumber = '$attemptNumber'
    ORDER BY itemNumber
    ";
$result = $conn->query($sql);

$credit_by_item = array();

while($row = $result->fetch_assoc()){ 
  $credit_by_item[] = $row['credit'];
}

$response_arr = array(
  "success"=> $success,
  "databaseError"=>$databaseError,
  "creditForAttempt"=>$credit_for_attempt,
  "creditForAssignment"=>$credit_for_assignment,
  "creditByItem"=>$credit_by_item
);

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
