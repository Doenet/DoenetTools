<?php

function permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId){

  $sql = "
  SELECT 
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
  AND c.courseId = '$courseId'
  ORDER BY c.id DESC
  ";

  $result = $conn->query($sql); 
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    $permissionsAndSettings = array(
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
    
    }
    
    return $permissionsAndSettings;
  }


?>
