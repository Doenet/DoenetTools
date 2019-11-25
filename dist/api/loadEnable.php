<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
$_GET = json_decode(file_get_contents("php://input"),true);
$overview =  mysqli_real_escape_string($conn,$_GET["overview"]);
$grade =  mysqli_real_escape_string($conn,$_GET["grade"]);
$syllabus =  mysqli_real_escape_string($conn,$_GET["syllabus"]);
$assignment =  mysqli_real_escape_string($conn,$_GET["assignment"]);
$overview_branchId;
$syllabus_branchId;

// echo $overview;
// echo $grade;
// echo $syllabus;
// echo $assignment;
// $List = array();
$sql = "
  SELECT overviewEnabled, gradeEnabled,syllabusEnabled,assignmentEnabled,overview_branchId,syllabus_branchId
  from course
";
$result = $conn->query($sql);
if ($result->num_rows > 0){
   while ($row = $result->fetch_assoc()){
    $overview = $row["overviewEnabled"];
    $grade = $row["gradeEnabled"];
    $syllabus = $row["syllabusEnabled"];
    $assignment = $row["assignmentEnabled"];
    $overview_branchId = $row["overview_branchId"];
    $syllabus_branchId = $row["syllabus_branchId"];
   }
}
$response_arr = array(
  "overview" => $overview,
  "syllabus"=>$syllabus,
  "grade"=>$grade,
  "assignment"=>$assignment,
  "overview_branchId"=>$overview_branchId,
  "syllabus_branchId" =>$syllabus_branchId
  );
  http_response_code(200);

  // make it json format
  echo json_encode($response_arr);
 
 $conn->close();

?> 