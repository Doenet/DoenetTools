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
$message = '';

if ($userId == '') {
    $success = false;
    $message = 'You need to be signed in to delete a portfolio activity.';
}

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

$courseId = '';

if ($success) {
    //What is the courseId of the doenetId
    $sql = "
    SELECT courseId 
    FROM course_content 
    WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $courseId = $row['courseId'];
    } else {
        $success = false;
        $message = "Sorry! The activity doesn't have an associated portfolio.";
    }
}

//Test if they have the permission to delete it
if ($success) {
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );
    if ($permissions['canModifyActivitySettings'] == '0') {
        $success = false;
        $message = 'You need permission to delete a portfolio activity.';
    }
}
if ($success) {
    $sql = "
        UPDATE course_content
        SET isDeleted = '1'
        WHERE doenetId = '$doenetId'
        ";
    $conn->query($sql);
    $sql = "
        UPDATE pages
        SET isDeleted = '1'
        WHERE containingDoenetId = '$doenetId'
        ";
    $conn->query($sql);
}

$response_arr = [
    'success' => $success,
    'message' => $message,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
