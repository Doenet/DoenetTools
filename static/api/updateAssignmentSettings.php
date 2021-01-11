<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];
$_POST = json_decode(file_get_contents("php://input"),true);
$title = mysqli_real_escape_string($conn,$_POST["title"]);
$assignedDate = mysqli_real_escape_string($conn,$_POST["assignedDate"]);
$dueDate = mysqli_real_escape_string($conn,$_POST["dueDate"]);
$itemId = mysqli_real_escape_string($conn,$_POST["itemId"]);
$attempsAllowed = mysqli_real_escape_string($conn,$_POST["attempsAllowed"]);
$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);

$success = TRUE;
$results_arr = array();

$sql="UPDATE assignment SET title='$title',assignedDate='$assignedDate',dueDate='$dueDate',numberOfAttemptsAllowed='$attempsAllowed' WHERE assignmentId='$assignmentId';";
$result = $conn->query($sql); 

  $sqlnew="UPDATE drive_content SET assignmentId='$assignmentId' WHERE itemId='$itemId';";
  $result = $conn->query($sqlnew); 
    
  if ($result === TRUE) {
      // set response code - 200 OK
      http_response_code(200);
      //echo $sql;
  }else {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
  $conn->close();




?>