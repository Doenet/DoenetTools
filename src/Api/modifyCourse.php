<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (array_key_exists('courseId', $_POST)) {
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);

    $sql = "SELECT canModifyCourseSettings 
        FROM course_user 
        WHERE courseId = '$courseId'
        AND userId = '$userId'
        LIMIT 1";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $allowed = $row['canModifyCourseSettings'];
    } else {
        //Fail because there is no DB row for the user on this course
        // so we shouldn't allow an add
        http_response_code(401); //User has bad auth
    }

    if ($allowed) {
        //TODO: should check for db success from result object
        //TODO: join the two updates
        if (array_key_exists('image', $_POST)) {
            $image = mysqli_real_escape_string($conn, $_POST['image']);
            $sql = "UPDATE course SET image='$image' WHERE courseId ='$courseId'";
            // $sql = "UPDATE course SET color='none' WHERE courseId ='$courseId'";
            $result = $conn->query($sql);
        }
        if (array_key_exists('color', $_POST)) {
            $color = mysqli_real_escape_string($conn, $_POST['color']);
            $sql = "UPDATE course SET color='$color' WHERE courseId ='$courseId'";
            // $sql = "UPDATE course SET image='none' WHERE courseId ='$courseId'";
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
