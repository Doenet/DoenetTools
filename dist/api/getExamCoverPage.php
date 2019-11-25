<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');



include "db_connection.php";
$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$assignmentId =  mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);
include "exam_security.php";




$response_arr = array( 
  "examHTML" => "<p>No Access</p>",
  "legitAccessKey" => $legitAccessKey,
);

if ($legitAccessKey == 1){
  //Have access

  $sql = "
  SELECT examCoverHTML,
  Minute(timeLimit) AS minuteLimit,
  Hour(timeLimit) AS hourLimit
  FROM assignment 
  WHERE assignmentId = '$assignmentId'
  ";
  $result = $conn->query($sql);

  $row = $result->fetch_assoc();
  $examHTML = $row["examCoverHTML"];
  $minuteLimit = $row["minuteLimit"];
  $hourLimit = $row["hourLimit"];
  $totalMinutesLimit = $hourLimit * 60 + $minuteLimit;

  $sql = "
  SELECT longName
  FROM course
  WHERE courseId = '$courseId'
  ";
  $result = $conn->query($sql);

  $row = $result->fetch_assoc();
  $courseTitle = $row["longName"];

  $response_arr = array( 
    "examHTML" => $examHTML,
    "timeLimit" => $totalMinutesLimit,
    "courseTitle" => $courseTitle,
    "legitAccessKey" => $legitAccessKey,

  );
}




 // set response code - 200 OK
 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);


$conn->close();
?>