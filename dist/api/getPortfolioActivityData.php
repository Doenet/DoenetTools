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

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

$success = true;
$message = '';

if ($userId == '') {
    $success = false;
    $message = 'Error: You need to sign in';
}

$sql = "
SELECT doenetId
FROM pages
WHERE containingDoenetId = '$doenetId'
";
$result = $conn->query($sql);
$pageDoenetId = '';

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $pageDoenetId = $row['doenetId'];
}

$activityData = [
    'doenetId' => $doenetId,
    'imagePath' => '/activity_default.jpg',
    'label' => '',
    'learningOutcomes' => '',
    'public' => false, //default to private
    'isNew' => true,
    'pageDoenetId' => $pageDoenetId,
];

$courseId = '';

//What is the courseId of the doenetId
if ($success) {
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

//Test if they have the permission to edit it
if ($success) {
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );
    if ($permissions['canModifyActivitySettings'] == '0') {
        $success = false;
        $message = 'You need permission to edita a portfolio activity.';
    }
}
//Assume we are updating the activity and need the current settings
if ($success) {
    $sql = "
    SELECT imagePath,
    label,
    learningOutcomes,
    isPublic
    FROM course_content
    WHERE doenetId='$doenetId'
    AND courseId = (SELECT courseId FROM course WHERE portfolioCourseForUserId = '$userId')
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $activityData = [
            'doenetId' => $doenetId,
            'imagePath' => $row['imagePath'],
            'label' => $row['label'],
            'learningOutcomes' => $row['learningOutcomes'],
            'public' => $row['isPublic'],
            'isNew' => false,
            'pageDoenetId' => $pageDoenetId,
            'courseId' => $courseId,
        ];
    } else {
        $success = false;
        $message =
            'Error: You need to click add activity before navigating here';
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'activityData' => $activityData,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
