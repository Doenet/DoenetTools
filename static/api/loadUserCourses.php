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

//Add courses where user is an instructor
$sql="
SELECT 
c.courseId As courseId,
c.shortName AS shortName,
c.longName AS longName,
c.description AS description
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
          "shortname" => $row["shortName"],
          "longname" => $row["longName"],
          "description" => $row["description"],
          "role" => "Instructor"
    );
    array_push($courseInfo, $course);

  }
}

//Add courses where user is enrolled
$sql="
SELECT 
c.courseId As courseId,
c.shortName AS shortName,
c.longName AS longName,
c.description AS description
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
          "shortname" => $row["shortName"],
          "longname" => $row["longName"],
          "description" => $row["description"],
          "role" => "Student"
    );
    array_push($courseInfo, $course);

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