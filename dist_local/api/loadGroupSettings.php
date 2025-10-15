<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$allowed = false;

if (array_key_exists('doenetId', $_REQUEST)) {
    $doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

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
} else {
    http_response_code(400);
}

if ($allowed) {
    $sql = "SELECT isReleased
    FROM drive_content
    WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);

    $isReleased = 0;
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $isReleased = $row['isReleased'];
    }

    $sql = "SELECT minStudents, maxStudents, preferredStudents, preAssigned
    FROM collection_groups
    WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        http_response_code(200);
        echo json_encode([
            'min' => $row['minStudents'],
            'max' => $row['maxStudents'],
            'pref' => $row['preferredStudents'],
            'preAssigned' => $row['preAssigned'],
            'isReleased' => $isReleased,
        ]);
    } else {
        $sql = "INSERT INTO collection_groups
        (doenetId, minStudents, maxStudents, preferredStudents, preAssigned)
        VALUES ('$doenetId', 1,1,1, 0)
        ";
        $result = $conn->query($sql);
        http_response_code(201);
        echo json_encode([
            'min' => 1,
            'max' => 1,
            'pref' => 1,
            'preAssigned' => 0,
            'isReleased' => $isReleased,
        ]);
    }
}

$conn->close();

?>
