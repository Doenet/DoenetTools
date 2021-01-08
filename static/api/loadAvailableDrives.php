<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
include "db_connection.php";

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];
$success = TRUE;
$results_arr = array();

$driveIdsAndLabels = array();
$sql = "
SELECT
d.driveId as driveId,
d.label as label,
d.driveType as driveType,
d.isShared as isShared,
d.courseId as courseId
FROM drive AS d
LEFT JOIN drive_user AS du
ON d.driveId = du.driveId
WHERE du.userId = '3oN5gDY3392zexHopijG6'
";


$result = $conn->query($sql); 

while($row = $result->fetch_assoc()){
  $driveAndLabel = array(
    "driveId"=>$row['driveId'],
    "label"=>$row['label'],
    "type"=>$row['driveType'],
    "isShared"=>$row['isShared'],
    "courseId"=>$row['courseId'],
  );
  array_push($driveIdsAndLabels,$driveAndLabel);
}
  
  $response_arr = array(
    'success'=>$success,
  'driveIdsAndLabels'=> $driveIdsAndLabels);

  http_response_code(200);


  echo json_encode($response_arr);
  $conn->close();

?>