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
  SELECT role
  FROM drive_user
  WHERE driveId = '$driveId'
  and userId = '$userId'
  ";

  $result = $conn->query($sql);  
  $row = $result->fetch_assoc();
  $role = $row['role'];
  //Students should only see their own data
  if ($role != 'Instructor'){
    $success = FALSE;
    $message = "No access to view survey.";
  }

}

//Get Assignment data
if ($success){
  $sql = "
  SELECT dc.label, dc.doenetId
  FROM drive_content AS dc
  INNER JOIN assignment AS a
  ON dc.doenetId = a.doenetId
  WHERE
  dc.driveId = '$driveId'
  AND a.gradeCategory = ''
  AND a.totalPointsOrPercent = 0
  AND dc.isDeleted = '0'
  AND dc.isReleased = '1'
  ";


$result = $conn->query($sql); 
//num_row

// $assignments = [];
// $pinned = [];
// if ($result->num_rows > 0) {
//   while($row = $result->fetch_assoc()){
//     if ($row['pinnedAfterDate'] == ""){
//       array_push($assignments,array(
//         "itemType"=>$row['itemType'],
//         "pinnedAfterDate"=>$row['pinnedAfterDate'],
//         "creationDate"=>$row['creationDate'],
//         "assignedDate"=>$row['assignedDate'],
//         "dueDate"=>$row['dueDate'],
//         "doenetId"=>$row['doenetId'],
//         "driveId"=>$row['driveId'],
//         "isAssigned"=>$row['isAssigned'],
//         "isPublic"=>$row['isPublic'],
//         "isReleased"=>$row['isReleased'],
//         "itemId"=>$row['itemId'],
//         "label"=>$row['label'],
//         "parentFolderId"=>$row['parentFolderId'],
//         "sortOrder"=>$row['sortOrder']
//       ));
//     }else{
//       array_push($pinned,array(
//         "itemType"=>$row['itemType'],
//         "pinnedAfterDate"=>$row['pinnedAfterDate'],
//         "creationDate"=>$row['creationDate'],
//         "assignedDate"=>$row['assignedDate'],
//         "dueDate"=>$row['dueDate'],
//         "doenetId"=>$row['doenetId'],
//         "driveId"=>$row['driveId'],
//         "isAssigned"=>$row['isAssigned'],
//         "isPublic"=>$row['isPublic'],
//         "isReleased"=>$row['isReleased'],
//         "itemId"=>$row['itemId'],
//         "label"=>$row['label'],
//         "parentFolderId"=>$row['parentFolderId'],
//         "sortOrder"=>$row['sortOrder']
//       ));
//     }
//   }
// }

//   $classTimes = [];
//   $sql = "
//   SELECT dotwIndex,
//   DATE_FORMAT(startTime, '%H:%i') AS startTime,
//   DATE_FORMAT(endTime, '%H:%i') AS endTime
//   FROM class_times
//   WHERE driveId = '$driveId'
//   ORDER BY sortOrder
//   ";
//   $result = $conn->query($sql); 
//   if ($result->num_rows > 0) {
//     while($row = $result->fetch_assoc()){
//       array_push($classTimes,array(
//         "dotwIndex"=>$row['dotwIndex'],
//         "startTime"=>$row['startTime'],
//         "endTime"=>$row['endTime']
//       ));
//     }
//   }
// }

// $completed = [];

// $sql = "
// SELECT ua.doenetId
// FROM drive_content AS dc
// LEFT JOIN user_assignment AS ua
// ON ua.doenetId = dc.doenetId
// WHERE ua.userId = '$userId'
// AND ua.completed = '1'
// AND dc.driveId = '$driveId'
// ";

// $result = $conn->query($sql); 
// if ($result->num_rows > 0) {
//   while($row = $result->fetch_assoc()){
//     array_push($completed,$row['doenetId']);
//   }
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