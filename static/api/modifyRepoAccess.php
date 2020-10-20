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
$repoId =  mysqli_real_escape_string($conn,$_POST["repoId"]);
$operationType =  mysqli_real_escape_string($conn,$_POST["operationType"]);
$owner = mysqli_real_escape_string($conn,$_POST["owner"]) == true ? 1 : 0;

if ($operationType == "insert") {
  //TEST if link already exists 
  $sql = "
  SELECT id
  FROM repo_access
  WHERE repoId='$repoId' AND userId='$userId'
  ";
  $result = $conn->query($sql);
  if ($result->num_rows < 1){
    $sql = "
    INSERT INTO repo_access
    (userId, teamId, repoId, timestamp, owner)
    VALUES
    ('$userId', '1', '$repoId', NOW(), '$owner')
    ";
    $result = $conn->query($sql);
  } else {
    $sql = "
    UPDATE repo_access
    SET removedFlag=0,
    timestamp=NOW()
    WHERE repoId='$repoId' AND userId='$userId'
    ";
    $result = $conn->query($sql);   
  }  
} else if($operationType == "remove") {
  $sql = "
    UPDATE repo_access
    SET removedFlag=1,
    timestamp=NOW()
    WHERE repoId='$repoId' AND userId='$userId'
  ";
  $result = $conn->query($sql);   
}

if ($result === TRUE) {
  // set response code - 200 OK
    http_response_code(200);
}else {
  echo "Error: " . $sql . "\n" . $conn->error;
}
$conn->close();

?>