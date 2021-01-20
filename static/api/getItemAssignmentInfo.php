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

$itemId =  mysqli_real_escape_string($conn,$_REQUEST["itemId"]);
$role =  mysqli_real_escape_string($conn,$_REQUEST["role"]);

$type = $role == 'Instructor' ? 'assignment_draft' : 'assignment';


$sql = "SELECT
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
FROM $type AS a
JOIN drive_content AS dc
ON a.assignmentId = dc.assignmentId
JOIN drive_user as du
ON du.driveId = dc.driveId
WHERE dc.itemId = '$itemId' AND du.userId='$userId'
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
        "proctorMakesAvailable" => $row['proctorMakesAvailable'],
        "isPublished" => $row['isPublished'],
        "isAssignment" => $row['isAssignment'],
        "assignmentId" => $row['assignmentId']


);
    
}
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
