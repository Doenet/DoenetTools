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

$sqlA = "SELECT
ad.assignmentId AS assignmentId,
ad.title AS title,
ad.assignedDate AS assignedDate,
ad.dueDate AS dueDate,
ad.timeLimit AS timeLimit,
ad.numberOfAttemptsAllowed AS numberOfAttemptsAllowed,
ad.attemptAggregation AS attemptAggregation,
ad.totalPointsOrPercent AS totalPointsOrPercent,
ad.gradeCategory AS gradeCategory,
ad.individualize AS individualize,
ad.multipleAttempts AS multipleAttempts,
ad.showSolution AS showSolution,
ad.showFeedback AS showFeedback,
ad.showHints AS showHints,
ad.showCorrectness AS showCorrectness,
ad.proctorMakesAvailable AS proctorMakesAvailable,
a.isPublished As isPublishedAssignment
FROM assignment_draft AS ad
JOIN assignment As a
ON a.assignmentId = ad.assignmentId
WHERE a.assignmentId ='$assignmentId'
";
$result = $conn->query($sqlA);
$assignment_arr = array();

if ($result->num_rows > 0){

  $sql = "SELECT
  ad.assignmentId AS assignmentId,
  ad.title AS title,
  ad.assignedDate AS assignedDate,
  ad.dueDate AS dueDate,
  ad.timeLimit AS timeLimit,
  ad.numberOfAttemptsAllowed AS numberOfAttemptsAllowed,
  ad.attemptAggregation AS attemptAggregation,
  ad.totalPointsOrPercent AS totalPointsOrPercent,
  ad.gradeCategory AS gradeCategory,
  ad.individualize AS individualize,
  ad.multipleAttempts AS multipleAttempts,
  ad.showSolution AS showSolution,
  ad.showFeedback AS showFeedback,
  ad.showHints AS showHints,
  ad.showCorrectness AS showCorrectness,
  ad.proctorMakesAvailable AS proctorMakesAvailable,
  a.isPublished As isPublishedAssignment,
  dc.isPublished AS isPublished,
  dc.isAssignment As isAssignment,
  dc.itemId AS itemId,
  dc.contentId AS contentId
  FROM assignment_draft AS ad
  JOIN drive_content AS dc
  ON ad.assignmentId = dc.assignmentId 
  JOIN assignment As a
  ON a.assignmentId = dc.assignmentId
  WHERE a.assignmentId ='$assignmentId'
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
          "assignment_isPublished" => $row['isPublishedAssignment']
  
  );
      array_push($assignment_arr,$assignment);
    } 
    $response_arr = array(
        "assignments" => $assignment_arr
    );  
  }
  
}
else{
  $sql = "SELECT
  ad.assignmentId AS assignmentId,
  ad.title AS title,
  ad.assignedDate AS assignedDate,
  ad.dueDate AS dueDate,
  ad.timeLimit AS timeLimit,
  ad.numberOfAttemptsAllowed AS numberOfAttemptsAllowed,
  ad.attemptAggregation AS attemptAggregation,
  ad.totalPointsOrPercent AS totalPointsOrPercent,
  ad.gradeCategory AS gradeCategory,
  ad.individualize AS individualize,
  ad.multipleAttempts AS multipleAttempts,
  ad.showSolution AS showSolution,
  ad.showFeedback AS showFeedback,
  ad.showHints AS showHints,
  ad.showCorrectness AS showCorrectness,
  ad.proctorMakesAvailable AS proctorMakesAvailable,
  dc.isPublished AS isPublished,
  dc.isAssignment As isAssignment,
  dc.itemId AS itemId,
  dc.contentId AS contentId
  FROM assignment_draft AS ad
  JOIN drive_content AS dc
  ON ad.assignmentId = dc.assignmentId
  WHERE ad.assignmentId ='$assignmentId'
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
          "assignment_isPublished" => "0"
  
  );
      array_push($assignment_arr,$assignment);
    } 
    $response_arr = array(
        "assignments" => $assignment_arr
    );  
  }
  

}


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();