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
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]);


$success = TRUE;
$results_arr = array();

$sql="
INSERT INTO assignment 
(assignmentId,individualize,multipleAttempts,showSolution,showFeedback,showHints,showCorrectness,proctorMakesAvailable)
VALUES
('$assignmentId',0,0,1,1,1,1,0)
";

  $result = $conn->query($sql); 
  $sqlnew="UPDATE drive_content SET assignmentId='$assignmentId' WHERE contentId='$contentId';";
  $result = $conn->query($sqlnew); 
    
  if ($result === TRUE) {
      // set response code - 200 OK
      http_response_code(200);
  }else {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
  $conn->close();




?>