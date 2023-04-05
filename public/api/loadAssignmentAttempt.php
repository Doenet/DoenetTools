<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include_once 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$requestorUserId = $jwtArray['userId'];
$success = true;
$message = '';

if (!isset($_REQUEST['courseId'])) {
    $success = false;
    $message = 'Request error, missing courseId';
} elseif (!isset($_REQUEST['doenetId'])) {
    $success = false;
    $message = 'Request error, missing doenetId';
} elseif (!isset($_REQUEST['userId'])) {
    $success = false;
    $message = 'Request error, missing userId';
} elseif (!isset($_REQUEST['attemptNumber'])) {
    $success = false;
    $message = 'Request error, missing attemptNumber';
}

//Check permissions
if ($success) {
    $courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);

    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $requestorUserId,
        $courseId
    );

    if ($requestorPermissions['canViewAndModifyGrades'] != '1') {
        $success = false;
        $message = 'You are not authorized to view or modify grade data';
    }
}

if ($success) {
    $doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);
    $attemptNumber = mysqli_real_escape_string(
        $conn,
        $_REQUEST['attemptNumber']
    );
    $attemptTaken = false;

    $result = $conn->query(
        "SELECT *
        FROM user_assignment_attempt AS uaa
        WHERE uaa.userId = '$userId'
            AND uaa.doenetId = '$doenetId'
            AND uaa.attemptNumber = '$attemptNumber'
        "
    );

    if ($result->num_rows > 0) {
        $attemptTaken = true;
    }

    $result = $conn->query(
        "SELECT 
            ua.credit as assignmentCredit,
            ua.creditOverride as assignmentCreditOverride,
            uaa.credit as attemptCredit,
            uaa.creditOverride AS attemptCreditOverride,
            uaa.cid as cid,
            ci.stateVariables AS stateVariables,
            ci.variant AS variant,
            ci.timestamp AS timestamp,
            ci.interactionSource AS interactionSource
        FROM content_interactions AS ci
        JOIN user_assignment AS ua
            ON ua.doenetId = '$doenetId'
            AND ua.userId = '$userId'
        JOIN user_assignment_attempt AS uaa
            ON uaa.attemptNumber = '$attemptNumber'
            AND uaa.doenetId = '$doenetId'
            AND uaa.userId = '$userId'
        WHERE ci.attemptNumber = '$attemptNumber'
            AND ci.doenetId = '$doenetId'
            AND ci.userId = '$userId'
        "
    );
    $response_arr = [];

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $response_arr = [
            'assignmentAttempted' => $attemptTaken,
            'stateVariables' => $row['stateVariables'],
            'variant' => $row['variant'],
            'interactionSource' => $row['interactionSource'],
            'assignmentCredit' => $row['assignmentCredit'],
            'assignmentCreditOverride' => $row['assignmentCreditOverride'],
            'attemptCredit' => $row['attemptCredit'],
            'attemptCreditOverride' => $row['attemptCreditOverride'],
            'timestamp' => $row['timestamp'],
            'cid' => $row['cid'],
        ];
    } else {
        $success = false;
        $message = 'Database Retrieval Error: 0 or too Many Attempts Returned!';
    }
}

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode([
    'success' => $success,
    'message' => $message,
    'attemptData' => $response_arr,
]);

$conn->close();
?>
