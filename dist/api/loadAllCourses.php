<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$userId = "bogus";
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
RIGHT JOIN course_instructor ci ON c.courseId = ci.courseId AND ci.userId='$userId' 
ORDER BY c.courseId
";

$result = $conn->query($sql); 
$response_arr = array();
$courseId_info_arr = array();
$ci_array = array();
    
if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    if ($row['courseId'] != NULL){
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
}

$response_arr = array(
  "courseInfo"=>$courseId_info_arr,
  "courseIds"=>$ci_array,
);

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>