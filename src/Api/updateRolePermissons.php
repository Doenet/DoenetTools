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

$permissonKeys = [
    'label',
    'isIncludedInGradebook',
    'canViewUnassignedContent',
    'canViewContentSource',
    'canEditContent',
    'canPublishContent',
    'canProctor',
    'canViewAndModifyGrades',
    'canViewActivitySettings',
    'canModifyActivitySettings',
    'canModifyCourseSettings',
    'dataAccessPermisson',
    'canViewUsers',
    'canManageUsers',
    'isAdmin',
    'sectionPermissionOnly',
];

$_POST = json_decode(file_get_contents('php://input'), true);
$courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
$roleId = mysqli_real_escape_string($conn, $_POST['roleId']);
$segments = [];

if ($courseId == '') {
    $success = false;
    $message = 'Internal Error: missing courseId';
}
if ($roleId == '') {
    $roleId = include 'randomId.php';
    $message = 'Creating new role';
}
if (!array_key_exists('permissions', $_POST)) {
    $success = false;
    $message = 'Internal Error: missing permissons';
}

//Check permissions
if ($success) {
    $userPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );

    if ($requestorPermissions['isAdmin'] == '1') {
        $success = false;
        $message = 'Operation Denied: you need permission to mange users';
    }
}

//Bail on user trying to grant or remove isOwner through a role change.
if ($success && array_key_exists('isOwner', $_POST['permissions'])) {
    $success = false;
    $message = 'isOwner is only available on the owner role';
}

//Bail if role name is not unique withing the course
if ($success && array_key_exists('label', $_POST['permissions'])) {
    $newRoleLabel = mysqli_real_escape_string(
        $conn,
        $_POST['permissions']['label']
    );
    $result = $conn->query(
        "SELECT label as roleLabel
            FROM course_role
            WHERE courseId = '$courseId' AND label = '$newRoleLabel'
        "
    );
    if ($result->num_rows > 0) {
        $success = false;
        $row = $result->fetch_assoc();
        $conflictLabel = $row['label'];
        $message = "Role labels must be unique, please relable $conflictLabel first";
    } else {
        array_push($segments, "label = '$newRoleLabel'");
        unset($_POST['permissions']['label']);
    }
}

//enforce permisson pairs
if ($success) {
    // editContent > viewContentSource && viewUnassignedContent
    if (array_key_exists('canEditContent', $_POST['permissions'])) {
        $newRoleCanEditContent = mysqli_real_escape_string(
            $conn,
            $_POST['permissions']['canEditContent']
        );
        if ($newRoleCanEditContent == '1') {
            array_push($segments, "canViewContentSource = '1'");
            unset($_POST['permissions']['canViewContentSource']);
            array_push($segments, "canViewUnassignedContent = '1'");
            unset($_POST['permissions']['canViewUnassignedContent']);
        }
    }
    // modifyActivitySettings > viewActivitySettings
    if (array_key_exists('canModifyActivitySettings', $_POST['permissions'])) {
        $newRoleCanModifyActivitySettings = mysqli_real_escape_string(
            $conn,
            $_POST['permissions']['canModifyActivitySettings']
        );
        if ($newRoleCanModifyActivitySettings == '1') {
            array_push($segments, "canViewActivitySettings = '1'");
            unset($_POST['permissions']['canViewActivitySettings']);
        }
    }
    //isAdmin > manageUsers > viewUsers
    if (array_key_exists('isAdmin', $_POST['permissions'])) {
        $newRoleIsAdmin = mysqli_real_escape_string(
            $conn,
            $_POST['permissions']['isAdmin']
        );
        if ($newRoleIsAdmin == '1') {
            array_push($segments, "canManageUsers = '1'");
            unset($_POST['permissions']['canManageUsers']);
            array_push($segments, "canViewUsers = '1'");
            unset($_POST['permissions']['canViewUsers']);
        }
    } elseif (array_key_exists('canManageUsers', $_POST['permissions'])) {
        $newRoleCanManageUsers = mysqli_real_escape_string(
            $conn,
            $_POST['permissions']['canManageUsers']
        );
        if ($newRoleCanManageUsers == '1') {
            array_push($segments, "canViewUsers = '1'");
            unset($_POST['permissions']['canViewUsers']);
        }
    }
}

//Make permissons assignment
if ($success) {
    foreach ($permissonKeys as $permisson) {
        if (array_key_exists($permisson, $_POST['permissions'])) {
            $sanitizedNewValue = mysqli_real_escape_string(
                $conn,
                $_POST['permissions'][$permisson]
            );
            array_push($segments, "$permisson = '$sanitizedNewValue'");
        }
    }
    $updates = implode(',', $segments);

    $result = $conn->query(
        "INSERT INTO course_role
        SET
        courseId ='$courseId',
        roleId = '$roleId',
        $updates
        ON DUPLICATE KEY UPDATE
            $updates
        "
    );

    if ($result == false) {
        $success = false;
        $message = 'server error: invalid course or role id';
    }
}

echo json_encode([
    'success' => $success,
    'message' => $message,
]);

$conn->close();

?>
