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
$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$itemId = mysqli_real_escape_string($conn,$_POST["itemId"]);
$courseId = mysqli_real_escape_string($conn,$_POST["courseId"]);



$success = TRUE;
$results_arr = array();

$sql="
INSERT INTO assignment 
(assignmentId,courseId,individualize,multipleAttempts,showSolution,showFeedback,showHints,showCorrectness,proctorMakesAvailable)
VALUES
('$assignmentId','$courseId',0,0,1,1,1,1,0)
";

  $result = $conn->query($sql); 
  $sqlnew="UPDATE drive_content SET assignmentId='$assignmentId',isAssignment=1 WHERE itemId='$itemId';";
  // echo $sqlnew;
  $result = $conn->query($sqlnew); 


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
FROM assignment AS a
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




?>