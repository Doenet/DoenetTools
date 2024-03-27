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
$dueDateInfo = [];

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);
$searchUserId = mysqli_real_escape_string($conn, $_REQUEST['userId']);

if (!isset($_REQUEST['courseId'])) {
    $success = false;
    $message = 'Request error, missing courseId';
} elseif ($doenetId == '') {
    $success = false;
    $message = 'Internal Error: missing doenetId';
} elseif ($searchUserId == '') {
    $success = false;
    $message = 'Internal Error: missing searchUserId';
}

//Check permissions
if ($success) {
    $courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);

    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $requestorUserId,
        $courseId
    );
    //TODO: WHAT is the correct permissions??
    if ($requestorPermissions['canViewAndModifyGrades'] != '1') {
        $success = false;
        $message = 'You are not authorized to view or modify grade data';
    }
}

// check to make sure assignment exists
// if ($success){
//     $sql = "
//         SELECT doenetId
//         FROM assignment
//         WHERE assignment.doenetId = '$doenetId'
//     ";
//     $result = $conn->query($sql);
//     if ($result->num_rows == 0){
//         $success = FALSE;
//         $message = 'No assignment matches doenetId';
//     }
// }

if ($success) {
    $result = $conn->query(
        "SELECT dueDateOverride
        FROM user_assignment
        WHERE userId = '$searchUserId'
        AND doenetId = '$doenetId'"
    );
    $dueDateInfo['dueDateOverride'] = null;
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $dueDateInfo['dueDateOverride'] = $row['dueDateOverride'];
    }

    $result = $conn->query(
        "SELECT dueDate
        FROM assignment
        WHERE doenetId = '$doenetId'"
    );
    $dueDateInfo['dueDate'] = null;
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $dueDateInfo['dueDate'] = $row['dueDate'];
    }
}

$response_arr = [
    'success' => $success,
    'dueDateInfo' => $dueDateInfo,
    'message' => $message,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
