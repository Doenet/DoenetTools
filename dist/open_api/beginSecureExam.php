<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');


include "db_connection.php";
$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$assignmentId =  mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);
$conditionalUser =  mysqli_real_escape_string($conn,$_REQUEST["learnerUsername"]);
if ($conditionalUser != "") {
  $remoteuser = $conditionalUser;
}
include "exam_security.php";

$response_arr = array( 
  "legitAccessKey" => 0,
);

if ($legitAccessKey == 1){
  //Have access
  $exams_arr = array();

  $sql = "
  SELECT c.doenetML AS doenetML,
  a.individualize AS individualize,
  a.contentId AS contentId
  FROM assignment AS a
  LEFT JOIN content AS c
  ON a.contentId = c.contentId
  WHERE assignmentId = '$assignmentId'
  LIMIT 1
  ";
  $result = $conn->query($sql);

  if ($result->num_rows > 0){
    $row = $result->fetch_assoc();
    $doenetML = $row["doenetML"];
    $individualize = $row["individualize"];
    $contentId = $row["contentId"];
  }
  $sql = "
  SELECT MAX(attemptNumber) as attemptNumber 
  FROM user_assignment_attempt 
  WHERE assignmentId='$assignmentId' and username='$remoteuser'
  ";
  $result = $conn->query($sql);

  if ($result->num_rows > 0){
    $row = $result->fetch_assoc();
    $attemptNumber = $row["attemptNumber"] + 1;
  }else{
    $attemptNumber = 1;
  }

  $response_arr = array( 
    "legitAccessKey" => 1,
    "doenetML" => $doenetML,
    "attemptNumber" => $attemptNumber,
    "individualize" => $individualize,
    "contentId" => $contentId,
  );
}
   
 // set response code - 200 OK
 http_response_code(200);
     
 // make it json format
 echo json_encode($response_arr);



$conn->close();
?>