<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'lexicographicalRankingSort.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = '';

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (!array_key_exists('doenetId', $_POST)) {
    $success = false;
    $message = 'Missing doenetId';
} elseif (!array_key_exists('label', $_POST)) {
    $success = false;
    $message = 'Missing label';
} elseif (!array_key_exists('imagePath', $_POST)) {
    $success = false;
    $message = 'Missing imagePath';
} 


$portfolioCourseId = '';

$doenetId = mysqli_real_escape_string($conn, $_POST['doenetId']);
$label = mysqli_real_escape_string($conn, $_POST['label']);
$imagePath = mysqli_real_escape_string($conn, $_POST['imagePath']);
$public = mysqli_real_escape_string($conn, $_POST['public']);
$learningOutcomes = mysqli_real_escape_string(
    $conn,
    $_POST['learningOutcomes']
);

$isPublic = '0';
if ($public) {
    $isPublic = '1';
}

//TODO: Make this a handler function fail(message,code);

if (trim($label) == ''){
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => "Label can't be blank.",
    ]);

    $conn->close();
    exit();
}



$sql = "
SELECT courseId
FROM course_content
WHERE doenetId = '$doenetId'
";
$result = $conn->query($sql);

//Test if the user has permission to update
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $portfolioCourseId = $row['courseId'];
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $portfolioCourseId
    );
    if ($permissions['canEditContent'] != '1') {
        $success = false;
        $message = 'You need permission to edit content.';
    }
} else {
    $success = false;
    $message = "Error: doenetId doesn't match.";
}

if ($success) {
    $sql = "
        UPDATE course_content
        SET label = '$label', 
        imagePath = '$imagePath',
        isPublic = '$isPublic',
        learningOutcomes = '$learningOutcomes'
        WHERE doenetId = '$doenetId'
        AND courseId = '$portfolioCourseId'
        ";
    $conn->query($sql);
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'portfolioCourseId' => $portfolioCourseId,
];



// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
