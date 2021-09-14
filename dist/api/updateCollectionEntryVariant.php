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

if (
    array_key_exists('entryId', $_POST) &&
    array_key_exists('entryVariant', $_POST)
) {
    $entryId = mysqli_real_escape_string($conn, $_POST['entryId']);
    $entryVariant = mysqli_real_escape_string($conn, $_POST['entryVariant']);

    //get doenetId from entryId
    //TODO: should be a sql join query with userId
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
            } else {
                //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
                http_response_code(401); //User has bad auth
            }

            if ($allowed) {
                $sql = "
                    UPDATE collection
                    SET entryVariant = '$entryVariant'
                    WHERE entryId ='$entryId'
                ";
                $result = $conn->query($sql);
                //should check for db success from result object
                http_response_code(202);
            } else {
                http_response_code(403); //User if forbidden from operation
            }
        } else {
            //bad doenetId
            http_response_code(400);
        }
    } else {
        //bad entryId
        http_response_code(400);
    }
} else {
    //post missing data
    http_response_code(400);
}

$conn->close();

?>
