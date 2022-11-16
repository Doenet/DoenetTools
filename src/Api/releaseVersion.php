<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$versionId = mysqli_real_escape_string($conn,$_REQUEST["versionId"]);


$success = TRUE;
$message = "";

if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}elseif ($versionId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing versionId';
}


if ($success){

  $sql = "
  SELECT isReleased,
  title
  FROM content
  WHERE doenetId = '$doenetId'
  AND versionId = '$versionId'
  ";

  $result = $conn->query($sql); 
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $isReleased = $row['isReleased'];
    $title = $row['title'];
  }

  //Toggle is the reverse of $isReleased
  $toggle = '1';
  if ($isReleased == '1'){
    $toggle = '0';
  }

  $sql = "
  UPDATE drive_content
  SET isReleased = '$toggle'
  WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql); 

  //Retract All Versions
  $sql = "
  UPDATE content
  SET isReleased = '0'
  WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql);

  if ($isReleased == '0'){
    $sql = "
    UPDATE content
    SET isReleased = '1'
    WHERE doenetId = '$doenetId'
    AND versionId = '$versionId'
    ";
    $result = $conn->query($sql);
  }

}



$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "isReleased"=>$toggle,
  "title"=>$title
  );


// set response code - 200 OK
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>