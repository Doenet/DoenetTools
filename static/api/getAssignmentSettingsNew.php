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
$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);

$success = TRUE;
$results_arr = array();

$sql="SELECT * FROM assignment WHERE assignmentId='$assignmentId';";
$result = $conn->query($sql); 

    
  if ($result === TRUE) {
      // set response code - 200 OK
      http_response_code(200);
  }else {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
  $conn->close();




?>