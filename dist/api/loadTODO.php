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
dc.itemType,
dc.creationDate,
dc.doenetId,
dc.driveId,
dc.isAssigned,
dc.isPublic,
dc.isReleased,
dc.itemId,
dc.label,
dc.parentFolderId,
dc.sortOrder,
a.assignedDate,
a.dueDate,
a.pinnedAfterDate
FROM drive_content AS dc
LEFT JOIN assignment AS a
ON a.doenetId = dc.doenetId
WHERE (dc.driveId = '$driveId'
AND dc.isReleased = '1'
AND dc.isDeleted = '0'
AND a.dueDate IS NOT NULL )
OR (dc.driveId = '$driveId'
AND dc.isReleased = '1'
AND dc.isDeleted = '0'
AND a.pinnedUntilDate > CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
AND a.pinnedAfterDate < CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))
ORDER BY a.dueDate ASC, a.pinnedAfterDate ASC

";
// ORDER BY a.assignedDate ASC, a.pinnedAfterDate ASC
//AND a.assignedDate < NOW()

$result = $conn->query($sql); 
$assignments = [];
$pinned = [];
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()){
    if ($row['pinnedAfterDate'] == ""){
      array_push($assignments,array(
        "itemType"=>$row['itemType'],
        "pinnedAfterDate"=>$row['pinnedAfterDate'],
        "creationDate"=>$row['creationDate'],
        "assignedDate"=>$row['assignedDate'],
        "dueDate"=>$row['dueDate'],
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
    }else{
      array_push($pinned,array(
        "itemType"=>$row['itemType'],
        "pinnedAfterDate"=>$row['pinnedAfterDate'],
        "creationDate"=>$row['creationDate'],
        "assignedDate"=>$row['assignedDate'],
        "dueDate"=>$row['dueDate'],
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
}

  $classTimes = [];
  $sql = "
  SELECT dotwIndex,
  DATE_FORMAT(startTime, '%H:%i') AS startTime,
  DATE_FORMAT(endTime, '%H:%i') AS endTime
  FROM class_times
  WHERE driveId = '$driveId'
  ORDER BY sortOrder
  ";
  $result = $conn->query($sql); 
  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
      array_push($classTimes,array(
        "dotwIndex"=>$row['dotwIndex'],
        "startTime"=>$row['startTime'],
        "endTime"=>$row['endTime']
      ));
    }
  }
}

$completed = [];

$sql = "
SELECT ua.doenetId
FROM drive_content AS dc
LEFT JOIN user_assignment AS ua
ON ua.doenetId = dc.doenetId
WHERE ua.userId = '$userId'
AND ua.completed = '1'
AND dc.driveId = '$driveId'
";

$result = $conn->query($sql); 
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()){
    array_push($completed,$row['doenetId']);
  }
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "assignments"=>$assignments,
  "pinned"=>$pinned,
  "classTimes"=>$classTimes,
  "completed"=>$completed,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>