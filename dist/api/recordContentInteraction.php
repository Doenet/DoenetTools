<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');


include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];
$examUserId = $jwtArray['examineeUserId'];
$examDoenetId = $jwtArray['doenetId'];

$device = $jwtArray['deviceName'];

$_POST = json_decode(file_get_contents("php://input"),true);
$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);
$contentId =  mysqli_real_escape_string($conn,$_POST["contentId"]);
$stateVariables =  mysqli_real_escape_string($conn,$_POST["stateVariables"]);
$variant =  mysqli_real_escape_string($conn,$_POST["variant"]);
$attemptNumber =  mysqli_real_escape_string($conn,$_POST["attemptNumber"]);

$success = TRUE;
$message = "";

if ($doenetId == ""){
$success = FALSE;
$message = 'Internal Error: missing doenetId';
}elseif ($contentId == ""){
$success = FALSE;
$message = 'Internal Error: missing contentId';
}elseif ($stateVariables == ""){
$success = FALSE;
$message = 'Internal Error: missing stateVariables';
}elseif ($variant == ""){
$success = FALSE;
$message = 'Internal Error: missing variant';
}elseif ($attemptNumber == ""){
  $success = FALSE;
  $message = 'Internal Error: missing attemptNumber';
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

//Only store the latest attempt and overwrite the earlier info on that attempt
$sql = "
SELECT userId
FROM content_interactions
WHERE userId = '$userId'
AND doenetId = '$doenetId'
AND attemptNumber = '$attemptNumber'
";
$result = $conn->query($sql);

if ($result->num_rows > 0) {

  $sql = "
  UPDATE content_interactions
  SET deviceName = '$device', 
  contentId = '$contentId', 
  stateVariables = '$stateVariables',
  variant = '$variant',
  timestamp = CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
  WHERE userId = '$userId'
  AND doenetId = '$doenetId'
  AND attemptNumber = '$attemptNumber'
  ";

}else{

  $sql = "INSERT INTO content_interactions (userId,deviceName,doenetId,contentId,stateVariables,variant,attemptNumber,timestamp)
  VALUES ('$userId','$device','$doenetId','$contentId','$stateVariables','$variant','$attemptNumber',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))";

}
$result = $conn->query($sql);

}
$response_arr = array(
  "success"=>$success,
  "message"=>$message
);

http_response_code(200);

echo json_encode($response_arr);

$conn->close();

?>