<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
$_POST = json_decode(file_get_contents("php://input"),true);
$public = (mysqli_real_escape_string($conn,$_POST["isPublic"]) == true) ? 1 : 0;
$number_items = count($_POST["itemIds"]);

for ($i = 0; $i < $number_items; $i++) {
  $itemId =  mysqli_real_escape_string($conn,$_POST["itemIds"][$i]);
  $itemType =  mysqli_real_escape_string($conn,$_POST["itemType"][$i]);

  $sql = "";
  if ($itemType == "content") {
    $sql = "
      UPDATE content
      SET public='$public'
      WHERE branchId='$itemId'
    ";
  } else {  // $itemType == "folder"
    $sql = "
      UPDATE folder
      SET public='$public'
      WHERE folderId='$itemId'
    ";
  }
  
  $result = $conn->query($sql); 
  echo $sql;
}

if ($result === TRUE) {
  // set response code - 200 OK
    http_response_code(200);
}else {
  echo "Error: " . $sql . "\n" . $conn->error;
}
$conn->close();

?>