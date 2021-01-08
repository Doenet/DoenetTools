<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

// $type = mysqli_real_escape_string($conn,$_REQUEST["type"]);

$success = TRUE;
$results_arr = array();
//TODO: If entry for userId doesn't exist then create Doenet Demo Content 

//Gather matching drive ids
$driveIdsAndLabels = array();
$sql = "
SELECT 
d.driveId AS driveId,
d.label AS label,
d.driveType AS driveType,
d.isShared AS isShared,
d.courseId AS courseId
FROM drive AS d
LEFT JOIN drive_user AS du
ON d.driveId = du.driveId
WHERE du.userId='$userId'
";

$result = $conn->query($sql); 
while($row = $result->fetch_assoc()){ 
  $driveAndLabel = array(
    "driveId"=>$row['driveId'],
    "label"=>$row['label'],
    "type"=>$row['driveType'],
    "type"=>$row['isShared'],
    "type"=>$row['courseId'],
  );
  array_push($driveIdsAndLabels,$driveAndLabel);
}
$response_arr = array(
  "success"=>$success,
  "driveIdsAndLabels"=>$driveIdsAndLabels
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>