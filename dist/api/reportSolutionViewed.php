<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];
$examUserId = array_key_exists("examineeUserId",$jwtArray) ? $jwtArray['examineeUserId'] : "";
$examDoenetId = array_key_exists("doenetId",$jwtArray) ? $jwtArray['doenetId'] : "";

$_POST = json_decode(file_get_contents("php://input"),true);
$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$itemNumber = mysqli_real_escape_string($conn,$_POST["itemNumber"]);

$success = TRUE;
$message = "";

if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}elseif ($attemptNumber == ""){
    $success = FALSE;
    $message = 'Internal Error: missing attemptNumber';
}elseif ($itemNumber == ""){
    $success = FALSE;
    $message = 'Internal Error: missing itemNumber';
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

$sql = "SELECT doenetId
    FROM user_assignment_attempt_item
    WHERE doenetId = '$doenetId'
    AND attemptNumber = '$attemptNumber'
    AND itemNumber = '$itemNumber'
    AND userId = '$userId'
    AND viewedSolution = '1'
    ";
$result = $conn->query($sql);

  if ($result->num_rows < 1){
    $sql = "UPDATE user_assignment_attempt_item
        SET viewedSolution = '1', viewedSolutionDate = NOW()
        WHERE doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        AND itemNumber = '$itemNumber'
        AND userId = '$userId'
        ";
    $result = $conn->query($sql);
  }

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