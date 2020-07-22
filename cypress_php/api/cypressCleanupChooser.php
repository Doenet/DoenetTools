<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$_POST = json_decode(file_get_contents("php://input"),true);
$number_content = count($_POST["contentSeeds"]["branchId"]);

for ($i = 0; $i < $number_content; $i++){
  $branchId = mysqli_real_escape_string($conn,$_POST["contentSeeds"]["branchId"][$i]);
  $sql = "
  DELETE FROM content_branch
  WHERE branchId = '$branchId'
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
  DELETE FROM content
  WHERE branchId = '$branchId'
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
  DELETE FROM user_content
  WHERE branchId = '$branchId'
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
  DELETE FROM folder_content
  WHERE childId = '$branchId'
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

$number_folders = count($_POST["folderSeeds"]["folderId"]);

for ($i = 0; $i < $number_folders; $i++){
  $folderId = mysqli_real_escape_string($conn,$_POST["folderSeeds"]["folderId"][$i]);
  $sql = "
  DELETE FROM folder
  WHERE folderId = '$folderId'
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
  DELETE FROM folder_content
  WHERE folderId='$folderId' OR childId='$folderId'
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
  DELETE FROM user_folders
  WHERE folderId = '$folderId'
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

$number_urls = count($_POST["urlSeeds"]["urlId"]);

for ($i = 0; $i < $number_urls; $i++){
  $urlId = mysqli_real_escape_string($conn,$_POST["urlSeeds"]["urlId"][$i]);
  $sql = "
  DELETE FROM url
  WHERE urlId = '$urlId'
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
  DELETE FROM folder_content
  WHERE childId = '$urlId'
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
  DELETE FROM user_urls
  WHERE urlId = '$urlId'
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

$conn->close();

?>

