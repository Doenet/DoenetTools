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


$sql="
INSERT INTO assignment_draft
(assignmentId,courseId,individualize,multipleAttempts,showSolution,showFeedback,showHints,showCorrectness,proctorMakesAvailable)
VALUES
('$assignmentId','$courseId',0,0,1,1,1,1,0)
";

$result = $conn->query($sql); 
  // echo $sql;
$sqlnew="UPDATE drive_content SET assignmentId='$assignmentId',isAssignment=1 WHERE itemId='$itemId';";
//  echo $sqlnew;
$result = $conn->query($sqlnew); 
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode(200);

  
  $conn->close();




?>