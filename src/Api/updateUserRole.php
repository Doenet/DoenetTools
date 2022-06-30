<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$success = true;
$message = '';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents('php://input'), true);
$courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
$userEmail = mysqli_real_escape_string($conn, $_POST['userEmail']);
$roleId = mysqli_real_escape_string($conn, $_POST['roleId']);

if ($courseId == '') {
    $success = false;
    $message = 'Internal Error: missing courseId';
}
if ($userEmail == '') {
    $success = false;
    $message = 'Internal Error: missing Email';
}
if ($roleId == '') {
    $success = false;
    $message = 'Internal Error: missing roleId';
}

//Check permissions
if ($success) {
    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );

    if ($requestorPermissions['canManageUsers'] != '1') {
        $success = false;
        $message = 'Operation Denied: you need permission to mange users';
    }
}

//find targetUserId
if ($success) {
    //TODO: EMILO & KEVIN what is consider a unique email?
    //TODO: EMILIO is a userId unique per course?
    $sql = "SELECT
        u.userId
        FROM user AS u
        WHERE u.email = '$userEmail'
    ";

    $result = $conn->query($sql);
    if ($result == false) {
        $success = false;
        $message = 'server error: no such user';
    } elseif ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $targetUserId = $row['userId'];
    }
}

//Bail on isOwner demote attempt or non-isOwner attemmpting to promote up
if ($success) {
    $targetUserPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $targetUserId,
        $courseId
    );

    $result = $conn->query(
        "SELECT
        cr.isOwner 
        FROM course_role AS cr
        WHERE roleId = '$roleId'"
    );

    if ($result == false) {
        $success = false;
        $message = 'server error: no such role';
    } elseif ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $newRoleisOwner = $row['isOwner'];
    }

    if ($targetUserPermissions['isOwner'] == '1' && $newRoleisOwner != '1') {
        $success = false;
        $message = 'Operation Denied: cannot demote owners';
    }

    if ($requestorPermissions['isOwner'] != '1' && $newRoleisOwner == '1') {
        $success = false;
        $message = 'Operation Denied: only owners can promote to owner';
    }
}

//Bail on canModifyRoles demote attempt or non-canModifyRoles attempting to promote up
if ($success) {
    if (!isset($targetUserPermissions)) {
        $targetUserPermissions = permissionsAndSettingsForOneCourseFunction(
            $conn,
            $targetUserId,
            $courseId
        );
    }

    $result = $conn->query(
        "SELECT
        cr.canModifyRoles 
        FROM course_role AS cr
        WHERE roleId = '$roleId'"
    );

    if ($result == false) {
        $success = false;
        $message = 'server error: no such role';
    } elseif ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $newPermisson = $row['canModifyRoles'];
    }

    if (
        // $requestorPermissions['isOwner'] == '1' &&
        // $requestorPermissions['canModifyRoles'] == '1' &&
        $targetUserPermissions['canModifyRoles'] == '1' &&
        $newPermisson != '1'
    ) {
        $success = false;
        $message =
            'Operation Denied: missing permisson to demote users with role modification privileges';
    }

    if (
        $requestorPermissions['canModifyRoles'] != '1' &&
        $newPermisson == '1'
    ) {
        $success = false;
        $message =
            'Operation Denied: missing permisson to promote users to role modification privileges';
    }
}

//Make role assignment
if ($success) {
    $result = $conn->query(
        "UPDATE course_user
        SET
        roleId = '$roleId'"
    );

    if ($result == false) {
        $success = false;
        $message = 'server error: invalid roleId';
    }
}

echo json_encode([
    'success' => $success,
    'message' => $message,
]);

$conn->close();

?>
