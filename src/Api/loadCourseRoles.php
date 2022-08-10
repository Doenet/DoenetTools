<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = '';

$courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);
if ($courseId == '') {
    $success = false;
    $message = 'Internal Error: missing courseId';
}

$permissions = permissionsAndSettingsForOneCourseFunction(
    $conn,
    $userId,
    $courseId
);

if ($permissions == false) {
    $success = false;
    $message = "You need permission to view a course's roles";
}

if ($success) {
    $sql = "SELECT 
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
        cr.dataAccessPermission,
        cr.canViewUsers,
        cr.canManageUsers,
        cr.isAdmin,
        cr.isOwner
        FROM course_role AS cr
        WHERE cr.courseId = '$courseId'
        ORDER BY cr.label
    ";
    $result = $conn->query($sql);

    $roles = [];
    if ($result == false) {
        $success = false;
        $message = 'server error while retrieving roles';
    } elseif ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($roles, $row);
        }
    }
}

$response_arr = [
    'success' => $success,
    'roles' => $roles,
    'message' => $message,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
