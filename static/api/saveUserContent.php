<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);
$number_children = count($_POST["childIds"]);
$operationType =  mysqli_real_escape_string($conn,$_POST["operationType"]);

for ($i = 0; $i < $number_children; $i++) {
  $childId =  mysqli_real_escape_string($conn,$_POST["childIds"][$i]);
  $childType =  mysqli_real_escape_string($conn,$_POST["childType"][$i]);
  if ($childType == "content") {
    if ($operationType == "insert") {
      $sql = "
      INSERT INTO user_content
      (userId, branchId)
      VALUES
      ('$userId','$childId')
      ";
      echo $sql;
      $result = $conn->query($sql);   
    } else if($operationType == "remove") {
      //TEST if branch exists
      $sql = "
      SELECT id
      FROM content_branch
      WHERE branchId='$childId'
      ";
      $result = $conn->query($sql); 
      if ($result->num_rows > 0){
        $sql = "
        DELETE FROM user_content
        WHERE userId='$userId' 
        AND branchId='$childId'
        ";
        echo $sql;
        $result = $conn->query($sql);      
      }
    }
  } else if ($childType == "folder") {
    if ($operationType == "insert") {
      $sql = "
      INSERT INTO user_folders
      (userId, folderId)
      VALUES
      ('$userId','$childId')
      ";
      echo $sql;
      $result = $conn->query($sql);   
    } else if($operationType == "remove") {
      //TEST if folder exists
      $sql = "
      SELECT id
      FROM folder
      WHERE folderId='$childId'
      ";
      $result = $conn->query($sql); 
      if ($result->num_rows > 0){
        $sql = "
        DELETE FROM user_folders
        WHERE userId='$userId' 
        AND folderId='$childId'
        ";
        echo $sql;
        $result = $conn->query($sql);     
      }
    }
  } else if ($childType == "url") {
    if ($operationType == "insert") {
      $sql = "
      INSERT INTO user_urls
      (userId, urlId)
      VALUES
      ('$userId','$childId')
      ";
      echo $sql;
      $result = $conn->query($sql);   
    } else if($operationType == "remove") {
      //TEST if url exists
      $sql = "
      SELECT id
      FROM url
      WHERE urlId='$childId'
      ";
      $result = $conn->query($sql); 
      if ($result->num_rows > 0){
        $sql = "
        DELETE FROM user_urls
        WHERE userId='$userId' 
        AND urlId='$childId'
        ";
        echo $sql;
        $result = $conn->query($sql);     
      }
    }
  } 
}

if ($result === TRUE) {
  // set response code - 200 OK
    http_response_code(200);
}else {
  echo "Error: " . $sql . "\n" . $conn->error;
}
$conn->close();

?>