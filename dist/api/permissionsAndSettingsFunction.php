<?php

function getpermissionsAndSettings($conn, $userId)
{
    $permissionsAndSettings = [];

    $sql = "SELECT
      c.courseId,
      c.label,
      c.isPublic,
      c.image,
      c.color,
      c.defaultRoleId,
      cr.roleId,
      cr.label as roleLabel,
      cr.isIncludedInGradebook,
      cr.canViewContentSource,
      cr.canEditContent,
      cr.canPublishContent,
      cr.canViewUnassignedContent,
      cr.canProctor,
      cr.canViewAndModifyGrades,
      cr.canViewActivitySettings,
      cr.canModifyActivitySettings,
      cr.canModifyCourseSettings,
      cr.canViewUsers,
      cr.canManageUsers,
      cr.canViewCourse,
      cr.isAdmin,
      cr.dataAccessPermission,
      cr.isOwner
      FROM course_role AS cr
      LEFT JOIN course_user as cu
      ON cu.roleId = cr.roleId
      RIGHT JOIN course as c
      ON c.courseId = cu.courseId
      WHERE cu.userId = '$userId'
      AND c.isDeleted = '0'
      ORDER BY c.id DESC
      ";

    //TODO: Kevin, Emilio – discus True / Flase vs '1' / '0' returns
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $oneCourse = [
                'courseId' => $row['courseId'],
                'label' => $row['label'],
                'isPublic' => $row['isPublic'],
                'image' => $row['image'],
                'color' => $row['color'],
                'defaultRoleId' => $row['defaultRoleId'],
                'roleId' => $row['roleId'],
                'roleLabel' => $row['roleLabel'],
                'isIncludedInGradebook' => $row['isIncludedInGradebook'],
                'canViewContentSource' => $row['canViewContentSource'],
                'canEditContent' => $row['canEditContent'],
                'canPublishContent' => $row['canPublishContent'],
                'canViewUnassignedContent' => $row['canViewUnassignedContent'],
                'canProctor' => $row['canProctor'],
                'canViewAndModifyGrades' => $row['canViewAndModifyGrades'],
                'canViewActivitySettings' => $row['canViewActivitySettings'],
                'canModifyActivitySettings' =>
                    $row['canModifyActivitySettings'],
                'canModifyCourseSettings' => $row['canModifyCourseSettings'],
                'canViewUsers' => $row['canViewUsers'],
                'canManageUsers' => $row['canManageUsers'],
                'canViewCourse' => $row['canViewCourse'],
                'isAdmin' => $row['isAdmin'],
                'dataAccessPermission' => $row['dataAccessPermission'],
                'isOwner' => $row['isOwner'],
            ];
            array_push($permissionsAndSettings, $oneCourse);
        }
    }

    return $permissionsAndSettings;
}

?>
