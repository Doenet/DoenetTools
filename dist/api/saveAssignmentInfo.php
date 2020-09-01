<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
$_POST = json_decode(file_get_contents("php://input"),true);

$assignmentId =  mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$assignmentName =  mysqli_real_escape_string($conn,$_POST["assignmentName"]);
$dueDate =  mysqli_real_escape_string($conn,$_POST["dueDate"]);
$assignedDate =  mysqli_real_escape_string($conn,$_POST["assignedDate"]);
$gradeCategory =  mysqli_real_escape_string($conn,$_POST["gradeCategory"]);
$totalPointsOrPercent =  mysqli_real_escape_string($conn,$_POST["totalPointsOrPercent"]);
$numberOfAttemptsAllowed =  mysqli_real_escape_string($conn,$_POST["numberOfAttemptsAllowed"]);

$individualize =  mysqli_real_escape_string($conn,$_POST["individualize"]);
$timeLimit = mysqli_real_escape_string($conn,$_POST["timeLimit"]);
$multipleAttempts =  mysqli_real_escape_string($conn,$_POST["multipleAttempts"]);
$showSolution =  mysqli_real_escape_string($conn,$_POST["showSolution"]);
$showFeedback =  mysqli_real_escape_string($conn,$_POST["showFeedback"]);
$showHints =  mysqli_real_escape_string($conn,$_POST["showHints"]);
$showCorrectness =  mysqli_real_escape_string($conn,$_POST["showCorrectness"]);
$proctorMakesAvailable =  mysqli_real_escape_string($conn,$_POST["proctorMakesAvailable"]);

echo "PHP @!!!!!!\n";


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
timeLimit='$timeLimit',
totalPointsOrPercent = '$totalPointsOrPercent',
numberOfAttemptsAllowed = '$numberOfAttemptsAllowed',

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

