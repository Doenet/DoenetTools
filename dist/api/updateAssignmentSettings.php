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
if ($permissions["canModifyActivitySettings"] != '1'){
  $success = FALSE;
  $message = "You need permission to edit content.";
  http_response_code(403);
}

$settingKeys = array(
  "makeContnet", "isSubmitted", "role", "dueDate", "assignedDate", 
  "timeLimit", "numberOfAttemptsAllowed", "attemptAggregation", "totalPointsOrPercent",
  "gradeCategory", "individualize", "showSolution", "showSolutionInGradebook", 
  "showFeedback", "showHints", "showCorrectness", "showCreditAchievedMenu", 
  "proctorMakesAvailable", "pinnedUntilDate", "pinnedAfterDate"
);

$proviedValues = [];

foreach ($settingKeys as $key) {
  if(array_key_exists($key, $_POST)) {
    $proviedValues[$key] = mysqli_real_escape_string($conn,$_POST[$key]);
  }
}
unset($key, $value);

//protect against invalid empty string values
if (array_key_exists("pinnedUntilDate", $proviedValues) && $proviedValues["pinnedUntilDate"] == ''){$proviedValues["pinnedUntilDate"] = 'NULL';}
if (array_key_exists("pinnedAfterDate", $proviedValues) && $proviedValues["pinnedAfterDate"] == ''){$proviedValues["pinnedAfterDate"] = 'NULL';}
if (array_key_exists("timeLimit", $proviedValues) && $proviedValues["timeLimit"] == ''){$proviedValues["timeLimit"] = 'NULL';}
if (array_key_exists("dueDate", $proviedValues) && $proviedValues["dueDate"] == ''){$proviedValues["dueDate"] = 'NULL';}
if (array_key_exists("assignedDate", $proviedValues) && $proviedValues["assignedDate"] == ''){$proviedValues["assignedDate"] = 'NULL';}
if (array_key_exists("numberOfAttemptsAllowed", $proviedValues) && $proviedValues["numberOfAttemptsAllowed"] == ''){$proviedValues["numberOfAttemptsAllowed"] = 'NULL';}
if (array_key_exists("totalPointsOrPercent", $proviedValues) && $proviedValues["totalPointsOrPercent"] == '') { $proviedValues["totalPointsOrPercent"] = 'NULL';}

//protect against invalid boolean values
$boolKeys = array(
  "individualize", "showSolution", "showSolutionInGradebook", "showFeedback",
  "showHints","showCorrectness","showCreditAchievedMenu","proctorMakesAvailable"
);

foreach ($boolKeys as $key) {
  if (array_key_exists($key, $proviedValues)) {
    if ($proviedValues[$key]) {$proviedValues[$key] = '1';} else {$proviedValues[$key] = '0';}
  }
}

function array_map_assoc( $callback , $array ){
  $r = array();
  foreach ($array as $key=>$value)
    $r[$key] = $callback($key,$value);
  return $r;
}
;

$updates = implode(
  ",", 
  array_map_assoc(
    function($key, $value) {
      if ($value == 'NULL') {
        return "$key = $value";}
      else {
        return "$key = '$value'";
      }
    },
    $proviedValues
  )
);

if ($success){
$sql = "INSERT INTO `assignment` SET
    doenetId='$doenetId',
    courseId = '$courseId',
    $updates
  ON DUPLICATE KEY UPDATE
    $updates
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