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
$success = true;
$message = '';

if (!isset($_GET['courseId'])) {
    $success = false;
    $message = 'Request error, missing courseId';
}

//Permissions check
if ($success) {
    $courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);

    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $requestorUserId,
        $courseId
    );

    if ($requestorPermissions == false) {
        $success = false;
        $message = 'You are not authorized to view assignments for this course';
    }
}

if ($success) {
    $result = $conn->query(
        "SELECT a.doenetId, 
            cc.label, 
            a.gradeCategory,
            a.totalPointsOrPercent
        FROM assignment AS a
        LEFT JOIN course_content as cc
        ON a.doenetId = cc.doenetId
        WHERE a.courseId = '$courseId'
            AND cc.isAssigned = '1'
            AND cc.isDeleted = '0'
        ORDER BY a.dueDate"
    );
    $response_arr = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $doenetId = $row['doenetId'];
            $arr = [
                'label' => $row['label'],
                'category' => $row['gradeCategory'],
                'totalPointsOrPercent' => $row['totalPointsOrPercent'],
            ];
            array_push($response_arr, [$doenetId, $arr]);
        }
    } else {
        $message = 'No assignments found for this course';
    }
}

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode([
    'success' => $success,
    'message' => $message,
    'assignments' => $response_arr,
]);

$conn->close();
?>
