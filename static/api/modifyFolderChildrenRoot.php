<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
$_POST = json_decode(file_get_contents("php://input"),true);
$newRoot =  mysqli_real_escape_string($conn,$_POST["newRoot"]);
$number_items = count($_POST["itemIds"]);

for ($i = 0; $i < $number_items; $i++) {
  $itemId =  mysqli_real_escape_string($conn,$_POST["itemIds"][$i]);

  $sql = "
  UPDATE folder_content
  SET rootId='$newRoot'
  WHERE childId='$itemId'
  ";
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