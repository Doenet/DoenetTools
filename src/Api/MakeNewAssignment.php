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
$driveId = mysqli_real_escape_string($conn,$_POST["driveId"]);
$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$versionId = mysqli_real_escape_string($conn,$_POST["versionId"]);
$cid = mysqli_real_escape_string($conn,$_POST["cid"]);

//make assignment 
$dueDate = mysqli_real_escape_string($conn,$_POST["dueDate"]);
if ($dueDate == ''){ $dueDate = '0001-01-01 01:01:01';}
$assignedDate = mysqli_real_escape_string($conn,$_POST["assignedDate"]);
if ($assignedDate == ''){ $assignedDate = '0001-01-01 01:01:01';}
$timeLimit = mysqli_real_escape_string($conn,$_POST["timeLimit"]);
if ($timeLimit == ''){ $timeLimit = NULL;}
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
$showSolution = mysqli_real_escape_string($conn,$_POST["showSolution"]);
if ($showSolution == ''){ $showSolution = '0';}
else if($showSolution){ $showSolution = '1';}
$showSolutionInGradebook = mysqli_real_escape_string($conn,$_POST["showSolutionInGradebook"]);
if ($showSolutionInGradebook == ''){ $showSolutionInGradebook = '0';}
else if($showSolutionInGradebook){ $showSolutionInGradebook = '1';}
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
$autoSubmit = mysqli_real_escape_string($conn,$_POST["autoSubmit"]);
if ($autoSubmit == ''){ $autoSubmit = '0';}
else if($autoSubmit){ $autoSubmit = '1';}

$success = TRUE;
$message = "";

if ($doenetId == ""){
  $success = FALSE;
  $message = "Internal Error: missing doenetId";
}
else if($driveId == ''){
  $success = FALSE;
  $message = "Internal Error: missing driveId";
}

if ($success){
    $sqlnew="SELECT * from assignment WHERE doenetId = '$doenetId'";
    $resultnew = $conn->query($sqlnew); 
    if ($resultnew->num_rows > 0){
      $sqlUpdate = "UPDATE assignment SET 
      doenetId=$doenetId,
      driveId=$driveId,
      assignedDate=$assignedDate,
      dueDate=$dueDate,
      timeLimit=$timeLimit,
      numberOfAttemptsAllowed=$numberOfAttemptsAllowed,
      attemptAggregation=$attemptAggregation,
      totalPointsOrPercent=$totalPointsOrPercent,
      gradeCategory=$gradeCategory,
      individualize=$individualize,
      showSolution=$showSolution,
      showSolutionInGradebook=$showSolutionInGradebook,
      showFeedback=$showFeedback,
      showHints=$showHints,
      showCorrectness=$showCorrectness,
      proctorMakesAvailable=$proctorMakesAvailable,
      autoSubmit=$autoSubmit
      WHERE doenetId='$doenetId'
      ";
          $result = $conn->query($sqlUpdate); 

    }else{
      $sql="
      INSERT INTO assignment
      (
      doenetId,
      cid,
      driveId,
      assignedDate,
      dueDate,
      timeLimit,
      numberOfAttemptsAllowed,
      attemptAggregation,
      totalPointsOrPercent,
      gradeCategory,
      individualize,
      showSolution,
      showSolutionInGradebook,
      showFeedback,
      showHints,
      showCorrectness,
      proctorMakesAvailable,
      autoSubmit)
      VALUES
      (
        '$doenetId',
        '$cid',
      '$driveId',
      '$assignedDate',
      '$dueDate',
      '$timeLimit',
      '$numberOfAttemptsAllowed',
      '$attemptAggregation',
      '$totalPointsOrPercent',
      '$gradeCategory',
      '$individualize',
      '$showSolution',
      '$showSolutionInGradebook',
      '$showFeedback',
      '$showHints',
      '$showCorrectness',
      '$proctorMakesAvailable',
      '$autoSubmit')
      ";
    
  $result = $conn->query($sql); 
    }
    

}
  // echo $sql;
$sqlnew="UPDATE drive_content SET isAssigned=1 WHERE doenetId='$doenetId';";
//  echo $sqlnew;
$result = $conn->query($sqlnew);

$sql ="UPDATE content SET isAssigned=1 WHERE doenetId='$doenetId' AND versionId='$versionId';";
$result = $conn->query($sql); 

$response_arr = array(
  "success"=>$success,
  "message"=>$message
  );


// set response code - 200 OK
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);

  
  $conn->close();

?>