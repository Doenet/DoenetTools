<?php

function permissionsAndSettingsForOneCourseFunction($conn, $userId, $courseId)
{
    //TODO: is this safe?
    $sql = "SELECT
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
    cr.isAdmin,
    cr.dataAccessPermisson,
    cr.isOwner
    FROM course_role AS cr
    LEFT JOIN course_user as cu
    ON cu.roleId = cr.roleId
    RIGHT JOIN course as c
    ON c.courseId = cu.courseId
    WHERE c.courseId = '$courseId'
    AND cu.userId = '$userId'
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
            'canModifyActivitySettings' => $row['canModifyActivitySettings'],
            'canModifyCourseSettings' => $row['canModifyCourseSettings'],
            'canViewUsers' => $row['canViewUsers'],
            'canManageUsers' => $row['canManageUsers'],
            'isAdmin' => $row['isAdmin'],
            'dataAccessPermisson' => $row['dataAccessPermisson'],
            'isOwner' => $row['isOwner'],
        ];
    } else {
        return false;
    }

    return $permissionsAndSettings;
}

?>
