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
$tool = mysqli_real_escape_string($conn,$_REQUEST["tool"]);
$studentUserId = mysqli_real_escape_string($conn,$_REQUEST["userId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_REQUEST["attemptNumber"]);


$success = TRUE;
$databaseError = FALSE;

$message = "";
if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}elseif ($attemptNumber == ""){
  $success = FALSE;
  $message = 'Internal Error: missing attemptNumber';
}elseif ($tool == ""){
  $success = FALSE;
  $message = 'Internal Error: missing tool';
}

//If javascript didn't send a userId use the signed in $userId
if ($studentUserId == ""){
  $studentUserId = $userId;
}
//We let users see their own grades
//But if it's a differnet student you need to 
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


if ($success){

  $sql = "
  SELECT showCorrectness,
  totalPointsOrPercent
  FROM assignment
  WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  $showCorrectness = $row['showCorrectness'];
  $totalPointsOrPercent = $row['totalPointsOrPercent'];

  //Override show correctness is false if we are in the gradebook
  $subTool = substr($tool,0,9);
  if ($showCorrectness == '1' || $subTool == 'gradebook' ){ 
    // look credit for assignment from user_asssignment
    $sql = "SELECT credit
            FROM user_assignment
            WHERE userId = '$studentUserId'
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
            WHERE userId = '$studentUserId'
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
        WHERE userId = '$studentUserId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        ORDER BY itemNumber
        ";
    $result = $conn->query($sql);

    $credit_by_item = array();

    while($row = $result->fetch_assoc()){ 
      $credit_by_item[] = $row['credit'];
    }
  }
}

$response_arr = array(
  "success"=> $success,
  "databaseError"=>$databaseError,
  "creditForAttempt"=>$credit_for_attempt,
  "creditForAssignment"=>$credit_for_assignment,
  "creditByItem"=>$credit_by_item,
  "showCorrectness"=>$showCorrectness,
  "totalPointsOrPercent"=>$totalPointsOrPercent,
);

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
