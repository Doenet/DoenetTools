<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];


$_POST = json_decode(file_get_contents("php://input"),true);
$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]);

$success = TRUE;
$message = "";

if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}elseif ($contentId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing contentId';
}

if ($success){

  // find latest attempts of doenetId
  // and mark user_assigment as stale 
  // if the latest attempt is not contentId
  $sql = "UPDATE user_assignment a
  INNER JOIN (
    SELECT doenetId, contentId, userId, attemptNumber
    FROM user_assignment_attempt
  ) b ON a.doenetId=b.doenetId and a.userId=b.userId
  INNER JOIN (
    SELECT doenetId, userId, MAX(attemptNumber) as maxAttempt
    FROM user_assignment_attempt
    GROUP BY doenetId, userId
  ) c ON b.doenetId=c.doenetId and b.userId=c.userId and b.attemptNumber = c.maxAttempt
  SET a.stale = 1
  WHERE b.doenetId='$doenetId' and b.contentId != '$contentId'
  ";

  $result = $conn->query($sql);

}

$response_arr = array(
  "access"=> TRUE,
  "success"=>$success,
  "message"=>$message,
);

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>