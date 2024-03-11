<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'createPortfolioCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = '';

if ($userId == '') {
    $success = false;
    $message = 'Error: You need to sign in';
}

$portfolioCourseId = '';
//Test if user already has a portfolio course UserId Course
if ($success) {
    //Test if the user has a portfolio course
    //If they don't then make one.
    $sql = "
    SELECT courseId 
    FROM course 
    WHERE portfolioCourseForUserId = '$userId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $portfolioCourseId = $row['courseId'];
    } else {
        //Make the portfolio course as the user doesn't have one
        $portfolioCourseId = createPortfolioCourseFunction($conn,$userId);
    }
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
