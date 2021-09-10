<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);

$success = TRUE;
$message = "";

if ($driveId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing driveId';
}

//Check if they have view rights
if ($success){
$sql = "
SELECT canViewDrive
FROM drive_user
WHERE userId='$userId'
AND driveId='$driveId'
AND canViewDrive='1'
";
$result = $conn->query($sql); 
  if ($result->num_rows < 1) {
    $success = FALSE;
    $message = "No access to view course materials.";
  }
}

//Get Assignment data
if ($success){
$sql = "
SELECT 
dc.creationDate,
dc.doenetId,
dc.driveId,
dc.isAssigned,
dc.isPublic,
dc.isReleased,
dc.itemId,
dc.label,
dc.parentFolderId,
dc.sortOrder
FROM drive_content AS dc
LEFT JOIN assignment AS a
ON a.doenetId = dc.doenetId
WHERE dc.driveId = '$driveId'
AND dc.isReleased = '1'
AND a.dueDate < DATE_ADD(NOW(), INTERVAL 7 DAY)
AND a.dueDate > NOW()
ORDER BY a.dueDate ASC
";
//AND a.assignedDate < NOW()

$result = $conn->query($sql); 
$assignments = [];
  while($row = $result->fetch_assoc()){
    array_push($assignments,array(
      "creationDate"=>$row['creationDate'],
      "doenetId"=>$row['doenetId'],
      "driveId"=>$row['driveId'],
      "isAssigned"=>$row['isAssigned'],
      "isPublic"=>$row['isPublic'],
      "isReleased"=>$row['isReleased'],
      "itemId"=>$row['itemId'],
      "label"=>$row['label'],
      "parentFolderId"=>$row['parentFolderId'],
      "sortOrder"=>$row['sortOrder']
    ));
  }

}



$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "assignments"=>$assignments,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>