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
    $message = 'You need to be signed in to update a portfolio activity.';
}

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);
$isPublic = mysqli_real_escape_string($conn, $_REQUEST['isPublic']);

$courseId = '';

if ($success) {
    //What is the courseId of the doenetId
    $sql = "
    SELECT courseId 
    FROM course_content 
    WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);
    $temp = $sql;
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $courseId = $row['courseId'];
    } else {
        $success = false;
        $message = "Sorry! The activity doesn't have an associated portfolio.";
    }
}

//Test if they have the permission to update it
if ($success) {
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );
    if ($permissions['canModifyActivitySettings'] == '0') {
        $success = false;
        $message = 'You need permission to update a portfolio activity.';
    }
}

if ($success) {
    if ($isPublic){
        //Make Public
        $sql = "
        UPDATE course_content
        SET isPublic = '1',
        userCanViewSource = '1',
        addToPublicPortfolioDate = CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
        WHERE doenetId = '$doenetId'
        ";
        $conn->query($sql);
    }else{
        //Make Private
        $sql = "
        UPDATE course_content
        SET isPublic = '0',
        addToPrivatePortfolioDate = CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
        WHERE doenetId = '$doenetId'
        ";
        $conn->query($sql);
    }
    
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'temp' => $temp,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
