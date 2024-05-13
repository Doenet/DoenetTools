<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$_POST = json_decode(file_get_contents("php://input"),true);
$number_content = count($_POST["contentSeeds"]["contentId"]);

for ($i = 0; $i < $number_content; $i++){
  $doenetId = mysqli_real_escape_string($conn,$_POST["contentSeeds"]["doenetId"][$i]);
  $sql = "
  DELETE FROM content_branch
  WHERE doenetId = '$doenetId'
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
  DELETE FROM content
  WHERE doenetId = '$doenetId'
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

$number_seeds = count($_POST["assignmentSeeds"]);

for ($i = 0; $i < $number_seeds; $i++){

  $courseHeadingId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["courseHeadingId"]);
  $courseId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["courseId"]);

    $sql = "DELETE FROM course_heading 
    WHERE courseHeadingId = '$courseHeadingId' 
    AND courseId = '$courseId'
    ";
    $result = $conn->query($sql);

  if ($result === TRUE) {
      // set response code - 200 OK
      http_response_code(200);
  }else {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $number_assignments = count($_POST["assignmentSeeds"][$i]["documentName"]);
  for ($j = 0; $j < $number_assignments; $j++){
    $assignmentId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["assignmentId"][$j]);

    $sql = "DELETE FROM assignment 
    WHERE assignmentId='$assignmentId' 
    AND courseId='$courseId'
    ";
    $result = $conn->query($sql);
  }

  if ($result === TRUE) {
      // set response code - 200 OK
      http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}


$conn->close();

?>

