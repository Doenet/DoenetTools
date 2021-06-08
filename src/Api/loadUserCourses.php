<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];


$courseInfo = array();
$courseId_arr = array();
$courseIndex = 0;
//Add courses where user is an instructor
$sql="
SELECT 
c.courseId AS courseId,
c.shortName AS courseCode,
c.longName AS longName,
c.term as term,
c.description AS description,
c.overview_doenetId as overviewId,
c.syllabus_doenetId as syllabusId,
c.overviewEnabled as overviewEnabled,
c.syllabusEnabled as syllabusEnabled,
c.gradeEnabled as gradeEnabled,
c.assignmentEnabled as assignmentEnabled,
c.department as department,
c.section as section,
c.color AS color,
c.term AS term,
c.image AS image
FROM course AS c
LEFT JOIN course_instructor AS ci
ON c.courseId = ci.courseId
WHERE ci.userId = '$userId'
ORDER BY c.shortName
";

$result = $conn->query($sql); 

         
if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    $course = array(
          "courseId" => $row["courseId"],
          "courseCode" => $row["courseCode"],
          "shortname" => $row["courseCode"],
          "longname" => $row["longName"],
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
          "color" => $row["color"],
          "image" => $row["image"],
          "role" => "Instructor"
    );
    array_push($courseInfo, $course);
    $courseIdToIndexHash[$row['courseId']] = $courseIndex;
    $courseIndex += 1;

  }
}

//Add courses where user is enrolled
$sql="
SELECT 
c.courseId As courseId,
c.shortName AS courseCode,
c.longName AS longName,
c.term as term,
c.description AS description,
c.overview_doenetId as overviewId,
c.syllabus_doenetId as syllabusId,
c.overviewEnabled as overviewEnabled,
c.syllabusEnabled as syllabusEnabled,
c.gradeEnabled as gradeEnabled,
c.assignmentEnabled as assignmentEnabled,
c.department as department,
c.section as section,
c.color AS color,
c.image AS image
FROM course AS c
LEFT JOIN course_enrollment AS ce
ON c.courseId = ce.courseId
WHERE ce.userId = '$userId'
ORDER BY c.shortName
";

$result = $conn->query($sql); 


    
if ($result->num_rows > 0){
  
  while($row = $result->fetch_assoc()){ 
    $course = array(
          "courseId" => $row["courseId"],
          "courseCode" => $row["courseCode"],
          "shortname" => $row["courseCode"],
          "longname" => $row["longName"],
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
          "color" => $row["color"],
          "image" => $row["image"],
          "role" => "Student"
    );
    array_push($courseInfo, $course);
    $courseIdToIndexHash[$row['courseId']] = $courseIndex;
    $courseIndex += 1;
  }
}

//echo json_encode($courseInfo);



$sql = "SELECT udm.courseId, udm.color, udm.position, udm.image
         FROM user_dashboard_modification as udm
         WHERE udm.userId = '$userId'
";

//echo json_encode($courseInfo);

$result = $conn->query($sql);
while ($row = $result->fetch_assoc()) {
    if($row['color'] != null){
        $courseInfo[$courseIdToIndexHash[$row['courseId']]]['color'] = $row['color'];
    }
    if($row['position'] != null){
        $courseInfo[$courseIdToIndexHash[$row['courseId']]]['position'] = intval($row['position']);
    }
    if($row['imageUrl'] != null){
        $courseInfo[$courseIdToIndexHash[$row['courseId']]]['imageUrl'] = $row['imageUrl'];
    }
}

$response_arr = array(
 "success" => TRUE,
 "courseInfo" => $courseInfo
);
    
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>