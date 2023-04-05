<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include_once 'permissionsAndSettingsFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];
$examUserId = array_key_exists('examineeUserId', $jwtArray)
    ? $jwtArray['examineeUserId']
    : '';
$examDoenetId = array_key_exists('doenetId', $jwtArray)
    ? $jwtArray['doenetId']
    : '';

$allowed = false;
$success = true;
$response_code = 200;
$message = '';

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

if ($doenetId == '') {
    $success = false;
    $message = 'Internal Error: missing doenetId';
} elseif ($userId == '') {
    if ($examUserId == '') {
        $success = false;
        $message = 'No access - Need to sign in';
    } elseif ($examDoenetId != $doenetId) {
        $success = false;
        $message = "No access for doenetId: $doenetId";
    } else {
        $userId = $examUserId;
    }
}

if ($success) {
    //check user has permission to view
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );
    // TODO: URGENT
    // else {
    //     //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
    //     http_response_code(401); //User has bad auth
    //     echo json_encode([
    //         'message' => 'User Unauthorized',
    //     ]);
    // }
    if ($permissions == false) {
        http_response_code(403); //User if forbidden from operation
        echo json_encode([
            'message' => 'User lacks permission',
        ]);
        $success = false;
    }
}

if ($success) {
    //get driveId from doenetId
    //TODO: should be a sql join query with userId
    $sql = "SELECT courseId, parentDoenetId
       FROM course_content
       WHERE doenetId = '$doenetId'
       ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $courseId = $row['courseId'];
        $parentDoenetId = $row['parentDoenetId'];
    }
}

http_response_code($response_code);

echo json_encode([
    'success' => $success,
    'message' => $message,
    'courseid' => $courseId,
    'parentDoenetId' => $parentDoenetId,
]);

$conn->close();
?>
