<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = '';

if ($userId == '') {
    $success = false;
    $message = 'You need to be signed in to make a course';
}

if ($success) {
    // Random course picture
    $course_pics = include 'coursePics.php';
    $randomNumber = rand(0, count($course_pics) - 1);
    $course_pic = $course_pics[$randomNumber];

    //Random courseId
    $courseId = include 'randomId.php';
    $courseId = '_' . $courseId;

    $sql = "INSERT INTO course
      (courseId,image)
      VALUES
      ('$courseId','$course_pic')
      ";

    $result = $conn->query($sql);

    $roleId = include 'randomId.php';

    $sql = "INSERT INTO course_role
      (courseId, roleId, label, canViewCourse, isIncludedInGradebook, canViewContentSource,canEditContent,
      canPublishContent,canViewUnassignedContent,canProctor,canViewAndModifyGrades,
      canViewActivitySettings,canModifyCourseSettings,canViewUsers,canManageUsers,
      canModifyRoles,isOwner)
      VALUES
      ('$courseId','$roleId','Owner','1','0','1','1','1','1','1','1','1','1','1','1','1','1')
      ";
    $result = $conn->query($sql);

    $sql = "INSERT INTO course_user
      (courseId,userId,roleId)
      VALUES 
      ('$courseId','$userId','$roleId')
      ";

    $result = $conn->query($sql);

    $roleId = include 'randomId.php';
    $sql = "INSERT INTO course_role
      (courseId, roleId, label, canViewCourse, isIncludedInGradebook, iscanViewContentSource,canEditContent,
      canPublishContent,canViewUnassignedContent,canProctor,canViewAndModifyGrades,
      canViewActivitySettings,canModifyCourseSettings,canViewUsers,canManageUsers,
      canModifyRoles,isOwner)
      VALUES
      ('$courseId','$roleId','Student','1', '1')
      ";

    $result = $conn->query($sql);
}

$permissionsAndSettings = [];

if ($success) {
    $permissionsAndSettings = getpermissionsAndSettings($conn, $userId);
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'courseId' => $courseId,
    'permissionsAndSettings' => $permissionsAndSettings,
    'image' => $course_pic,
    'color' => 'none',
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
