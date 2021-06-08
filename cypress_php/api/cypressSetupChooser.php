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
  $doenetId = mysqli_real_escape_string($conn,$_POST["contentSeeds"]["doenetId"][$i]);
  $title =  mysqli_real_escape_string($conn,$_POST["contentSeeds"]["title"][$i]);
  $doenetML = mysqli_real_escape_string($conn,$_POST["contentSeeds"]["doenetML"][$i]);
  $contentId = mysqli_real_escape_string($conn,$_POST["contentSeeds"]["contentId"][$i]);

  $sql = "
  INSERT INTO content_branch
  (doenetId,title,doenetML,updateDate,creationDate,latestContentId)
  VALUES
  ('$doenetId','$title','$doenetML',NOW(),NOW(),'$contentId')
  ";
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
  INSERT INTO user_content
  (username, doenetId)
  VALUES
  ('devuser','$doenetId')
  ";
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
  INSERT INTO content
  (doenetML,doenetId,title,contentId,timestamp,draft)
  VALUES
  ('$doenetML','$doenetId','$title','$contentId',NOW(),1)
  ";
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
  $rootId = mysqli_real_escape_string($conn,$_POST["folderSeeds"]["rootId"][$i]);
  $isRepo = mysqli_real_escape_string($conn,$_POST["folderSeeds"]["isRepo"][$i]);
  $isPublic = mysqli_real_escape_string($conn,$_POST["folderSeeds"]["isPublic"][$i]);
  
  $sql = "
  INSERT INTO folder
  (folderId,title ,parentId, creationDate, isRepo, public)
  VALUES
  ('$folderId','$title','$parentId' ,NOW(), '$isRepo', '$isPublic')
  ";
  $result = $conn->query($sql);
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
    INSERT INTO folder_content
    (rootId, folderId, childId, childType, timestamp)
    VALUES
    ('$rootId', '$parentId','$folderId' ,'folder', NOW())
    ";
  $result = $conn->query($sql); 
  
  $sql = "
    INSERT INTO user_folders
    (username, folderId)
    VALUES
    ('devuser','$folderId')
    ";
    echo $sql;
    $result = $conn->query($sql);   
}

// Url
$numberUrls = count($_POST["urlSeeds"]["urlId"]);

for ($i = 0; $i < $numberUrls; $i++){
  $urlId =  mysqli_real_escape_string($conn,$_POST["urlSeeds"]["urlId"][$i]);
  $title = mysqli_real_escape_string($conn,$_POST["urlSeeds"]["title"][$i]);
  $url = mysqli_real_escape_string($conn,$_POST["urlSeeds"]["url"][$i]);

  $sql = "
  INSERT INTO url
  (urlId, title ,url, description, timestamp, usesDoenetAPI)
  VALUES
  ('$urlId','$title','$url', '', NOW(), false)
  ";
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
    INSERT INTO user_urls
    (username, urlId)
    VALUES
    ('devuser','$urlId')
  ";
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