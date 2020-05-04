<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
$_POST = json_decode(file_get_contents("php://input"),true);
$urlId =  mysqli_real_escape_string($conn,$_POST["urlId"]);
$title = mysqli_real_escape_string($conn,$_POST["title"]);
$url = mysqli_real_escape_string($conn,$_POST["url"]);
$description = mysqli_real_escape_string($conn,$_POST["description"]);
$usesDoenetAPI = (mysqli_real_escape_string($conn,$_POST["usesDoenetAPI"]) == true) ? 1 : 0;

//TEST if url exists
$sql = "
SELECT id
FROM url
WHERE urlId = '$urlId'
";
$result = $conn->query($sql); 
if ($result->num_rows < 1){
  //No previous information on this folder so store new folder
  $sql = "
  INSERT INTO url
  (urlId, title ,url, description, timestamp, usesDoenetAPI)
  VALUES
  ('$urlId','$title','$url', '$description', NOW(), '$usesDoenetAPI')
  ";
  $result = $conn->query($sql); 
} else {
  // update url
  $sql = "
  UPDATE url
  SET title='$title',
      url='$url',
      description='$description',
      usesDoenetAPI='$usesDoenetAPI'
  WHERE urlId='$urlId'
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