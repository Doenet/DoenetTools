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
    $defaultRoleId = include 'randomId.php';
    $ownerRoleId = include 'randomId.php';

    $sql = "INSERT INTO course
      SET 
      courseId = '$courseId',
      image = '$course_pic',
      defaultRoleId = '$defaultRoleId'
      ";

    $result = $conn->query($sql);

    $sql = "INSERT INTO course_role
      SET
      courseId = '$courseId',
      roleId = '$ownerRoleId',
      label = 'Owner',
      isIncludedInGradebook = '0',
      canViewContentSource = '1',
      canEditContent = '1',
      canPublishContent = '1',
      canViewUnassignedContent = '1',
      canProctor = '1',
      canViewAndModifyGrades = '1',
      canViewActivitySettings = '1',
      canModifyActivitySettings = '1',
      canModifyCourseSettings = '1',
      dataAccessPermisson = 'Identified',
      canViewUsers = '1',
      canManageUsers = '1',
      isAdmin = '1',
      isOwner = '1'
      ";
    $result = $conn->query($sql);

    $sql = "INSERT INTO course_role
      SET
      courseId= '$courseId', 
      roleId= '$defaultRoleId', 
      label= 'Student', 
      isIncludedInGradebook = '1'
      ";

    $result = $conn->query($sql);

    $sql = "INSERT INTO course_user
      SET
      courseId ='$courseId',
      userId ='$userId',
      roleId ='$ownerRoleId'
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
