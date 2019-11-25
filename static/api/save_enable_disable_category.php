<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
$_POST = json_decode(file_get_contents("php://input"),true);
$overview =  mysqli_real_escape_string($conn,$_POST["overview"]);
$grade =  mysqli_real_escape_string($conn,$_POST["grade"]);
$syllabus =  mysqli_real_escape_string($conn,$_POST["syllabus"]);
$assignment =  mysqli_real_escape_string($conn,$_POST["assignment"]);
// echo $overview;
// echo $grade;
// echo $syllabus;
// echo $assignment;
$sql = "
  UPDATE course
  SET overviewEnabled='$overview',
  gradeEnabled = '$grade',
  syllabusEnabled = '$syllabus',
  assignmentEnabled = '$assignment'
";
$result = $conn->query($sql);

?> 