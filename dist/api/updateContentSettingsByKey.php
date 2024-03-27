<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "baseModel.php";
include "permissionsAndSettingsForOneCourseFunction.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);

error_log("DEBUG updateContentSettingsByKey Request parameters: " . print_r($_POST, true));

$response_arr = ["success" => true];
try {
$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);
if ($doenetId == ""){
  throw new Exception("Internal Error: missing doenetId.");
}

$courseId = $_POST['courseId'];
if ($courseId == ""){
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
    throw new Exception("Internal Error: missing courseId.");

  }
}


$permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
if ($permissions["canModifyActivitySettings"] != '1'){
  throw new Exception("You need permission to edit content.");
}

$settingKeys = array(
  "userCanViewSource","isPublic"
);

$providedValues = [];

foreach ($settingKeys as $key) {
  if(array_key_exists($key, $_POST)) {
    $providedValues[$key] = mysqli_real_escape_string($conn,$_POST[$key]);
  }
}
unset($key, $value);

//protect against invalid empty string values
// if (array_key_exists("pinnedUntilDate", $providedValues) && $providedValues["pinnedUntilDate"] == ''){$providedValues["pinnedUntilDate"] = 'NULL';}
// if (array_key_exists("pinnedAfterDate", $providedValues) && $providedValues["pinnedAfterDate"] == ''){$providedValues["pinnedAfterDate"] = 'NULL';}
// if (array_key_exists("timeLimit", $providedValues) && $providedValues["timeLimit"] == ''){$providedValues["timeLimit"] = 'NULL';}
// if (array_key_exists("dueDate", $providedValues) && $providedValues["dueDate"] == ''){$providedValues["dueDate"] = 'NULL';}
// if (array_key_exists("assignedDate", $providedValues) && $providedValues["assignedDate"] == ''){$providedValues["assignedDate"] = 'NULL';}
// if (array_key_exists("numberOfAttemptsAllowed", $providedValues) && $providedValues["numberOfAttemptsAllowed"] == ''){$providedValues["numberOfAttemptsAllowed"] = 'NULL';}
// if (array_key_exists("totalPointsOrPercent", $providedValues) && $providedValues["totalPointsOrPercent"] == '') { $providedValues["totalPointsOrPercent"] = 'NULL';}

//protect against invalid boolean values
$boolKeys = array(
  "userCanViewSource","isPublic"
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

if(array_key_exists("learningOutcomes", $_POST)) {
 
  $learningOutcomes = array_map(function($item) use($conn) {
    return mysqli_real_escape_string($conn, $item);
  }, $_POST['learningOutcomes']);
  $textLearningOutcomes = "[" . implode(",", array_map(function($value) { return '"' . $value . '"'; }, $learningOutcomes)) . "]";
  $sql = "
  UPDATE course_content
  SET learningOutcomes=JSON_MERGE('[]','$textLearningOutcomes')
  WHERE doenetId = '$doenetId'
  ";

  Base_Model::runQuery($conn, $sql);

}else{

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
  
  
    if(count($providedValues) > 0) {
  
      $sql = "UPDATE course_content SET
          $updates
          WHERE doenetId='$doenetId'
          AND courseId='$courseId'
      ";

      Base_Model::runQuery($conn, $sql);
    }

}


    // set response code - 200 OK
    http_response_code(200);

} catch (Exception $e) {
    $response_arr = [
        'success' => false,
        'message' => $e->getMessage(),
    ];
    http_response_code(400);

} finally {
    // make it json format
    echo json_encode($response_arr);
    $conn->close();
}
?>