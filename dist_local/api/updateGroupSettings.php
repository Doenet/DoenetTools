<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$allowed = false;

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (!array_key_exists('doenetId', $_POST)) {
    http_response_code(400);
    echo json_encode('Missing doenetId');
} elseif (!array_key_exists('min', $_POST)) {
    http_response_code(400);
    echo json_encode('Missing min');
} elseif (!array_key_exists('max', $_POST)) {
    http_response_code(400);
    echo json_encode('Missing max');
} elseif (!array_key_exists('pref', $_POST)) {
    http_response_code(400);
    echo json_encode('Missing pref');
} elseif (!array_key_exists('preAssigned', $_POST)) {
    http_response_code(400);
    echo json_encode('Missing preAssigned');
} else {
    $doenetId = mysqli_real_escape_string($conn, $_POST['doenetId']);

    //get driveId from doenetId TODO: should be a sql join query with userId
    $sql = "SELECT driveId
    FROM drive_content
    WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $driveId = $row['driveId'];
    }

    if (array_key_exists('driveId', get_defined_vars())) {
        //check user has permission to edit drive
        $sql = "SELECT canEditContent
        FROM drive_user
        WHERE userId = '$userId'
        AND driveId = '$driveId'
        ";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $allowed = $row['canEditContent'];
            if (!$allowed) {
                http_response_code(403); //User if forbidden from operation
            }
        } else {
            //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
            http_response_code(401); //User has bad auth
        }
    } else {
        //bad doenetId
        http_response_code(400);
    }
}

if ($allowed) {
    $minStudents = mysqli_real_escape_string($conn, $_POST['min']);
    $maxStudents = mysqli_real_escape_string($conn, $_POST['max']);
    $prefStudents = mysqli_real_escape_string($conn, $_POST['pref']);
    $preAssigned = mysqli_real_escape_string($conn, $_POST['preAssigned']);

    $sql = "SELECT *
    FROM collection_groups
    WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows < 1) {
        $sql = "INSERT INTO collection_groups 
        (minStudents, maxStudents, preferredStudents, preAssigned
        VALUES ('$minStudents', '$maxStudents', '$prefStudents', '$preAssigned')
        ";
        $result = $conn->query($sql);
        http_response_code(201);
    } else {
        $sql = "UPDATE collection_groups
        SET minStudents = '$minStudents',
        maxStudents = '$maxStudents',
        preferredStudents ='$prefStudents',
        preAssigned = '$preAssigned'
        WHERE doenetId = '$doenetId'
        ";
        $result = $conn->query($sql);
        http_response_code(202);
    }
}

$conn->close();
?>
