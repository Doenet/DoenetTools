<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];
$examUserId = $jwtArray['examineeUserId'];
$examDoenetId = $jwtArray['doenetId'];

$device = $jwtArray['deviceName'];

$contentId = mysqli_real_escape_string($conn,$_REQUEST["contentId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_REQUEST["attemptNumber"]);
$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$paramUserId = mysqli_real_escape_string($conn,$_REQUEST["userId"]);
$pageStateSource = mysqli_real_escape_string($conn,$_REQUEST["pageStateSource"]);

$success = TRUE;
$message = "";
if ($contentId == ""){
$success = FALSE;
$message = 'Internal Error: missing contentId';
}elseif ($attemptNumber == ""){
$success = FALSE;
$message = 'Internal Error: missing attemptNumber';
}elseif ($doenetId == ""){
$success = FALSE;
$message = 'Internal Error: missing doenetId';
}elseif ($pageStateSource == ""){
$success = FALSE;
$message = 'Internal Error: missing pageStateSource';
}elseif ($userId == ""){
  if ($examUserId == ""){
    $success = FALSE;
    $message = "No access - Need to sign in";
  }else if ($examDoenetId != $doenetId){
      $success = FALSE;
      $message = "No access for doenetId: $doenetId";
  }else{
      $userId = $examUserId;
  }
}



if ($success){

$effectiveUserId = $userId;
if ($paramUserId !== ''){
  //TODO: Need a permission related to see grades (not du.canEditContent)
  $sql = "
  SELECT du.canEditContent 
  FROM drive_user AS du
  LEFT JOIN drive_content AS dc
  ON dc.driveId = du.driveId
  WHERE du.userId = '$userId'
  AND dc.doenetId = '$doenetId'
  AND du.canEditContent = '1'
  ";

  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    $effectiveUserId = $paramUserId;
  }
}

if ($pageStateSource == "submissions"){
  $sql = "SELECT s.stateVariables AS stateVariables, 
  a.generatedVariant AS variant
  FROM user_assignment_attempt_item_submission AS s
  LEFT JOIN user_assignment_attempt AS a
  ON a.userId = s.userId AND a.doenetId = s.doenetId AND a.attemptNumber = s.attemptNumber
  WHERE s.userId='$effectiveUserId'
  AND s.contentId='$contentId'
  AND s.attemptNumber='$attemptNumber'
  AND s.doenetId='$doenetId'
  ORDER BY s.submittedDate DESC, s.id DESC
  LIMIT 1
  ";
}else{
  $sql = "SELECT stateVariables, variant
  FROM content_interactions
  WHERE userId='$effectiveUserId'
  AND contentId='$contentId'
  AND attemptNumber='$attemptNumber'
  AND doenetId='$doenetId'
  ORDER BY timestamp DESC, id DESC
  LIMIT 1
  ";
}

  $result = $conn->query($sql);
  
  // $stateVariables = array();
  // while ($row = $result->fetch_assoc()){
  //         array_push($stateVariables,$row["stateVariables"]);
  // }
  $row = $result->fetch_assoc();
  $stateVariables = $row["stateVariables"];
  $variant = $row["variant"];
}

$response_arr = array(
        "success"=>$success,
        "stateVariables" => $stateVariables,
        "variant" => $variant,
        "message"=>$message
);

http_response_code(200);

echo json_encode($response_arr);

$conn->close();

?>

