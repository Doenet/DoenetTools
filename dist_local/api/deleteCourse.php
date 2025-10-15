<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];
$success = true;

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (!array_key_exists('courseId', $_POST)) {
    $success = false;
    $message = 'Request error, missing courseId';
}

if ($success) {
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);

    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );

    if ($requestorPermissions['isOwner'] != '1') {
        $success = false;
        $message = 'You are not authoried to delete this course';
    }
}

if ($success) {
    $result = $conn->query(
        "UPDATE course 
        SET isDeleted = TRUE
        WHERE courseId ='$courseId'"
    );

    if ($result == false) {
        $success = false;
        $message = 'Internal Server Error';
    }
}

echo json_encode([
    'success' => $success,
    'message' => $message,
]);

$conn->close();
?>
