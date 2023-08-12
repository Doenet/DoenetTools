<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'checkForCommunityAdminFunctions.php';
include "lexicographicalRankingSort.php";

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);

$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);

$response_arr;
try {
    
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
    }else {
        throw new Exception("Failed to get user information. " . $conn->error);
    }

    //Get courseId from doenetId
    $sql = "
    SELECT courseId
    FROM course_content
    WHERE doenetId='$doenetId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $courseId = $row['courseId'];
    }else {
        throw new Exception("Failed to get content. " . $conn->error);
    }


    $response_arr = [
        'success' => true,
        'message' => $message,
        'courseId' => $courseId,
        'firstName' => $firstName,
        'lastName' => $lastName,
        'email' => $email,
    ];

    // set response code - 200 OK
    http_response_code(200);

} catch (Exception $e) {
    $response_arr = [
        'success' => false,
        'message' => $e->getMessage(),
    ];
    http_response_code(400);

} finally {
    // make it json format
    echo json_encode($response_arr);
    $conn->close();
}
?>