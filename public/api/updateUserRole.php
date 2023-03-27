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
    //emails are exact match only
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

/*TEMPORARY until confirmation dialogs are designed*/
//Bail on self role change
if ($success) {
    if ($targetUserId == $userId) {
        $success = false;
        $message =
            'Changing your own role is currently disabled for accident prevention. Ask another authrized user to change your role';
    }
}
/*TEMPORARY*/

//Bail on last isOwner demote attempt or non-isOwner attemmpting to promote up
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
        $oldRoleId = $targetUserPermissions['roleId'];
        $result = $conn->query(
            "SELECT
            COUNT(cu.roleId) as ownerCount
            FROM course_user AS cu
            WHERE roleId = '$oldRoleId'"
        );

        if ($result == false) {
            $success = false;
            $message = 'Internal Server Error';
        } else {
            $row = $result->fetch_assoc();
            $ownerCount = (int) $row['ownerCount'];
            if ($ownerCount < 2) {
                $success = false;
                $message =
                    'Cannot remove the last owner, please promote another owner first';
            }
        }
    }

    if ($requestorPermissions['isOwner'] != '1' && $newRoleisOwner == '1') {
        $success = false;
        $message = 'Operation Denied: only owners can promote to owner';
    }
}

//Bail on isAdmin demote attempt or non-isAdmin attempting to promote up
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
        cr.isAdmin 
        FROM course_role AS cr
        WHERE roleId = '$roleId'"
    );

    if ($result == false) {
        $success = false;
        $message = 'server error: no such role';
    } elseif ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $newPermission = $row['isAdmin'];
    }

    if (
        // ($requestorPermissions['isOwner'] != '1' ||
        $requestorPermissions['isAdmin'] != '1' &&
        $targetUserPermissions['isAdmin'] == '1' &&
        $newPermission == '0'
    ) {
        $success = false;
        $message =
            'Operation Denied: missing permission to demote users with role modification privileges';
    }

    if ($requestorPermissions['isAdmin'] != '1' && $newPermission == '1') {
        $success = false;
        $message =
            'Operation Denied: missing permission to promote users to role modification privileges';
    }
}

//Make role assignment
if ($success) {
    $result = $conn->query(
        "UPDATE course_user
        SET
        roleId = '$roleId'
        WHERE courseId = '$courseId'
        AND userId = '$targetUserId'
        "
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
