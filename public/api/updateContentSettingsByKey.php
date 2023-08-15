<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
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
$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);
if ($doenetId == ""){
  $success = FALSE;
  $message = "Internal Error: missing doenetId";
  http_response_code(400);
}

$courseId = $_POST['courseId'];
if ($courseId == ""  && $success){
  $sql = "
  SELECT courseId
  FROM course_content
  WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $courseId = $row['courseId'];
  }else{
    $success = FALSE;
    $message = "Internal Error: missing courseId";
    http_response_code(400);
  }
}


$permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
if ($permissions["canModifyActivitySettings"] != '1'){
  $success = FALSE;
  $message = "You need permission to edit content.";
  http_response_code(403);
}

$settingKeys = array(
  "userCanViewSource","makeContnet", "isSubmitted", "role", "dueDate", "assignedDate", 
  "timeLimit", "numberOfAttemptsAllowed", "attemptAggregation", "totalPointsOrPercent",
  "gradeCategory","individualize", "showSolution", "showSolutionInGradebook", 
  "showFeedback", "showHints", "showCorrectness", "showCreditAchievedMenu",
  "paginate", "showFinishButton",  
  "proctorMakesAvailable", "autoSubmit", "pinnedUntilDate", "pinnedAfterDate","canViewAfterCompleted"
);

$providedValues = [];

foreach ($settingKeys as $key) {
  if(array_key_exists($key, $_POST)) {
    $providedValues[$key] = mysqli_real_escape_string($conn,$_POST[$key]);
  }
}
unset($key, $value);

//protect against invalid empty string values
if (array_key_exists("pinnedUntilDate", $providedValues) && $providedValues["pinnedUntilDate"] == ''){$providedValues["pinnedUntilDate"] = 'NULL';}
if (array_key_exists("pinnedAfterDate", $providedValues) && $providedValues["pinnedAfterDate"] == ''){$providedValues["pinnedAfterDate"] = 'NULL';}
if (array_key_exists("timeLimit", $providedValues) && $providedValues["timeLimit"] == ''){$providedValues["timeLimit"] = 'NULL';}
if (array_key_exists("dueDate", $providedValues) && $providedValues["dueDate"] == ''){$providedValues["dueDate"] = 'NULL';}
if (array_key_exists("assignedDate", $providedValues) && $providedValues["assignedDate"] == ''){$providedValues["assignedDate"] = 'NULL';}
if (array_key_exists("numberOfAttemptsAllowed", $providedValues) && $providedValues["numberOfAttemptsAllowed"] == ''){$providedValues["numberOfAttemptsAllowed"] = 'NULL';}
if (array_key_exists("totalPointsOrPercent", $providedValues) && $providedValues["totalPointsOrPercent"] == '') { $providedValues["totalPointsOrPercent"] = 'NULL';}

//protect against invalid boolean values
$boolKeys = array(
  "userCanViewSource","individualize", "showSolution", "showSolutionInGradebook", "showFeedback",
  "showHints","showCorrectness","showCreditAchievedMenu",
  "paginate","showFinishButton","proctorMakesAvailable","autoSubmit","canViewAfterCompleted"
);

foreach ($boolKeys as $key) {
  if (array_key_exists($key, $providedValues)) {
    if ($providedValues[$key]) {$providedValues[$key] = '1';} else {$providedValues[$key] = '0';}
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
    $providedValues
  )
);


if ($success){
  http_response_code(200);

  if(count($providedValues) > 0) {


    $sql = "UPDATE course_content SET
        $updates
        WHERE doenetId='$doenetId'
        AND courseId='$courseId'
    ";
    $result = $conn->query($sql);


    if ($result == false) {
      $success = FALSE;
      $message = "Database error";
      http_response_code(500);
    }
  }
}

if($success) {


  if(array_key_exists("itemWeights", $_POST)) {

    $itemWeights = implode(",",$_POST['itemWeights']);

    $sql = "
    UPDATE course_content
    SET jsonDefinition=JSON_REPLACE(jsonDefinition,'$.itemWeights',JSON_ARRAY($itemWeights))
    WHERE doenetId='$doenetId'
    AND courseId='$courseId'
    ";
    $result = $conn->query($sql);
echo $sql;
    if ($result == false) {
      $success = FALSE;
      $message = "Database error";
      http_response_code(500);
    }

  }

}
// set response code - 200 OK

$response_arr = array(
  "success"=>$success,
  "message"=>$message
  );

// make it json format
echo json_encode($response_arr);

  
  $conn->close();
?>