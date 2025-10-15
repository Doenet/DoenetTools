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
    echo json_encode(['message' => 'Missing DoenetId']);
}

if ($allowed) {
    $sql = "SELECT doenetId, entryId, entryDoenetId, entryContentId, entryVariant
    FROM collection
    WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);

    $entry_arr = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($entry_arr, [
                'doenetId' => $row['doenetId'],
                'entryId' => $row['entryId'],
                'entryDoenetId' => $row['entryDoenetId'],
                'entryContentId' => $row['entryContentId'],
                'entryVariant' => $row['entryVariant'],
            ]);
        }

        $response_arr = [
            'success' => $success,
            'message' => $message,
            'entries' => $entry_arr,
        ];
        http_response_code(200);
        echo json_encode($response_arr);
    }
}

$conn->close();

?>
