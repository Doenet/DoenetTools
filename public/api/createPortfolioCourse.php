<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = '';

if ($userId == '') {
    $success = false;
    $message = 'Error: You need to sign in';
}

$portfolioCourseId = '';
//Test if user already has a portfolio course UserId Course
if ($success) {
    //Test if the user has a portfolio course
    //If they don't then make one.
    $sql = "
    SELECT courseId 
    FROM course 
    WHERE portfolioCourseForUserId = '$userId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $portfolioCourseId = $row['courseId'];
    } else {
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
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'portfolioCourseId' => $portfolioCourseId,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
