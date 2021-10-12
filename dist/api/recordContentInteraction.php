<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$device = $jwtArray['deviceName'];

$_POST = json_decode(file_get_contents("php://input"),true);
$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);
$contentId =  mysqli_real_escape_string($conn,$_POST["contentId"]);
$stateVariables =  mysqli_real_escape_string($conn,$_POST["stateVariables"]);
$variant =  mysqli_real_escape_string($conn,$_POST["variant"]);
$attemptNumber =  mysqli_real_escape_string($conn,$_POST["attemptNumber"]);

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

http_response_code(200);

$conn->close();

?>