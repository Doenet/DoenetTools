<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents('php://input'), true);

$courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
// $courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);

$success = true;
$message = '';

if ($courseId == '') {
    // check for courseId
    $success = false;
    $message = 'Internal Error: missing courseId';
}

$dotwIndexes = array_map(function ($item) use ($conn) {
    return mysqli_real_escape_string($conn, $item);
}, $_POST['dotwIndexes']);
$startTimes = array_map(function ($item) use ($conn) {
    return mysqli_real_escape_string($conn, $item);
}, $_POST['startTimes']);
$endTimes = array_map(function ($item) use ($conn) {
    return mysqli_real_escape_string($conn, $item);
}, $_POST['endTimes']);

if ($success) {
    // check if allowed to edit

    $sql = "SELECT canEditContent
        FROM course_user
        WHERE userId = '$userId'
        AND courseId = '$courseId'
        ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $allowed = $row['canEditContent'];
        if (!$allowed) {
            // http_response_code(403); //User if forbidden from operation
            $success = false;
            $message = 'Not allowed';
        }
    } else {
        $success = false;
        $message = 'Not allowed';
    }
}

if ($success) {
    // delete prev classTimes
    $sql = "
    DELETE FROM class_times
    WHERE courseId='$courseId'
    ";

    $result = $conn->query($sql);

    $values = '';
    foreach ($dotwIndexes as $key => $value) {
        echo $key . ', ' . $value . "\n";
        $dotwIndex = $value;
        $startTime = $startTimes[$key];
        $endTime = $endTimes[$key];
        if ($key > 0) {
            $values = $values . ',';
        }
        $values =
            $values .
            "('$courseId','$dotwIndex','$startTime','$endTime','$key')";
    }
    var_dump($values);
    $sql = "
        INSERT INTO class_times(courseId,dotwIndex,startTime,endTime,sortOrder)
        VALUES
        $values
        ";
    $result = $conn->query($sql);
    echo $sql;
}

http_response_code(200);
echo json_encode(['message' => $message, 'success' => $success]);

$conn->close();

?>
