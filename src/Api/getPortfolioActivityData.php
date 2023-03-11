<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

$success = true;
$message = '';

if ($userId == '') {
    $success = false;
    $message = 'Error: You need to sign in';
}

$activityData = ['imagePath' => '', 'doenetId' => $doenetId];

if ($success) {
    // $doenetId = include 'randomId.php';

    // $sql = "
    // INSERT INTO next_doenetId
    // SET userId='$userId', doenetId='$doenetId'
    // ";

    // $conn->query($sql);
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
