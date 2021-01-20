<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

//TODO: Make sure of instructor
$_POST = json_decode(file_get_contents("php://input"),true);

$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$title = mysqli_real_escape_string($conn,$_POST["title"]);
$dueDate = mysqli_real_escape_string($conn,$_POST["dueDate"]);
if ($dueDate == ''){ $dueDate = '1-1-1 01:01:01';}
$assignedDate = mysqli_real_escape_string($conn,$_POST["assignedDate"]);
if ($assignedDate == ''){ $assignedDate = '1-1-1 01:01:01';}
$timeLimit = mysqli_real_escape_string($conn,$_POST["timeLimit"]);
$numberOfAttemptsAllowed = mysqli_real_escape_string($conn,$_POST["numberOfAttemptsAllowed"]);
$attemptAggregation = mysqli_real_escape_string($conn,$_POST["attemptAggregation"]);
$totalPointsOrPercent = mysqli_real_escape_string($conn,$_POST["totalPointsOrPercent"]);
$gradeCategory = mysqli_real_escape_string($conn,$_POST["gradeCategory"]);
$individualize = mysqli_real_escape_string($conn,$_POST["individualize"]);
$multipleAttempts = mysqli_real_escape_string($conn,$_POST["multipleAttempts"]);
$showSolution = mysqli_real_escape_string($conn,$_POST["showSolution"]);
$showFeedback = mysqli_real_escape_string($conn,$_POST["showFeedback"]);
$showHints = mysqli_real_escape_string($conn,$_POST["showHints"]);
$showCorrectness = mysqli_real_escape_string($conn,$_POST["showCorrectness"]);
$proctorMakesAvailable = mysqli_real_escape_string($conn,$_POST["proctorMakesAvailable"]);
$makeContent =  mysqli_real_escape_string($conn,$_POST["makeContent"]);
$itemId =  mysqli_real_escape_string($conn,$_POST["itemId"]);
$submitted =  mysqli_real_escape_string($conn,$_POST["isSubmitted"]);
$courseId =  mysqli_real_escape_string($conn,$_POST["courseId"]);
$role =  mysqli_real_escape_string($conn,$_POST["role"]);

$type = $role == 'Instructor' ? 'assignment_draft' : 'assignment';

$sql="
INSERT INTO assignment
(assignmentId,courseId,title,dueDate,assignedDate,timeLimit,numberOfAttemptsAllowed,attemptAggregation,totalPointsOrPercent,gradeCategory,individualize,multipleAttempts,showSolution,showFeedback,showHints,showCorrectness,proctorMakesAvailable)
VALUES
('$assignmentId','$courseId','$title','$dueDate','$assignedDate','$timeLimit',$numberOfAttemptsAllowed,'$attemptAggregation',$totalPointsOrPercent,'$gradeCategory',$individualize,$multipleAttempts,$showSolution,$showFeedback,$showHints,$showCorrectness,$proctorMakesAvailable)
";

  $result = $conn->query($sql); 
echo $sql;
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
