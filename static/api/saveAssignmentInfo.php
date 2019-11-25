<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$assignmentId =  mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);
$assignmentName =  mysqli_real_escape_string($conn,$_REQUEST["assignmentName"]);
$dueDate =  mysqli_real_escape_string($conn,$_REQUEST["dueDate"]);
$assignedDate =  mysqli_real_escape_string($conn,$_REQUEST["assignedDate"]);
$gradeCategory =  mysqli_real_escape_string($conn,$_REQUEST["gradeCategory"]);
$totalPointsOrPercent =  mysqli_real_escape_string($conn,$_REQUEST["totalPointsOrPercent"]);
$individualize =  mysqli_real_escape_string($conn,$_REQUEST["individualize"]);
$multipleAttempts =  mysqli_real_escape_string($conn,$_REQUEST["multipleAttempts"]);
$showSolution =  mysqli_real_escape_string($conn,$_REQUEST["showSolution"]);
$showFeedback =  mysqli_real_escape_string($conn,$_REQUEST["showFeedback"]);
$showHints =  mysqli_real_escape_string($conn,$_REQUEST["showHints"]);
$showCorrectness =  mysqli_real_escape_string($conn,$_REQUEST["showCorrectness"]);
$proctorMakesAvailable =  mysqli_real_escape_string($conn,$_REQUEST["proctorMakesAvailable"]);


$dbIndividualize = 0;
if ($individualize){
  $dbIndividualize = 1;
}

if (strcmp($dueDate,'null') != 0){
$dueDate = "'".$dueDate."'";
}
if (strcmp($assignedDate,'null') != 0){
$assignedDate = "'".$assignedDate."'";
}

$sql = "UPDATE assignment 
SET assignmentName = '$assignmentName',
dueDate = $dueDate,
assignedDate = $assignedDate,
gradeCategory = '$gradeCategory',
totalPointsOrPercent = '$totalPointsOrPercent',
individualize = '$dbIndividualize',
multipleAttempts = '$multipleAttempts',
showSolution = '$showSolution',
showFeedback = '$showFeedback',
showHints = '$showHints',
showCorrectness = '$showCorrectness',
proctorMakesAvailable = '$proctorMakesAvailable'

WHERE assignmentId = '$assignmentId'";


$result = $conn->query($sql);

if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
}else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>

