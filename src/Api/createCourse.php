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
    $defaultRoleId = include 'randomId.php'; //student
    $ownerRoleId = include 'randomId.php';
    $designerRoleId = include 'randomId.php';
    $instructorRoleId = include 'randomId.php';
    $authorRoleId = include 'randomId.php';
    $taRoleId = include 'randomId.php';
    $proctorRoleId = include 'randomId.php';
    $guestInstructorRoleId = include 'randomId.php';
    $auditorRoleId = include 'randomId.php';

    //create course
    $result = $conn->query(
        "INSERT INTO course
        SET 
        courseId = '$courseId',
        image = '$course_pic',
        defaultRoleId = '$defaultRoleId'"
    );

    /** Default Roles */
    $result = $conn->query(
        //Owner
        "INSERT INTO course_role
        SET
        courseId = '$courseId',
        roleId = '$ownerRoleId',
        label = 'Owner',
        canViewContentSource = '1',
        canEditContent = '1',
        canPublishContent = '1',
        canViewUnassignedContent = '1',
        canProctor = '1',
        canViewAndModifyGrades = '1',
        canViewActivitySettings = '1',
        canModifyActivitySettings = '1',
        canModifyCourseSettings = '1',
        dataAccessPermission = 'Identified',
        canViewUsers = '1',
        canManageUsers = '1',
        isAdmin = '1',
        isOwner = '1'"
    );

    $result = $conn->query(
        //Designer
        "INSERT INTO course_role
        SET
        courseId = '$courseId',
        roleId = '$designerRoleId',
        label = 'Designer',
        canViewContentSource = '1',
        canEditContent = '1',
        canPublishContent = '1',
        canViewUnassignedContent = '1',
        canProctor = '1',
        canViewAndModifyGrades = '1',
        canViewActivitySettings = '1',
        canModifyActivitySettings = '1',
        canModifyCourseSettings = '1',
        dataAccessPermission = 'Identified',
        canViewUsers = '1',
        canManageUsers = '1',
        isAdmin = '1'"
    );

    $result = $conn->query(
        //Instructor (non-editing)
        "INSERT INTO course_role
        SET
        courseId = '$courseId',
        roleId = '$instructorRoleId',
        label = 'Instructor (non-editing)',
        canViewContentSource = '1',
        canViewUnassignedContent = '1',
        canProctor = '1',
        canViewAndModifyGrades = '1',
        canViewActivitySettings = '1',
        canModifyActivitySettings = '1',
        dataAccessPermission = 'Aggregate',
        canViewUsers = '1',
        canManageUsers = '1'"
    );

    $result = $conn->query(
        //TA
        "INSERT INTO course_role
        SET
        courseId = '$courseId',
        roleId = '$taRoleId',
        label = 'TA',
        canViewContentSource = '1',
        canViewUnassignedContent = '1',
        canProctor = '1',
        canViewAndModifyGrades = '1',
        canViewActivitySettings = '1',
        dataAccessPermission = 'Aggregate',
        canViewUsers = '1'"
    );

    $result = $conn->query(
        //Guest Instructor
        "INSERT INTO course_role
        SET
        courseId = '$courseId',
        roleId = '$guestInstructorRoleId',
        label = 'Guest Instructor',
        canViewContentSource = '1',
        canViewUnassignedContent = '1',
        canViewActivitySettings = '1'"
    );

    $result = $conn->query(
        //Author
        "INSERT INTO course_role
        SET
        courseId = '$courseId',
        roleId = '$authorRoleId',
        label = 'Author',
        canViewContentSource = '1',
        canViewUnassignedContent = '1',
        canEditContent = '1',
        canPublishContent = '1',
        dataAccessPermission = 'Aggregate'"
    );

    $result = $conn->query(
        //Proctor
        "INSERT INTO course_role
        SET
        courseId= '$courseId', 
        roleId= '$proctorRoleId', 
        label= 'Proctor', 
        canProctor = '1',
        canViewUsers = '1'"
    );

    $result = $conn->query(
        //Student
        "INSERT INTO course_role
        SET
        courseId= '$courseId', 
        roleId= '$defaultRoleId', 
        label= 'Student', 
        isIncludedInGradebook = '1'"
    );

    $result = $conn->query(
        //Auditor
        "INSERT INTO course_role
        SET
        courseId= '$courseId', 
        roleId= '$auditorRoleId', 
        label= 'Auditor'"
    );

    /** End Default Roles */

    //add requesting user as owner
    $result = $conn->query(
        "INSERT INTO course_user
      SET
      courseId ='$courseId',
      userId ='$userId',
      roleId ='$ownerRoleId'"
    );
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
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
