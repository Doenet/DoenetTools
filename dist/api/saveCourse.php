<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";


$_POST = json_decode(file_get_contents("php://input"),true);
$courseId = mysqli_real_escape_string($conn,$_POST["courseId"]);
$term = mysqli_real_escape_string($conn,$_POST["term"]);
$longName = mysqli_real_escape_string($conn,$_POST["longName"]);
$shortName = mysqli_real_escape_string($conn,$_POST["shortName"]);
$description = mysqli_real_escape_string($conn,$_POST["description"]);
$overviewId = mysqli_real_escape_string($conn,$_POST["overviewId"]);
$syllabusId = mysqli_real_escape_string($conn,$_POST["syllabusId"]);
$section = mysqli_real_escape_string($conn,$_POST["section"]);
$department = mysqli_real_escape_string($conn,$_POST["department"]);


$sql = "
SELECT id
FROM course
WHERE courseId = '$courseId'
";
if ($courseId != ""){
  $result = $conn->query($sql); 
}

if ($result->num_rows < 1){
  //No information on this course so store it
  $sql = "
  INSERT INTO course
  (courseId, term, longName, shortName, description, overview_branchId, syllabus_branchId, section, department)
  VALUES
  ('$courseId','$term','$longName', '$shortName', '$description', '$overviewId', '$syllabusId', '$section', '$department')
  ";
  echo $sql;
  if ($courseId != ""){
    $result = $conn->query($sql); 
  }
}

if ($result === TRUE) {
  http_response_code(200);
}else {
  echo "Error: " . $sql . "\n" . $conn->error;
}

$conn->close();
?>

