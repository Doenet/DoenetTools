<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$requestorUserId = $jwtArray['userId'];
$allUsers = true;
$success = true;
$message = '';

if (!isset($_REQUEST['courseId'])) {
    $success = false;
    $message = 'Request error, missing courseId';
} elseif (!isset($_GET['doenetId'])) {
    $success = false;
    $message = 'Request error, missing doenetId';
}

//Check permissions
if ($success) {
    $courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);

    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $requestorUserId,
        $courseId
    );

    if ($requestorPermissions == false) {
        $success = false;
        $message = 'You are not authorized to view or modify grade data';
    } elseif ($requestorPermissions['canViewAndModifyGrades'] != '1') {
        $allUsers = false;
        $message = 'You are only allowed to view your own data';
    }
}

if ($success) {
    $doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

    if ($allUsers) {
        $result = $conn->query(
            "SELECT 
                ua.userId as userId,
                ua.credit as assignmentCredit,
                uaa.attemptNumber as attemptNumber,
                uaa.credit as attemptCredit,
                uaa.creditOverride as creditOverride
            FROM user_assignment_attempt AS uaa
            RIGHT JOIN user_assignment AS ua
                ON ua.doenetId = uaa.doenetId 
                AND ua.userId = uaa.userId
            WHERE uaa.doenetId = '$doenetId'
                AND (cc.isGloballyAssigned = '1' OR ua.isUnassigned = '0')"
        );
    } else {
        $result = $conn->query(
            "SELECT 
                ua.userId as userId,
                ua.credit as assignmentCredit,
                uaa.attemptNumber as attemptNumber,
                uaa.credit as attemptCredit,
                uaa.creditOverride as creditOverride
            FROM user_assignment_attempt AS uaa
            RIGHT JOIN user_assignment AS ua
                ON ua.doenetId = uaa.doenetId 
                AND ua.userId = uaa.userId
            WHERE uaa.doenetId = '$doenetId'
                AND uaa.userId = '$requestorUserId'
                AND (cc.isGloballyAssigned = '1' OR ua.isUnassigned = '0')"
        );
    }

    $response_arr = [];
    if ($result->num_rows > 0) {
        $num = $result->num_rows;
        $message = "$num attempts found";
        while ($row = $result->fetch_assoc()) {
            array_push($response_arr, [
                $row['userId'],
                $row['attemptNumber'],
                $row['assignmentCredit'],
                $row['attemptCredit'],
                $row['creditOverride'],
            ]);
        }
    } else {
        $message = "No attempts found for '$doenetId'";
    }
}

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode([
    'success' => $success,
    'message' => $message,
    'assignmentAttemptsData' => $response_arr,
]);

$conn->close();
?>
