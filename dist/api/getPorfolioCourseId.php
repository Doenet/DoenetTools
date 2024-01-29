<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = '';

if ($userId == '') {
    $success = false;
    $message = 'Error: You need to sign in';
}

$portfolioCourseId = '';

//Assume we are updating the activity and need the current settings
if ($success) {
    $sql = "
    SELECT courseId FROM course WHERE portfolioCourseForUserId = '$userId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $portfolioCourseId = $row['courseId'];
    }
}
$firstName = "";
$lastName = "";
$email = "";

if ($success) {
    $sql = "
    SELECT firstName,
    lastName,
    email
    FROM user
    WHERE userId='$userId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $firstName = $row['firstName'];
        $lastName = $row['lastName'];
        $email = $row['email'];
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'portfolioCourseId' => $portfolioCourseId,
    'firstName' => $firstName,
    'lastName' => $lastName,
    'email' => $email,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
