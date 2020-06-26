<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

// Content
$_POST = json_decode(file_get_contents("php://input"),true);
$number_content = count($_POST["contentSeeds"]["contentId"]);

for ($i = 0; $i < $number_content; $i++){
  $branchId = mysqli_real_escape_string($conn,$_POST["contentSeeds"]["branchId"][$i]);
  $title =  mysqli_real_escape_string($conn,$_POST["contentSeeds"]["title"][$i]);
  $doenetML = mysqli_real_escape_string($conn,$_POST["contentSeeds"]["doenetML"][$i]);
  $contentId = mysqli_real_escape_string($conn,$_POST["contentSeeds"]["contentId"][$i]);

  $sql = "
  INSERT INTO content_branch
  (branchId,title,doenetML,updateDate,creationDate,latestContentId)
  VALUES
  ('$branchId','$title','$doenetML',NOW(),NOW(),'$contentId')
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
  INSERT INTO user_content
  (username, branchId)
  VALUES
  ('devuser','$branchId')
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
  INSERT INTO content
  (doenetML,branchId,title,contentId,timestamp,draft)
  VALUES
  ('$doenetML','$branchId','$title','$contentId',NOW(),1)
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

// Heading
$number_folders = count($_POST["folderSeeds"]["folderId"]);

for ($i = 0; $i < $number_folders; $i++){

  $folderId = mysqli_real_escape_string($conn,$_POST["folderSeeds"]["folderId"][$i]);
  $title =  mysqli_real_escape_string($conn,$_POST["folderSeeds"]["title"][$i]);
  $parentId = mysqli_real_escape_string($conn,$_POST["folderSeeds"]["parentId"][$i]);
  
  $sql = "
  INSERT INTO folder
  (folderId,title ,parentId, creationDate)
  VALUES
  ('$folderId','$title','$parentId' ,NOW())
  ";
  $result = $conn->query($sql);
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  if ($parentId !== "root") {
    $sql = "
    INSERT INTO folder_content
    (folderId, childId, childType, timestamp)
    VALUES
    ('$parentId','$folderId' ,'folder', NOW())
    ";
    $result = $conn->query($sql); 
  } else {
    $sql = "
    INSERT INTO user_folders
    (username, folderId)
    VALUES
    ('devuser','$folderId')
    ";
    $result = $conn->query($sql); 
  }
}


$conn->close();

?>