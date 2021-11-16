<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];


// $assignmentId =  mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);
$doenetId =  mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
// $contentId =  mysqli_real_escape_string($conn,$_REQUEST["contentId"]);
// $versionId =  mysqli_real_escape_string($conn,$_REQUEST["versionId"]);

// $assignment_arr = array();
$success = true;
$message = '';

if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}

$assignment = array();

  $sql = "SELECT
  a.assignedDate AS assignedDate,
  a.dueDate AS dueDate,
  a.pinnedAfterDate As pinnedAfterDate,
  a.pinnedUntilDate As pinnedUntilDate,
  a.timeLimit AS timeLimit,
  a.numberOfAttemptsAllowed AS numberOfAttemptsAllowed,
  a.attemptAggregation AS attemptAggregation,
  a.totalPointsOrPercent AS totalPointsOrPercent,
  a.gradeCategory AS gradeCategory,
  a.individualize AS individualize,
  a.multipleAttempts AS multipleAttempts,
  a.showSolution AS showSolution,
  a.showSolutionInGradebook AS showSolutionInGradebook,
  a.showFeedback AS showFeedback,
  a.showHints AS showHints,
  a.showCorrectness AS showCorrectness,
  a.showCreditAchievedMenu AS showCreditAchievedMenu,
  a.proctorMakesAvailable AS proctorMakesAvailable,
  a.doenetId AS doenetId
  FROM assignment AS a
  WHERE a.doenetId = '$doenetId' 
  ";
  $result = $conn->query($sql);
  if ($result->num_rows > 0){
    $row = $result->fetch_assoc();
    $assignment = array(
          "assignment_title" => $row['assignment_title'],
          "assignedDate" => $row['assignedDate'],
          "pinnedAfterDate" => $row['pinnedAfterDate'],
          "pinnedUntilDate" => $row['pinnedUntilDate'],
          "dueDate" => $row['dueDate'],
          "timeLimit" => $row['timeLimit'],
          "numberOfAttemptsAllowed" => $row['numberOfAttemptsAllowed'],
          "attemptAggregation" => $row['attemptAggregation'],
          "totalPointsOrPercent" => $row['totalPointsOrPercent'],
          "gradeCategory" => $row['gradeCategory'],
          "individualize" => $row['individualize'] == '1' ? true : false,
          "multipleAttempts" => $row['multipleAttempts']  == '1' ? true : false,
          "showSolution" => $row['showSolution'] == '1' ? true : false,
          "showSolutionInGradebook" => $row['showSolutionInGradebook'] == '1' ? true : false,
          "showFeedback" => $row['showFeedback'] == '1' ? true : false,
          "showHints" => $row['showHints'] == '1' ? true : false,
          "showCorrectness" => $row['showCorrectness'] == '1' ? true : false,
          "showCreditAchievedMenu" => $row['showCreditAchievedMenu'] == '1' ? true : false,
          "proctorMakesAvailable" => $row['proctorMakesAvailable'] == '1' ? true : false,
          "doenetId" => $row['doenetId']
    );
  }
$response_arr = array(
  "success"=>$success,
  "assignment"=>$assignment,
  "message"=>$message
);

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();


?>
