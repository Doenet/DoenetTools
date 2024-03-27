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

if (array_key_exists('entryId', $_POST)) {
    $entryId = mysqli_real_escape_string($conn, $_POST['entryId']);

    //get doenetId from entryId
    $sql = "
        SELECT doenetId
        FROM collection
        WHERE entryId = '$entryId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $doenetId = $row['doenetId'];
    }
} else {
    http_response_code(400);
    echo json_encode([
        'message' => 'Missing entryId',
        'success' => false,
    ]);
}

if (array_key_exists('doenetId', get_defined_vars())) {
    //get driveId from doenetId
    //TODO: should be a sql join query with userId
    $sql = "
        SELECT driveId
        FROM drive_content
        WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $driveId = $row['driveId'];
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'entryId Invalid', 'success' => false]);
}

if (array_key_exists('driveId', get_defined_vars())) {
    //check user has permission to edit drive
    $sql = "
        SELECT canEditContent
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
            echo json_encode([
                'message' => 'No permission to add',
                'success' => false,
            ]);
        }
    } else {
        //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
        http_response_code(401); //User has bad auth
        echo json_encode([
            'message' => 'Database rejected update',
            'success' => false,
        ]);
    }
} else {
    //bad doenetId
    http_response_code(400);
    echo json_encode(['message' => 'Bad doenetId', 'success' => false]); //TODO: is this ok to say??
}

if ($allowed) {
    $sql = "
    DELETE FROM collection
    WHERE entryId = '$entryId'
    ";
    $result = $conn->query($sql);

    http_response_code(200);
    echo json_encode(['message' => $message, 'success' => true]);
}

$conn->close();

?>
