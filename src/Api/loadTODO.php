<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require 'defineDBAndUserAndCourseInfo.php';

$success = TRUE;
$message = "";


if ($userId == '' && $examUserId == ''){
  $success = FALSE;
  $message = "You need to be signed in to view courses.";
}

$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);

if ($courseId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing courseId';
}else if (!array_key_exists($courseId,$permissionsAndSettingsByCourseId)){
  // Check if enrolled in course
  $success = FALSE;
  $message = "No access to view course materials.";
}

//Get Assignment data
if ($success) {
  $sql = "
  SELECT 
  cc.type, 
  cc.doenetId, 
  cc.parentDoenetId, 
  cc.label,
  cc.creationDate, 
  cc.courseId,
  cc.isDeleted, 
  cc.isAssigned, 
  cc.isGloballyAssigned, 
  cc.isPublic, 
  cc.userCanViewSource, 
  cc.sortOrder, 
  a.assignedDate, 
  a.dueDate, 
  a.pinnedAfterDate,
  a.pinnedUntilDate,
  a.gradeCategory,
  a.totalPointsOrPercent,
  ua.credit,
  ua.creditOverride
  FROM course_content AS cc
  LEFT JOIN assignment AS a
  ON cc.doenetId = a.doenetId
  LEFT JOIN user_assignment AS ua
  ON cc.doenetId = ua.doenetId AND
  ua.userId='$userId'
  ";

  if($permissionsAndSettingsByCourseId[$courseId]["canEditContent"] == '1') {
    $sql = $sql . "
  WHERE (cc.courseId='$courseId'
  AND cc.isAssigned = '1'
  AND cc.isDeleted = '0'
  AND a.dueDate IS NOT NULL) 
  OR (cc.courseId='$courseId'
  AND cc.isAssigned = '1'
  AND cc.isDeleted = '0'
  AND a.pinnedAfterDate < CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
  AND a.pinnedUntilDate > CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))
    ";
  } else {
    $sql = $sql . "
  WHERE (cc.courseId='$courseId'
  AND cc.isAssigned = '1'
  AND cc.isDeleted = '0'
  AND (cc.isGloballyAssigned = '1' OR ua.isUnassigned = '0')
  AND a.dueDate IS NOT NULL) 
  OR (cc.courseId='$courseId'
  AND cc.isAssigned = '1'
  AND cc.isDeleted = '0'
  AND (cc.isGloballyAssigned = '1' OR ua.isUnassigned = '0')
  AND a.pinnedAfterDate < CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
  AND a.pinnedUntilDate > CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))
    ";
  }

  $sql = $sql . "ORDER BY a.dueDate ASC, a.pinnedAfterDate ASC, cc.sortOrder";

  $result = $conn->query($sql); 
  $assignments = [];
  $pinned = [];
  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){   // get row of results
      if ($row['pinnedAfterDate'] == NULL){     // not pinned items
        array_push($assignments,array(
          "type"=>$row['type'], 
          "label"=>$row['label'],
          "gradeCategory"=>$row['gradeCategory'],
          "totalPointsOrPercent"=>$row['totalPointsOrPercent'],
          "credit"=>$row['credit'],
          "creditOverride"=>$row['creditOverride'],
          "pinnedAfterDate"=>$row['pinnedAfterDate'],
          "creationDate"=>$row['creationDate'],
          "assignedDate"=>$row['assignedDate'],
          "dueDate"=>$row['dueDate'],
          "doenetId"=>$row['doenetId'],
          "courseId"=>$row['courseId'],
          "isAssigned"=>$row['isAssigned'],
          "isPublic"=>$row['isPublic'],
          "parentDoenetId"=>$row['parentDoenetId'],
          "sortOrder"=>$row['sortOrder']
        ));
      }else{
        array_push($pinned,array(            // pinned items 
          "type"=>$row['type'],
          "label"=>$row['label'],
          "gradeCategory"=>$row['gradeCategory'],
          "totalPointsOrPercent"=>$row['totalPointsOrPercent'],
          "credit"=>$row['credit'],
          "creditOverride"=>$row['creditOverride'],
          "pinnedAfterDate"=>$row['pinnedAfterDate'],
          "creationDate"=>$row['creationDate'],
          "assignedDate"=>$row['assignedDate'],
          "dueDate"=>$row['dueDate'],
          "doenetId"=>$row['doenetId'],
          "courseId"=>$row['courseId'],
          "isAssigned"=>$row['isAssigned'],
          "isPublic"=>$row['isPublic'],
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
  WHERE courseId = '$courseId'
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
FROM course_content AS cc
LEFT JOIN user_assignment AS ua
ON ua.doenetId = cc.doenetId
WHERE ua.userId = '$userId'
AND ua.completed = '1'
AND cc.courseId = '$courseId'
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
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>