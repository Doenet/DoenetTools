<?php

function permissionsAndSettingsForOneCourseFunction($conn, $userId, $courseId)
{
    $sql = "SELECT
    c.label,
    c.isPublic,
    c.image,
    c.color,
    cr.label as roleLabel,
    cr.canViewCourse,
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
    cr.canModifyRoles,
    cr.dataAccessPermisson,
    cr.isOwner
    FROM course_role AS cr
    LEFT JOIN course_user as cu
    ON cu.roleId = cr.roleId
    RIGHT JOIN course as c
    ON c.courseId = cu.courseId
    WHERE c.courseId = '$courseId'
    AND cu.userId = '$userId'
    AND cr.canViewCourse = '1'
    AND c.isDeleted = '0'
    ORDER BY c.id DESC
    ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        $permissionsAndSettings = [
            'courseId' => $row['courseId'],
            'label' => $row['label'],
            'isPublic' => $row['isPublic'],
            'image' => $row['image'],
            'color' => $row['color'],
            'roleLabel' => $row['roleLabel'],
            'canViewCourse' => $row['canViewCourse'],
            'isIncludedInGradebook' => $row['isIncludedInGradebook'],
            'canViewContentSource' => $row['canViewContentSource'],
            'canEditContent' => $row['canEditContent'],
            'canPublishContent' => $row['canPublishContent'],
            'canViewUnassignedContent' => $row['canViewUnassignedContent'],
            'canProctor' => $row['canProctor'],
            'canViewAndModifyGrades' => $row['canViewAndModifyGrades'],
            'canViewActivitySettings' => $row['canViewActivitySettings'],
            'canModifyActivitySettings' => $row['canModifyActivitySettings'],
            'canModifyCourseSettings' => $row['canModifyCourseSettings'],
            'canViewUsers' => $row['canViewUsers'],
            'canManageUsers' => $row['canManageUsers'],
            'canModifyRoles' => $row['canModifyRoles'],
            'dataAccessPermisson' => $row['dataAccessPermisson'],
            'isOwner' => $row['isOwner'],
        ];
    }

    return $permissionsAndSettings;
}

?>
