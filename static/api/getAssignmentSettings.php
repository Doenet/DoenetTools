<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

//TODO: Make sure of instructor or user

$assignmentId =  mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);

$sql = "SELECT
title,
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
proctorMakesAvailable
FROM assignment
WHERE assignmentId = '$assignmentId'
";

$result = $conn->query($sql);

$response_arr = array();

if ($result->num_rows > 0){

    $row = $result->fetch_assoc();
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
        "proctorMakesAvailable" => $row['proctorMakesAvailable']
);
    
}
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
