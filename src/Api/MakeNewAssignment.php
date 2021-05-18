<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];
$_POST = json_decode(file_get_contents("php://input"),true);
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]);
$driveId = mysqli_real_escape_string($conn,$_POST["driveId"]);
$branchId = mysqli_real_escape_string($conn,$_POST["branchId"]);
$itemId = mysqli_real_escape_string($conn,$_POST["itemId"]);

//make assignment 
$title = mysqli_real_escape_string($conn,$_POST["assignment_title"]);
if($title == ''){$title = 'Untitled Assignment';}
$dueDate = mysqli_real_escape_string($conn,$_POST["dueDate"]);
if ($dueDate == ''){ $dueDate = '0001-01-01 01:01:01';}
$assignedDate = mysqli_real_escape_string($conn,$_POST["assignedDate"]);
if ($assignedDate == ''){ $assignedDate = '0001-01-01 01:01:01';}
$timeLimit = mysqli_real_escape_string($conn,$_POST["timeLimit"]);
if ($timeLimit == ''){ $timeLimit = '01:01:01';}
$numberOfAttemptsAllowed = mysqli_real_escape_string($conn,$_POST["numberOfAttemptsAllowed"]);
if ($numberOfAttemptsAllowed == ''){ $numberOfAttemptsAllowed = '0';}
$attemptAggregation = mysqli_real_escape_string($conn,$_POST["attemptAggregation"]);
if ($attemptAggregation == ''){ $attemptAggregation = 'l';}
$totalPointsOrPercent = mysqli_real_escape_string($conn,$_POST["totalPointsOrPercent"]);
if ($totalPointsOrPercent == ''){ $totalPointsOrPercent = '0';}
$gradeCategory = mysqli_real_escape_string($conn,$_POST["gradeCategory"]);
if ($gradeCategory == ''){ $gradeCategory = 'e';}
$individualize = mysqli_real_escape_string($conn,$_POST["individualize"]);
if ($individualize == ''){ $individualize = '0';}
else if ($individualize){ $individualize = '1';}
$multipleAttempts = mysqli_real_escape_string($conn,$_POST["multipleAttempts"]);
if ($multipleAttempts == ''){ $multipleAttempts = '0';}
else if ($multipleAttempts){ $multipleAttempts = '1';}
$showSolution = mysqli_real_escape_string($conn,$_POST["showSolution"]);
if ($showSolution == ''){ $showSolution = '0';}
else if($showSolution){ $showSolution = '1';}
$showFeedback = mysqli_real_escape_string($conn,$_POST["showFeedback"]);
if ($showFeedback == ''){ $showFeedback = '0';}
else if ($showFeedback){ $showFeedback = '1';}
$showHints = mysqli_real_escape_string($conn,$_POST["showHints"]);
if ($showHints == ''){ $showHints = '0';}
else if ($showHints){ $showHints = '1';}
$showCorrectness = mysqli_real_escape_string($conn,$_POST["showCorrectness"]);
if ($showCorrectness == ''){ $showCorrectness = '0';}
else if ($showCorrectness){ $showCorrectness = '1';}
$proctorMakesAvailable = mysqli_real_escape_string($conn,$_POST["proctorMakesAvailable"]);
if ($proctorMakesAvailable == ''){ $proctorMakesAvailable = '0';}
else if($proctorMakesAvailable){ $proctorMakesAvailable = '1';}

$success = TRUE;
$message = "";

if ($branchId == ""){
  $success = FALSE;
  $message = "Internal Error: missing branchId";
}else if ($contentId == ""){
  $success = FALSE;
  $message = "Internal Error: missing contentId";
}
else if($driveId == ''){
  $success = FALSE;
  $message = "Internal Error: missing driveId";
}

if ($success){

    $sql="
    INSERT INTO assignment
    (
    title,
    branchId,
    contentId,
    driveId,
    assignedDate,
    dueDate,
    timeLimit,
    numberOfAttemptsAllowed,
    attemptAggregation,
    totalPointsOrPercent,
    gradeCategory,
    individualize,
    multipleAttempts,
    showSolution,
    showFeedback,
    showHints,
    showCorrectness,
    proctorMakesAvailable)
    VALUES
    (
      '$title',
      '$branchId',
      '$contentId',
    '$driveId',
    '$assignedDate',
    '$dueDate',
    '$timeLimit',
    '$numberOfAttemptsAllowed',
    '$attemptAggregation',
    '$totalPointsOrPercent',
    '$gradeCategory',
    '$individualize',
    '$multipleAttempts',
    '$showSolution,
    '$showFeedback',
    '$showHints',
    '$showCorrectness',
    '$roctorMakesAvailable')
    ";

$result = $conn->query($sql); 
}
  // echo $sql;
$sqlnew="UPDATE drive_content SET isAssigned=1 WHERE branchId='$branchId';";
//  echo $sqlnew;
$result = $conn->query($sqlnew); 


$response_arr = array(
  "success"=>$success,
  "message"=>$message
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

  
  $conn->close();

?>