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

if ($permissions['canViewUsers'] != '1') {
    $success = false;
    $message = "You need permission to view a course's users";
}

if ($success) {
    $sql = "SELECT 
      cu.userId AS userId,
      cr.label as roleLabel,
      cr.roleId,
      u.email AS email,
      u.screenName AS screenName
      FROM course_user AS cu
      LEFT JOIN course_role AS cr
      ON cu.roleId = cr.roleId
      LEFT JOIN user AS u
      ON cu.userId = u.userId
      WHERE cu.courseId = '$courseId' 
    ";
    $result = $conn->query($sql);

    $users = [];
    if ($result == false) {
        $success = false;
        $message = 'server error while retrieving users';
    } elseif ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($users, [
                'email' => $row['email'],
                'screenName' => $row['screenName'],
                'isUser' => $row['userId'] == $userId,
                'roleLabel' => $row['roleLabel'],
                'roleId' => $row['roleId']
            ]);
        }
    }

    $sql = "SELECT 
        cr.roleId,
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
        WHERE cr.courseId = '$courseId' 
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
    'users' => $users,
    'roles' => $roles,
    'message' => $message,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
