<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');
include "db_connection.php";

$_POST = json_decode(file_get_contents("php://input"),true);
$number_children = count($_POST["childIds"]);
$operationType =  mysqli_real_escape_string($conn,$_POST["operationType"]);

for ($i = 0; $i < $number_children; $i++) {
  $childId =  mysqli_real_escape_string($conn,$_POST["childIds"][$i]);
  $childType =  mysqli_real_escape_string($conn,$_POST["childType"][$i]);
  if ($childType == "content") {
    //TEST if branch exists
    $sql = "
    SELECT id
    FROM content_branch
    WHERE branchId='$childId'
    ";
    $result = $conn->query($sql); 
    if ($result->num_rows > 0){
      if ($operationType == "insert") {
        $sql = "
        INSERT INTO user_content
        (username, branchId)
        VALUES
        ('$remoteuser','$childId')
        ";
        echo $sql;
        $result = $conn->query($sql);   
      } else if($operationType == "remove") {
        $sql = "
        DELETE FROM user_content
        WHERE username='$remoteuser' 
        AND branchId='$childId'
        ";
        echo $sql;
        $result = $conn->query($sql);   
      }
    }
  } else if ($childType == "folder") {
    //TEST if folder exists
    $sql = "
    SELECT id
    FROM folder
    WHERE folderId='$childId'
    ";
    $result = $conn->query($sql); 
    if ($result->num_rows > 0){
      if ($operationType == "insert") {
        $sql = "
        INSERT INTO user_folders
        (username, folderId)
        VALUES
        ('$remoteuser','$childId')
        ";
        echo $sql;
        $result = $conn->query($sql);   
      } else if($operationType == "remove") {
        $sql = "
        DELETE FROM user_folders
        WHERE username='$remoteuser' 
        AND folderId='$childId'
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