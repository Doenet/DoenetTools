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


$sql = "UPDATE assignment SET
title = '$title',
assignedDate = '$assignedDate',
dueDate = '$dueDate',
timeLimit = '$timeLimit',
numberOfAttemptsAllowed = '$numberOfAttemptsAllowed',
attemptAggregation = '$attemptAggregation',
totalPointsOrPercent = '$totalPointsOrPercent',
gradeCategory = '$gradeCategory',
individualize = '$individualize',
multipleAttempts = '$multipleAttempts',
showSolution = '$showSolution',
showFeedback = '$showFeedback',
showHints = '$showHints',
showCorrectness = '$showCorrectness',
proctorMakesAvailable = '$proctorMakesAvailable'
WHERE assignmentId = '$assignmentId'
";

$result = $conn->query($sql);
$sqldc="UPDATE drive_content SET isPublished='$submitted',isAssignment=$makeContent,assignmentId='$assignmentId' WHERE itemId='$itemId';";

$result = $conn->query($sqldc); 


$sqlResult = "SELECT
a.assignmentId AS assignmentId,
a.title AS title,
a.assignedDate AS assignedDate,
a.dueDate AS dueDate,
a.timeLimit AS timeLimit,
a.numberOfAttemptsAllowed AS numberOfAttemptsAllowed,
a.attemptAggregation AS attemptAggregation,
a.totalPointsOrPercent AS totalPointsOrPercent,
a.gradeCategory AS gradeCategory,
a.individualize AS individualize,
a.multipleAttempts AS multipleAttempts,
a.showSolution AS showSolution,
a.showFeedback AS showFeedback,
a.showHints AS showHints,
a.showCorrectness AS showCorrectness,
a.proctorMakesAvailable AS proctorMakesAvailable,
dc.isPublished AS isPublished,
dc.isAssignment As isAssignment
FROM assignment AS a
JOIN drive_content AS dc
ON a.assignmentId = dc.assignmentId
WHERE a.assignmentId = '$assignmentId'
";
$resultData = $conn->query($sqlResult);

$response_arr = array();

if ($resultData->num_rows > 0){

    $row = $resultData->fetch_assoc();
    $response_arr = array(
        "title" => $row['title'],
        "assignedDate" => $row['assignedDate'],
        "dueDate" => $row['dueDate'],
        "timeLimit" => $row['timeLimit'],
        "numberOfAttemptsAllowed" => $row['numberOfAttemptsAllowed'],
        "attemptAggregation" => $row['attemptAggregation'],
        "totalPointsOrPercent" => $row['totalPointsOrPercent'],
        "gradeCategory" => $row['gradeCategory'],
        "individualize" => $row['individualize'],
        "multipleAttempts" => $row['multipleAttempts'],
        "showSolution" => $row['showSolution'],
        "showFeedback" => $row['showFeedback'],
        "showHints" => $row['showHints'],
        "showCorrectness" => $row['showCorrectness'],
        "proctorMakesAvailable" => $row['proctorMakesAvailable'],
        "isPublished" => $row['isPublished'],
        "isAssignment" => $row['isAssignment'],


);
    
}
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
