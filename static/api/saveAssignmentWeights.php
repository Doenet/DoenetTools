<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');
include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$response_arr = array(
    "access"=> TRUE
);


$_POST = json_decode(file_get_contents("php://input"),true);
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]);
$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$weights = array_map(function($item) use($conn) {
    return mysqli_real_escape_string($conn, $item);
  }, $_POST['weights']);


  //TODO: test if weights already are stored (YES)


  $sql = "INSERT INTO user_assignment_attempt 
      (userId,assignmentId,attemptNumber,contentId)
      values
      ('$userId','$assignmentId','$attemptNumber','$contentId')
      ";
$result = $conn->query($sql);

  for ($itemNumber = 1; $itemNumber < count($weights) + 1; $itemNumber++){
      //Store Item  weights
      $weight = $weights[($itemNumber -1)];
      $sql = "INSERT INTO user_assignment_attempt_item 
      (userId,assignmentId,attemptNumber,itemNumber,weight)
      values
      ('$userId','$assignmentId','$attemptNumber','$itemNumber','$weight')
      ";
    $result = $conn->query($sql);

  }



    // set response code - 200 OK
    http_response_code(200);

//  echo json_encode($response_arr);

$conn->close();
?>