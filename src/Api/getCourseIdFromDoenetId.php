<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';
include "getCourseItemFunction.php";

$jwtArray = include 'jwtArray.php';
$requestorUserId = $jwtArray['userId'];
$examUserId = $jwtArray['examineeUserId'];
$examDoenetId = $jwtArray['doenetId'];

$effectiveUserId = $requestorUserId;

$success = true;
$message = '';

// if (array_key_exists('driveId', get_defined_vars())) {
$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

if ($doenetId == '') {
    $success = false;
    $message = 'Internal Error: missing doenetId';
}elseif ($effectiveUserId == '') {
    if ($examUserId == '') {
        $success = false;
        $message = 'No access - Need to sign in';
    } elseif ($examDoenetId != $doenetId) {
        $success = false;
        $message = "No access for doenetId: $doenetId";
    } else {
        $effectiveUserId = $examUserId;
    }
}

if ($success) {
    $sql = "
SELECT courseId
FROM course_content
WHERE doenetId='$doenetId'
";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $courseId = $row['courseId'];
    } else {
        $sql = "
        SELECT courseId
        FROM link_pages
        WHERE doenetId='$doenetId'
        ";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $courseId = $row['courseId'];
            }else{
                $success = false;
                $message = 'Content not found or no permission to view content';
            }
    }
}

if ($success) {
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $effectiveUserId,
        $courseId
    );

    if ($permissions == false) {
        $course = null;
        $success = false;
        $message = 'Content not found or no permission to view content';
    }

    // if there isn't a requestorUserId, then user is not logged in
    // so they are taking an exam.
    // Request information about that exam.
    if($requestorUserId =='') {
        $item = getCourseItemFunction($conn,"activity",$doenetId);
    }
}


$response_arr = [
    'success' => $success,
    'message' => $message,
    'courseId' => $courseId,
    'item' => $item,
];

http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
