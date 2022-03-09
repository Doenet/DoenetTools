<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";


if ($userId == ''){
  $success = FALSE;
  $message = "You need to be signed in to view courses.";
}

//TODO: Check canViewCourse
$permissionsAndSettings = [];

if ($success){
  $sql = "
  SELECT c.courseId,
  c.label,
  c.isPublic,
  c.image,
  c.color,
  cu.canViewCourse,
  cu.canViewContentSource,
  cu.canEditContent,
  cu.canPublishContent,
  cu.canViewUnassignedContent,
  cu.canProctor,
  cu.canViewAndModifyGrades,
  cu.canViewActivitySettings,
  cu.canModifyCourseSettings,
  cu.canViewUsers,
  cu.canManageUsers,
  cu.canModifyRoles,
  cu.isOwner,
  CAST(cu.roleLabels as CHAR) AS roleLabels
  FROM course_user AS cu
  LEFT JOIN course AS c
  ON c.courseId = cu.courseId
  WHERE cu.userId = '$userId'
  AND cu.canViewCourse = '1'
  AND c.isDeleted = '0'
  ";
  $result = $conn->query($sql); 
  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
      $oneCourse = array(
        "courseId"=>$row['courseId'],
        "label"=>$row['label'],
        "isPublic"=>$row['isPublic'],
        "image"=>$row['image'],
        "color"=>$row['color'],
        "canViewCourse"=>$row['canViewCourse'],
        "canViewContentSource"=>$row['canViewContentSource'],
        "canEditContent"=>$row['canEditContent'],
        "canPublishContent"=>$row['canPublishContent'],
        "canViewUnassignedContent"=>$row['canViewUnassignedContent'],
        "canProctor"=>$row['canProctor'],
        "canViewAndModifyGrades"=>$row['canViewAndModifyGrades'],
        "canViewActivitySettings"=>$row['canViewActivitySettings'],
        "canModifyCourseSettings"=>$row['canModifyCourseSettings'],
        "canViewUsers"=>$row['canViewUsers'],
        "canManageUsers"=>$row['canManageUsers'],
        "canModifyRoles"=>$row['canModifyRoles'],
        "isOwner"=>$row['isOwner'],
        "roleLabels"=>json_decode($row['roleLabels'],true)
      );
      array_push($permissionsAndSettings,$oneCourse);
    }
  
  }
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "permissionsAndSettings"=>$permissionsAndSettings,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>