<?php

function createPortfolioCourseFunction($conn,$userId){
        //Make the portfolio course as the user doesn't have one
        $portfolioCourseId = include 'randomId.php';
        $defaultRoleId = include 'randomId.php';

        $sql = "
        INSERT INTO course 
        (courseId,label,isPublic,defaultRoleId,portfolioCourseForUserId)
        VALUES
        ('$portfolioCourseId','Portfolio Course',1,'$defaultRoleId','$userId')
        ";
        $conn->query($sql);

        $sql = "
        INSERT INTO course_role 
        (courseId,roleId,label,isIncludedInGradebook,canViewCourse,canViewUnassignedContent,
        canViewContentSource,canEditContent,canPublishContent,canProctor,canViewAndModifyGrades,
        canViewActivitySettings,canModifyActivitySettings,canModifyCourseSettings,canViewUsers,
        canManageUsers,isAdmin,isOwner)
        VALUES
        ('$portfolioCourseId','$defaultRoleId','Owner',0,1,1,1,1,1,1,1,1,1,1,1,1,1,1)
        ";
        $conn->query($sql);

        $sql = "
        INSERT INTO course_user 
        (courseId,userId,dateEnrolled,roleId)
        VALUES
        ('$portfolioCourseId','$userId',NOW(),'$defaultRoleId')
        ";
        $conn->query($sql);

        return $portfolioCourseId;
    }


?>
