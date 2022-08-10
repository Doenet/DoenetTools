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
    'dataAccessPermission',
    'canViewUsers',
    'canManageUsers',
    'isAdmin',
    'sectionPermissionOnly',
];

$_POST = json_decode(file_get_contents('php://input'), true);
$courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
$roleId = mysqli_real_escape_string($conn, $_POST['roleId']);
$actionType = 'update';
$segments = [];
$updatedPermissions = ['isOwner' => '0'];

if ($courseId == '') {
    $success = false;
    $message = 'Internal Error: missing courseId';
}
if ($roleId == '') {
    $roleId = include 'randomId.php';
    $message = 'Creating new role';
    $actionType = 'add';
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

//Bail on user trying to grant or remove isOwner through a role permisson update.
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
        $updatedPermissions['label'] = $newRoleLabel;

        unset($_POST['permissions']['label']);
    }
}

//enforce permisson pairs
if ($success) {
    //isAdmin grants all
    $newRoleIsAdmin = mysqli_real_escape_string(
        $conn,
        $_POST['permissions']['isAdmin']
    );
    if ($newRoleIsAdmin == '1') {
        foreach ($permissonKeys as $permisson) {
            if (
                $permisson != 'label' &&
                $permisson != 'isIncludedInGradebook' &&
                $permisson != 'dataAccessPermission'
            ) {
                array_push($segments, "$permisson = '1'");
                $updatedPermissions[$permisson] = '1';
                unset($_POST['permissions'][$permisson]);
            }
        }
        array_push($segments, "dataAccessPermission = 'Identified'");
        $updatedPermissions['dataAccessPermission'] = 'Identified';
        unset($_POST['permissions']['dataAccessPermission']);
    } else {
        // editContent > viewContentSource && viewUnassignedContent
        if (array_key_exists('canEditContent', $_POST['permissions'])) {
            $newRoleCanEditContent = mysqli_real_escape_string(
                $conn,
                $_POST['permissions']['canEditContent']
            );
            if ($newRoleCanEditContent == '1') {
                array_push($segments, "canViewContentSource = '1'");
                $updatedPermissions['canViewContentSource'] = '1';
                unset($_POST['permissions']['canViewContentSource']);
                array_push($segments, "canViewUnassignedContent = '1'");
                $updatedPermissions['canViewUnassignedContent'] = '1';
                unset($_POST['permissions']['canViewUnassignedContent']);
            }
        }
        // modifyActivitySettings > viewActivitySettings
        if (
            array_key_exists('canModifyActivitySettings', $_POST['permissions'])
        ) {
            $newRoleCanModifyActivitySettings = mysqli_real_escape_string(
                $conn,
                $_POST['permissions']['canModifyActivitySettings']
            );
            if ($newRoleCanModifyActivitySettings == '1') {
                array_push($segments, "canViewActivitySettings = '1'");
                $updatedPermissions['canViewActivitySettings'] = '1';

                unset($_POST['permissions']['canViewActivitySettings']);
            }
        }
        //canManageUsers > canViewUsers
        if (array_key_exists('canManageUsers', $_POST['permissions'])) {
            $newRoleCanManageUsers = mysqli_real_escape_string(
                $conn,
                $_POST['permissions']['canManageUsers']
            );
            if ($newRoleCanManageUsers == '1') {
                array_push($segments, "canViewUsers = '1'");
                $updatedPermissions['canViewUsers'] = '1';
                unset($_POST['permissions']['canViewUsers']);
            }
        }
    }
}

//Make permissons assignment
if ($success) {
    $isDeleted = mysqli_real_escape_string(
        $conn,
        $_POST['permissions']['isDeleted']
    );
    if ($isDeleted == '1') {
        $actionType = 'delete';
        $result = $conn->query(
            "DELETE FROM course_role
            WHERE
            courseId ='$courseId'
            AND
            roleId = '$roleId'"
        );
        if ($result == false) {
            $success = false;
            $message =
                'Please remove all people from this role before deleting';
        }
    } else {
        foreach ($permissonKeys as $permisson) {
            if (array_key_exists($permisson, $_POST['permissions'])) {
                $sanitizedNewValue = mysqli_real_escape_string(
                    $conn,
                    $_POST['permissions'][$permisson]
                );
                array_push($segments, "$permisson = '$sanitizedNewValue'");
                $updatedPermissions[$permisson] = "'$sanitizedNewValue'";
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
            $message = 'Internal Server Error';
        }
    }
}

echo json_encode([
    'success' => $success,
    'message' => $message,
    'roleId' => $roleId,
    'actionType' => $actionType,
    'updatedPermissions' => $updatedPermissions,
]);

$conn->close();

?>
