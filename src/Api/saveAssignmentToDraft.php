<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";

$_POST = json_decode(file_get_contents("php://input"),true);

//TODO: is this the right permission?
$courseId = $_POST['courseId'];
$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);
if ($courseId == ""){
  $success = FALSE;
  $message = "Internal Error: missing courseId";
  http_response_code(400);
}
if ($doenetId == ""){
  $success = FALSE;
  $message = "Internal Error: missing doenetId";
  http_response_code(400);
}
$permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
if ($permissions["canEditContent"] != '1'){
  $success = FALSE;
  $message = "You need permission to edit content.";
  http_response_code(403);
}

$makeContent =  mysqli_real_escape_string($conn,$_POST["makeContent"]);
$submitted =  mysqli_real_escape_string($conn,$_POST["isSubmitted"]);
$role =  mysqli_real_escape_string($conn,$_POST["role"]);
$dueDate = mysqli_real_escape_string($conn,$_POST["dueDate"]);
$assignedDate = mysqli_real_escape_string($conn,$_POST["assignedDate"]);
$timeLimit = mysqli_real_escape_string($conn,$_POST["timeLimit"]);
$numberOfAttemptsAllowed = mysqli_real_escape_string($conn,$_POST["numberOfAttemptsAllowed"]);
$attemptAggregation = mysqli_real_escape_string($conn,$_POST["attemptAggregation"]);
$totalPointsOrPercent = mysqli_real_escape_string($conn,$_POST["totalPointsOrPercent"]);
$gradeCategory = mysqli_real_escape_string($conn,$_POST["gradeCategory"]);
$individualize = mysqli_real_escape_string($conn,$_POST["individualize"]);
$showSolution = mysqli_real_escape_string($conn,$_POST["showSolution"]);
$showSolutionInGradebook = mysqli_real_escape_string($conn,$_POST["showSolutionInGradebook"]);
$showFeedback = mysqli_real_escape_string($conn,$_POST["showFeedback"]);
$showHints = mysqli_real_escape_string($conn,$_POST["showHints"]);
$showCorrectness = mysqli_real_escape_string($conn,$_POST["showCorrectness"]);
$showCreditAchievedMenu = mysqli_real_escape_string($conn,$_POST["showCreditAchievedMenu"]);
$proctorMakesAvailable = mysqli_real_escape_string($conn,$_POST["proctorMakesAvailable"]);
$pinnedUntilDate = mysqli_real_escape_string($conn,$_POST["pinnedUntilDate"]);
$pinnedAfterDate = mysqli_real_escape_string($conn,$_POST["pinnedAfterDate"]);

if ($pinnedUntilDate == ''){$pinnedUntilDate = 'NULL';} else {$pinnedUntilDate = "'$pinnedUntilDate'"; }
if ($pinnedAfterDate == ''){$pinnedAfterDate = 'NULL';} else {$pinnedAfterDate = "'$pinnedAfterDate'"; }

if ($timeLimit == ''){$timeLimit = 'NULL';} else {$timeLimit = "'$timeLimit'"; }
if ($dueDate == ''){$dueDate = 'NULL';} else {$dueDate = "'$dueDate'"; }
if ($assignedDate == ''){$assignedDate = 'NULL';} else {$assignedDate = "'$assignedDate'"; }
if ($numberOfAttemptsAllowed == ''){$numberOfAttemptsAllowed = 'NULL';} else {$numberOfAttemptsAllowed = "'$numberOfAttemptsAllowed'"; }
if ($individualize){ $individualize = '1'; } else { $individualize = '0'; }
if ($showSolution){ $showSolution = '1'; } else { $showSolution = '0'; }
if ($showSolutionInGradebook){ $showSolutionInGradebook = '1'; } else { $showSolutionInGradebook = '0'; }
if ($showFeedback){ $showFeedback = '1'; } else { $showFeedback = '0'; }
if ($showHints){ $showHints = '1'; } else { $showHints = '0'; }
if ($showCorrectness){ $showCorrectness = '1'; } else { $showCorrectness = '0'; }
if ($showCreditAchievedMenu){ $showCreditAchievedMenu = '1'; } else { $showCreditAchievedMenu = '0'; }
if ($proctorMakesAvailable){ $proctorMakesAvailable = '1'; } else { $proctorMakesAvailable = '0'; }
if ($totalPointsOrPercent == '') { $totalPointsOrPercent = 'NULL';} else {$totalPointsOrPercent = "'$totalPointsOrPercent'";}

if ($success){
$sql = "INSERT INTO `assignment` SET
    doenetId='$doenetId',
    courseId = '$courseId',
    assignedDate = $assignedDate,
    dueDate = $dueDate,
    pinnedUntilDate = $pinnedUntilDate,
    pinnedAfterDate = $pinnedAfterDate,
    timeLimit = $timeLimit,
    numberOfAttemptsAllowed=$numberOfAttemptsAllowed,
    attemptAggregation = '$attemptAggregation',
    totalPointsOrPercent = $totalPointsOrPercent,
    gradeCategory = '$gradeCategory',
    individualize = '$individualize',
    showSolution = '$showSolution',
    showSolutionInGradebook = '$showSolutionInGradebook',
    showFeedback = '$showFeedback',
    showHints = '$showHints',
    showCorrectness = '$showCorrectness',
    showCreditAchievedMenu = '$showCreditAchievedMenu',
    proctorMakesAvailable = '$proctorMakesAvailable'
  ON DUPLICATE KEY UPDATE
    assignedDate = $assignedDate,
    dueDate = $dueDate,
    pinnedUntilDate = $pinnedUntilDate,
    pinnedAfterDate = $pinnedAfterDate,
    timeLimit = $timeLimit,
    numberOfAttemptsAllowed=$numberOfAttemptsAllowed,
    attemptAggregation = '$attemptAggregation',
    totalPointsOrPercent = '$totalPointsOrPercent',
    gradeCategory = '$gradeCategory',
    individualize = '$individualize',
    showSolution = '$showSolution',
    showSolutionInGradebook = '$showSolutionInGradebook',
    showFeedback = '$showFeedback',
    showHints = '$showHints',
    showCorrectness = '$showCorrectness',
    showCreditAchievedMenu = '$showCreditAchievedMenu',
    proctorMakesAvailable = '$proctorMakesAvailable'
";

$result = $conn->query($sql);


if ($result == false) {
  $success = FALSE;
  $message = "Database error";
  http_response_code(500);
} else {
  // set response code - 200 OK
  http_response_code(202);
}

}
// echo $sql;
// set response code - 200 OK

$response_arr = array(
  "success"=>$success,
  "message"=>$message
  );

// make it json format
echo json_encode($response_arr);

  
  $conn->close();
?>