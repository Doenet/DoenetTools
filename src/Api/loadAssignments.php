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
    $sql_for_one_user_only = "AND ua.userId='$requestorUserId'";
    if ($requestorPermissions["canViewAndModifyGrades"] == '1'){
        $sql_for_one_user_only = '';
    }

    $result = $conn->query(
        "SELECT a.doenetId, 
            cc.label, 
            a.gradeCategory,
            a.assignedDate,
            a.totalPointsOrPercent
        FROM assignment AS a
        INNER JOIN course_content as cc
        ON a.doenetId = cc.doenetId
        LEFT JOIN user_assignment AS ua
		  ON cc.doenetId = ua.doenetId
          $sql_for_one_user_only
        WHERE a.courseId = '$courseId'
            AND cc.isAssigned = '1'
            AND cc.isDeleted = '0'
            AND (cc.isGloballyAssigned = '1' OR ua.isUnassigned = '0')
        ORDER BY a.dueDate"
    );
    $response_arr = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $doenetId = $row['doenetId'];
            $arr = [
                'label' => $row['label'],
                'category' => $row['gradeCategory'],
                'assignedDate' => $row['assignedDate'],
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
