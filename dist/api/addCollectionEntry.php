<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

//TODO: verify should be a util method
if (!array_key_exists('entryId', $_POST)) {
    $success = false;
    $message = 'Missing entryId';
} elseif (!array_key_exists('entryDoenetId', $_POST)) {
    $success = false;
    $message = 'Missing entryDoenetId';
} elseif (!array_key_exists('entryVariant', $_POST)) {
    $success = false;
    $message = 'Missing entryVariant';
} elseif (!array_key_exists('doenetId', $_POST)) {
    $success = false;
    $message = 'Missing doenetId';
}

if ($success) {
    $doenetId = mysqli_real_escape_string($conn, $_POST['doenetId']);
    $entryId = mysqli_real_escape_string($conn, $_POST['entryId']);
    $entryDoenetId = mysqli_real_escape_string($conn, $_POST['entryDoenetId']);
    $entryVariant = mysqli_real_escape_string($conn, $_POST['entryVariant']);

    //get driveId from doenetId
    //TODO: should be a sql join query with userId
    $sql = "SELECT driveId
    FROM `drive_content`
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
            $canAdd = $row['canEditContent'];
            if (!$canAdd) {
                http_response_code(403); //User if forbidden from operation
                $success = false;
                $message = 'No permission to add';
            }
        } else {
            //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
            http_response_code(401); //User has bad auth
            $success = false;
            $message = 'Database rejected update';
        }
    } else {
        //bad doenetId
        http_response_code(400);
        $success = false;
        $message = 'Bad doenetId'; //TODO: is this ok to say??
        echo json_encode(['message' => $message, 'success' => $success]);
    }

    if ($success) {
        //retrive cid from content table
        $sql = "SELECT cid
        FROM content
        WHERE doenetId = '$entryDoenetId'
        AND isReleased = '1'
        ";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $entryContentId = $row['cid'];

            $sql = "INSERT INTO collection
            (doenetId, entryId, entryDoenetId, entryContentId, entryVariant)
            VALUES ('$doenetId', '$entryId', '$entryDoenetId', '$entryContentId', '$entryVariant')
            ";

            $result = $conn->query($sql);
            http_response_code(201);
            echo json_encode(['message' => $message, 'success' => $success]);
        } else {
            http_response_code(404);
        }
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => $message, 'success' => $success]);
}

$conn->close();

?>
