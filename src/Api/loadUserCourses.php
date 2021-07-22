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
d.driveId AS driveId,
d.label AS label,
d.driveType AS driveType,
d.color AS color,
d.isShared as isShared,
d.isPublic as isPublic,
d.isDeleted as isDeleted,
d.image AS image
FROM drive AS d
LEFT JOIN drive_user AS du
ON d.driveId = du.driveId
WHERE du.userId = '$userId'
ORDER BY d.label
";

$result = $conn->query($sql);

         
if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    $course = array(
          "driveId" => $row["driveId"],
          "label" => $row["label"],
          "driveType" => $row["driveType"],
          "color" => $row["color"],
          "isShared" => $row["isShared"],
          "isPublic" => $row["isPublic"],
          "isDeleted" => $row["isDeleted"],
          "image" => $row["image"],
          "role" => "Instructor"
    );
    array_push($courseInfo, $course);
  }
}

//echo json_encode($courseInfo);

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