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

$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);

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
dc.isAssignment As isAssignment,
dc.itemId AS itemId,
dc.contentId AS contentId,
FROM assignment_draft AS a
JOIN drive_content AS dc
ON a.assignmentId = dc.assignmentId
WHERE a.courseId ='$courseId'
";

// echo $sql;
$result = $conn->query($sql);
$assignment_arr = array();

if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){
    $assignment = array(
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
        "assignmentId" => $row['assignmentId'],
        "itemId" => $row['itemId'],
        "contentId" => $row['contentId'],

);
    array_push($assignment_arr,$assignment);
  } 
  $response_arr = array(
      "assignments" => $assignment_arr
  );  
}
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

// WHERE a.assignmentId = '$assignmentId'
