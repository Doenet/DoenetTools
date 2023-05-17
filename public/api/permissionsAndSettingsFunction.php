<?php
namespace Legacy;

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
      c.canAutoEnroll,
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
      AND c.portfolioCourseForUserId IS NULL
      ORDER BY c.id DESC
      ";

    //TODO: Kevin, Emilio – discus True / Flase vs '1' / '0' returns
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($oneCourse = $result->fetch_assoc()) {
            array_push($permissionsAndSettings, $oneCourse);
        }
    }

    return $permissionsAndSettings;
}

?>
