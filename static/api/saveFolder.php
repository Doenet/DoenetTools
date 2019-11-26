<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
$_POST = json_decode(file_get_contents("php://input"),true);
$title =  mysqli_real_escape_string($conn,$_POST["title"]);
$folderId = mysqli_real_escape_string($conn,$_POST["folderId"]);
$parentId = mysqli_real_escape_string($conn,$_POST["parentId"]);
$number_children = count($_POST["childContent"]);
$operationType =  mysqli_real_escape_string($conn,$_POST["operationType"]);

//TEST if folder exists
$sql = "
SELECT id
FROM folder
WHERE folderId = '$folderId'
";
$result = $conn->query($sql); 
if ($result->num_rows < 1){
  //No previous information on this folder so store new folder
  $sql = "
  INSERT INTO folder
  (folderId,title ,parentId, creationDate)
  VALUES
  ('$folderId','$title','root' ,NOW())
  ";
  $result = $conn->query($sql); 
}

for ($i = 0; $i < $number_children; $i++) {
  $childId =  mysqli_real_escape_string($conn,$_POST["childContent"][$i]);
  $childType =  mysqli_real_escape_string($conn,$_POST["childType"][$i]);
  //TEST if children already exists 
  $sql = "
  SELECT id
  FROM folder_content
  WHERE childId = '$childId'
  ";
  $result = $conn->query($sql); 
  if ($result->num_rows < 1 && $operationType == "insert"){
    // Store if not already in folder
    $sql = "
    INSERT INTO folder_content
    (folderId, childId, childType, timestamp)
    VALUES
    ('$folderId','$childId' ,'$childType', NOW())
    ";
    $result = $conn->query($sql); 

    if ($childType === "folder") {
      // update parentId of folder
      $sql = "
      UPDATE folder
      SET parentId='$folderId'
      WHERE folderId='$childId'
      ";
      $result = $conn->query($sql); 
    }
  } else if ($result->num_rows > 0 && $operationType == "insert") {
    // Update parent link if child already exist
    $sql = "
    UPDATE folder_content
    SET folderId='$folderId'
    WHERE childId='$childId'
    ";
    $result = $conn->query($sql); 

    if ($childType === "folder") {
      // update parentId of folder
      $sql = "
      UPDATE folder
      SET parentId='$folderId'
      WHERE folderId='$childId'
      ";
      $result = $conn->query($sql); 
    }

  } else if ($result->num_rows > 0 && $operationType == "remove") {
    // Update content to have removedFlag=1 (remove from folder)
    $sql = "
    UPDATE folder_content
    SET removedFlag=1,
    timestamp=NOW()
    WHERE childId='$childId' AND folderId='$folderId'
    ";
    $result = $conn->query($sql); 
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