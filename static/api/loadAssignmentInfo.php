<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
$assignmentId =  mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);
$sql="SELECT proctorMakesAvailable,assignmentName,individualize,multipleAttempts,
showSolution,showFeedback,showHints,showCorrectness,gradeCategory,
totalPointsOrPercent,
assignedDate,dueDate,timeLimit,numberOfAttemptsAllowed
FROM assignment where assignmentId='$assignmentId'";
$result = $conn->query($sql); 
$row = $result->fetch_assoc();
$response_arr = array(
  "assignmentName" => $row['assignmentName'],
  "assignedDate" => $row['assignedDate'],
  "dueDate" => $row['dueDate'],
  "timeLimit" => $row['timeLimit'],
  "gradeCategory" => $row['gradeCategory'],
  "totalPointsOrPercent" => $row['totalPointsOrPercent'],

  "numberOfAttemptsAllowed" => $row['numberOfAttemptsAllowed'],
  "individualize" => $row['individualize'],
  "multipleAttempts" => $row['multipleAttempts'],
  "showSolution" => $row['showSolution'],
  "showFeedback" => $row['showFeedback'],
  "showHints" => $row['showHints'],
  "proctorMakesAvailable" => $row['proctorMakesAvailable'],
  "showCorrectness" => $row['showCorrectness'],
);
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>