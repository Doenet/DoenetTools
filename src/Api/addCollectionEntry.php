<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;

//TODO: verify should be a util method
if (!array_key_exists('entryId', $_POST)) {
    $success = false;
    $message = 'Missing entryId';
} elseif (!array_key_exists('variant', $_POST)) {
    $success = false;
    $message = 'Missing variant';
} elseif (!array_key_exists('label', $_POST)) {
    $success = false;
    $message = 'Missing label';
} elseif (!array_key_exists('doenetId', $_POST)) {
    $success = false;
    $message = 'Missing doenetId';
}

if ($success) {
    $doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);
    $entryId = mysqli_real_escape_string($conn, $_REQUEST['entryId']);
    $variant = mysqli_real_escape_string($conn, $_REQUEST['variant']);
    $label = mysqli_real_escape_string($conn, $_REQUEST['label']);

    //get driveId from doenetId
    //TODO: should be a sql join query with userId
    $sql = "
        SELECT driveId
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
        $sql = "
            SELECT canChangeAllDriveSettings
            FROM drive_user
            WHERE userId = '$userId'
            AND driveId = '$driveId'
        ";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $canAdd = $row['canChangeAllDriveSettings'];
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
        $sql = "
            INSERT INTO 'collection'
            (doenetId, entryId, variant, label)
            VALUES ('$doentId','$entryId','$variant','$label')
        ";
        $result = $conn->query($sql);

        http_response_code(200);
        echo json_encode(['message' => $message, 'success' => $success]);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => $message, 'success' => $success]);
}

$conn->close();

?>
