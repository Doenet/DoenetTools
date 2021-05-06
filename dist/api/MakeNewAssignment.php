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
$courseId = mysqli_real_escape_string($conn,$_POST["courseId"]);
$branchId = mysqli_real_escape_string($conn,$_POST["branchId"]);
$itemId = mysqli_real_escape_string($conn,$_POST["itemId"]);


$success = TRUE;
$message = "";


if ($courseId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing courseId';
}elseif ($assignmentId == ""){
  $success = FALSE;
  $message = "Internal Error: missing assignmentId";
}elseif ($branchId == ""){
  $success = FALSE;
  $message = "Internal Error: missing branchId";
}elseif ($contentId == ""){
  $success = FALSE;
  $message = "Internal Error: missing contentId";
}
if ($success){

$sql="
INSERT INTO assignment_draft
(assignmentId,courseId,creationDate,sourceBranchId,contentId,individualize,multipleAttempts,showSolution,showFeedback,showHints,showCorrectness,proctorMakesAvailable)
VALUES
('$assignmentId','$courseId',NOW(),'$branchId','$contentId',0,0,1,1,1,1,0)
";

$result = $conn->query($sql); 
}
  // echo $sql;
$sqlnew="UPDATE drive_content SET assignmentId='$assignmentId',isAssignment=1 WHERE branchId='$branchId';";
//  echo $sqlnew;
$result = $conn->query($sqlnew); 
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode(200);

  
  $conn->close();




?>