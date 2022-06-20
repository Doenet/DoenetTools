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
    $allowed = $permissons['canModifyCourseSettings']; //TODO Emilio deal with undefined (for a 401?)

    if ($allowed) {
        //TODO: should check for db success from result object
        //TODO: join the two updates
        if (array_key_exists('image', $_POST)) {
            $image = mysqli_real_escape_string($conn, $_POST['image']);
            $sql = "UPDATE course SET image='$image' WHERE courseId ='$courseId'";
            $result = $conn->query($sql);
        }
        if (array_key_exists('color', $_POST)) {
            $color = mysqli_real_escape_string($conn, $_POST['color']);
            $sql = "UPDATE course SET color='$color' WHERE courseId ='$courseId'";
            $result = $conn->query($sql);
        }
        if (array_key_exists('label', $_POST)) {
            $label = mysqli_real_escape_string($conn, $_POST['label']);
            $sql = "UPDATE course SET label='$label' WHERE courseId ='$courseId'";
            $result = $conn->query($sql);
        }
        http_response_code(202);
    } else {
        http_response_code(403); //User if forbidden from operation
    }
} else {
    http_response_code(400); //post missing data
}

$conn->close();

?>
