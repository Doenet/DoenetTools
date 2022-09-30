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
    $courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);

    if ($allUsers) {
        $result = $conn->query(
            "SELECT 
                a.doenetId, 
                ua.credit, 
                ua.userId
            FROM assignment AS a
            JOIN user_assignment AS ua
                ON a.doenetId = ua.doenetId
            WHERE a.courseId = '$courseId'
                AND (ua.isUnassigned IS NULL OR ua.isUnassigned = '0')
            ORDER BY a.dueDate"
        );
    } else {
        $result = $conn->query(
            "SELECT 
                a.doenetId, 
                ua.credit, 
                ua.userId
            FROM assignment AS a
            JOIN user_assignment AS ua
                ON a.doenetId = ua.doenetId
            WHERE a.courseId = '$courseId'
                AND ua.userId = '$requestorUserId'
                AND (ua.isUnassigned IS NULL OR ua.isUnassigned = '0')
            ORDER BY a.dueDate"
        );
    }

    $response_arr = [];

    while ($row = $result->fetch_assoc()) {
        array_push($response_arr, [
            $row['doenetId'],
            $row['credit'],
            $row['userId'],
        ]);
    }
}
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode([
    'success' => $success,
    'message' => $message,
    'overviewData' => $response_arr,
]);
$conn->close();
?>
