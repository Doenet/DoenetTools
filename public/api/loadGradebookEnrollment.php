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
$allUsers = true;
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
        $userId,
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
    //TODO: remove e.withdrew to control it in js
    if ($allUsers) {
        $result = $conn->query(
            "SELECT 
                u.userId, 
                u.firstName, 
                u.lastName, 
                cu.courseCredit, 
                cu.courseGrade, 
                cu.overrideCourseGrade
            FROM course_user AS cu
            LEFT JOIN user AS u
                ON cu.userId = u.userId
            LEFT JOIN course_role AS cr
                ON cu.roleId = cr.roleId
            WHERE cu.courseId = '$courseId'
                AND cu.withdrew = '0'
                AND cr.isIncludedInGradebook = '1'
            ORDER BY u.lastName"
        );
    } else {
        $result = $conn->query(
            "SELECT 
                u.userId, 
                u.firstName, 
                u.lastName, 
                cu.courseCredit, 
                cu.courseGrade, 
                cu.overrideCourseGrade
            FROM course_user AS cu
            LEFT JOIN user AS u
                ON cu.userId = u.userId
            WHERE cu.courseId = '$courseId'
                AND u.userId = '$userId'
            ORDER BY u.lastName"
        );
    }

    $response_arr = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($response_arr, [
                $row['userId'],
                $row['firstName'],
                $row['lastName'],
                $row['courseCredit'],
                $row['courseGrade'],
                $row['overrideCourseGrade'],
            ]);
        }
    } elseif ($result == false) {
        $success = false;
        $message = 'Internal server error while loading gradebook enrollment';
    } else {
        $success = true;
        $message = "No users found to be included in the gradebook for course: '$courseId'";
    }
}

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode([
    'success' => $success,
    'message' => $message,
    'gradebookEnrollment' => $response_arr,
]);

$conn->close();
?>
