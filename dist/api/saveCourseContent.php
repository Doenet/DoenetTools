<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
$_POST = json_decode(file_get_contents("php://input"),true);
$courseId = mysqli_real_escape_string($conn,$_POST["courseId"]);
$number_items = count($_POST["itemIds"]);
$operationType =  mysqli_real_escape_string($conn,$_POST["operationType"]);


for ($i = 0; $i < $number_items; $i++) {
  $itemId =  mysqli_real_escape_string($conn,$_POST["itemIds"][$i]);
  $itemType =  mysqli_real_escape_string($conn,$_POST["itemTypes"][$i]);
  //TEST if link already exists 
  $sql = "
  SELECT id
  FROM course_content
  WHERE itemId = '$itemId' AND courseId='$courseId'
  ";
  $result = $conn->query($sql); 
  if ($result->num_rows < 1 && $operationType == "insert"){
    // Store if not already exist
    $sql = "
    INSERT INTO course_content
    (courseId, itemId, itemType, timestamp)
    VALUES
    ('$courseId','$itemId' ,'$itemType', NOW())
    ";
    $result = $conn->query($sql); 
  } else if ($result->num_rows > 0 && $operationType == "insert") {
    // Readd if previously removed
    $sql = "
    UPDATE course_content
    SET removedFlag=0,
    timestamp=NOW()
    WHERE itemId='$itemId' AND courseId='$courseId'
    ";
    $result = $conn->query($sql); 

  } else if ($result->num_rows > 0 && $operationType == "remove") {
    // Update content to have removedFlag=1 (remove from folder)
    $sql = "
    UPDATE course_content
    SET removedFlag=1,
    timestamp=NOW()
    WHERE itemId='$itemId' AND courseId='$courseId'
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