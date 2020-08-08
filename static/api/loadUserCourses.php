<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId']; 

// $sql = "SELECT course.courseId, course.longName, course.shortName, course.term, course.imageUrl, course.color
//         FROM course_enrollment
//         JOIN course 
//         ON course_enrollment.courseId = course.courseId
//         AND course_enrollment.userId = '$userId'
//         ";

// $result = $conn->query($sql);

// $courseId_arr = array();
// $courseIndex = 0;
// $courseIdToIndexHash = array();
// while ($row = $result->fetch_assoc()) {
//     array_push($courseId_arr,
//     array(
//         "courseId" => $row['courseId'],
//         "longName" => $row['longName'],
//         "shortName" => $row['shortName'],
//         "term" => $row['term'],
//         "imageUrl" => $row['imageUrl'],
//         "color" => $row['color'],
//         "order" => null
//     )
//     );
//     $courseIdToIndexHash[$row['courseId']] = $courseIndex;
//     $courseIndex += 1;
// }

// //ToDo check in modified db
// $sql = "SELECT udm.courseId, udm.color, udm.order, udm.imageUrl
//         FROM user_dashboard_modification as udm
//         WHERE udm.userId = '$userId'
// ";

// $result = $conn->query($sql);
// while ($row = $result->fetch_assoc()) {
//     if($row['color'] != null){
//         $courseId_arr[$courseIdToIndexHash[$row['courseId']]]['color'] = $row['color'];
//     }
//     if($row['order'] != null){
//         $courseId_arr[$courseIdToIndexHash[$row['courseId']]]['order'] = $row['order'];
//     }
//     if($row['imageUrl'] != null){
//         $courseId_arr[$courseIdToIndexHash[$row['courseId']]]['imageUrl'] = $row['imageUrl'];
//     }
// }



$courseInfo = array();
$courseId_arr = array();
$courseIndex = 0;
//Add courses where user is an instructor
$sql="
SELECT 
c.courseId As courseId,
c.shortName AS shortName,
c.longName AS longName,
c.description AS description,
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
          "shortname" => $row["shortName"],
          "longname" => $row["longName"],
          "description" => $row["description"],
          "color" => $row["color"],
          "image" => $row["image"],
          "term" => $row["term"],
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
c.shortName AS shortName,
c.longName AS longName,
c.description AS description,
c.color AS color,
c.term AS term,
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
          "shortname" => $row["shortName"],
          "longname" => $row["longName"],
          "description" => $row["description"],
          "color" => $row["color"],
          "image" => $row["image"],
          "term" => $row["term"],
          "role" => "Student"
    );
    array_push($courseInfo, $course);
    $courseIdToIndexHash[$row['courseId']] = $courseIndex;
    $courseIndex += 1;
  }
}

$sql = "SELECT udm.courseId, udm.color, udm.order, udm.image
         FROM user_dashboard_modification as udm
         WHERE udm.userId = '$userId'
";

//echo json_encode($courseInfo);

$result = $conn->query($sql);
while ($row = $result->fetch_assoc()) {
    if($row['color'] != null){
        $courseInfo[$courseIdToIndexHash[$row['courseId']]]['color'] = $row['color'];
    }
    if($row['order'] != null){
        $courseInfo[$courseIdToIndexHash[$row['courseId']]]['order'] = intval($row['order']);
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