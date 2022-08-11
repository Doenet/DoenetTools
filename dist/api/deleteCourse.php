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

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (array_key_exists('courseId', $_POST)) {
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
    $permissons = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );
    $allowed = $permissons['isOwner']; //TODO Emilio deal with undefined (for a 401?)

    if ($allowed) {
        $sql = "UPDATE course 
            SET isDeleted = TRUE
            WHERE courseId ='$courseId'
        ";
        $result = $conn->query($sql);
        //TODO: should check for db success from result object
        http_response_code(202);
    } else {
        http_response_code(403); //User if forbidden from operation
    }
} else {
    http_response_code(400); //post missing data
}

$conn->close();
?>
