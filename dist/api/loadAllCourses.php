<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
$overview =  mysqli_real_escape_string($conn,$_GET["overview"]);
$grade =  mysqli_real_escape_string($conn,$_GET["grade"]);
$syllabus =  mysqli_real_escape_string($conn,$_GET["syllabus"]);
$assignment =  mysqli_real_escape_string($conn,$_GET["assignment"]);
$overview_branchId;
$syllabus_branchId;

$sql="
SELECT 
 c.courseId as courseId,
 c.longName as courseName,
 c.shortName as courseCode,
 c.term as term,
 c.description as description,
 c.overview_branchId as overviewId,
 c.syllabus_branchId as syllabusId,

 c.overviewEnabled as overviewEnabled,
 c.syllabusEnabled as syllabusEnabled,
 c.gradeEnabled as gradeEnabled,
 c.assignmentEnabled as assignmentEnabled,

 c.department as department,
 c.section as section
FROM course AS c
ORDER BY c.courseId
";

$result = $conn->query($sql); 
$response_arr = array();
$courseId_info_arr = array();
$ci_array = array();
         
if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    array_push($ci_array, $row["courseId"]);
    $courseId_info_arr[$row["courseId"]] = array(
          "courseName" => $row["courseName"],
          "courseCode" => $row["courseCode"],
          "term" => $row["term"],
          "description" => $row["description"],
          "overviewId" => $row["overviewId"],
          "syllabusId" => $row["syllabusId"],
          "overviewEnabled" => $row["overviewEnabled"],
          "syllabusEnabled" => $row["syllabusEnabled"],
          "gradeEnabled" => $row["gradeEnabled"],
          "assignmentEnabled" => $row["assignmentEnabled"],

          "department" => $row["department"],
          "section" => $row["section"],
          "content" => array(),
          "folders" => array(),
          "urls" => array(),
    );
  }
}

// get course content
$sql="
SELECT 
 cc.courseId as courseId,
 cc.itemId as itemId,
 cc.itemType as itemType
FROM course_content AS cc
WHERE removedFlag=0
ORDER BY cc.courseId
";

$result = $conn->query($sql); 

if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    if ($row["itemType"] == "content") {
      array_push($courseId_info_arr[$row["courseId"]]["content"], $row["itemId"]);
    } else if ($row["itemType"] == "folder"){
      array_push($courseId_info_arr[$row["courseId"]]["folders"], $row["itemId"]);
    } else if ($row["itemType"] == "url"){
      array_push($courseId_info_arr[$row["courseId"]]["urls"], $row["itemId"]);
    }
  }
}

// $defaultCourseId = $courseId_info_arr[$ci_array[0]];


// $sql = "
//   SELECT overviewEnabled, gradeEnabled,syllabusEnabled,assignmentEnabled,overview_branchId,syllabus_branchId
//   from course
//   WHERE courseId = '$defaultCourseId'
// ";
// $result = $conn->query($sql);
// if ($result->num_rows > 0){
//    while ($row = $result->fetch_assoc()){
//     $overview = $row["overviewEnabled"];
//     $grade = $row["gradeEnabled"];
//     $syllabus = $row["syllabusEnabled"];
//     $assignment = $row["assignmentEnabled"];
//     $overview_branchId = $row["overview_branchId"];
//     $syllabus_branchId = $row["syllabus_branchId"];
//    }
// }
$response_arr = array(
  "courseInfo"=>$courseId_info_arr,
  "courseIds"=>$ci_array,

  // "overview" => $overview,
  // "syllabus"=>$syllabus,
  // "grade"=>$grade,
  // "assignment"=>$assignment,
  // "overview_branchId"=>$overview_branchId,
  // "syllabus_branchId" =>$syllabus_branchId
);
    
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();


?>