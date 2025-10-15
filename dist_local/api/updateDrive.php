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
if (
    array_key_exists('driveId', $_REQUEST) &&
    array_key_exists('label', $_REQUEST) &&
    array_key_exists('image', $_REQUEST) &&
    array_key_exists('color', $_REQUEST) &&
    array_key_exists('type', $_REQUEST)
) {

    $driveId = mysqli_real_escape_string($conn, $_REQUEST['driveId']);
    $driveIds = $_REQUEST['driveId'];
    $label = mysqli_real_escape_string($conn, $_REQUEST['label']);
    $image = mysqli_real_escape_string($conn, $_REQUEST['image']);
    $color = mysqli_real_escape_string($conn, $_REQUEST['color']);
    $type = mysqli_real_escape_string($conn, $_REQUEST['type']);

    switch ($type) {
        case 'update drive label':
            // for ($k = 0; $k < count($driveIds); $k++) {
                // $driveId = $driveIds[$k];
                //check user has permission to delete drive
                $sql = "
              SELECT canChangeAllDriveSettings
              FROM drive_user
              WHERE userId = '$userId'
              AND driveId = '$driveId'
            ";
            echo $sql;

                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    $allowed = $row['canChangeAllDriveSettings'];
                } else {
                    //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
                    http_response_code(401); //User has bad auth
                }
                if ($allowed) {
                    $sql = "
              UPDATE drive
              SET label='$label'
              WHERE driveId = '$driveId'
            ";
                    $result = $conn->query($sql);
                } else {
                    http_response_code(403); //User if forbidden from operation
                    break;
                }
                //TODO: should check for db success from result object
                http_response_code(202);
            // }
            break;
            case 'update drive image':
                // for ($k = 0; $k < count($driveIds); $k++) {
                    // $driveId = $driveIds[$k];
                    //check user has permission to delete drive
                    $sql = "
                  SELECT canChangeAllDriveSettings
                  FROM drive_user
                  WHERE userId = '$userId'
                  AND driveId = '$driveId'
                ";
                echo $sql;
    
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();
                        $allowed = $row['canChangeAllDriveSettings'];
                    } else {
                        //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
                        http_response_code(401); //User has bad auth
                    }
                    if ($allowed) {
                        $sql = "
                  UPDATE drive
                  SET image='$image', color='$color'
                  WHERE driveId = '$driveId'
                ";
                        $result = $conn->query($sql);
                    } else {
                        http_response_code(403); //User if forbidden from operation
                        break;
                    }
                    //TODO: should check for db success from result object
                    http_response_code(202);
                // }
                break;
            case 'update drive color':
                // for ($k = 0; $k < count($driveIds); $k++) {
                    // $driveId = $driveIds[$k];
                    //check user has permission to delete drive
                    $sql = "
                    SELECT canChangeAllDriveSettings
                    FROM drive_user
                    WHERE userId = '$userId'
                    AND driveId = '$driveId'
                ";
                echo $sql;
    
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();
                        $allowed = $row['canChangeAllDriveSettings'];
                    } else {
                        //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
                        http_response_code(401); //User has bad auth
                    }
                    if ($allowed) {
                        $sql = "
                    UPDATE drive
                    SET color='$color', image='$image'
                    WHERE driveId = '$driveId'
                ";
                        $result = $conn->query($sql);
                    } else {
                        http_response_code(403); //User if forbidden from operation
                        break;
                    }
                    //TODO: should check for db success from result object
                    http_response_code(202);
                // }
                break;
        case 'delete drive':
            for ($k = 0; $k < count($driveIds); $k++) {
                $driveId = $driveIds[$k];
                //check user has permission to delete drive
                $sql = "
                  SELECT canDeleteDrive
                  FROM drive_user
                  WHERE userId = '$userId'
                  AND driveId = '$driveId'
                ";
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    $allowed = $row['canDeleteDrive'];
                } else {
                    //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
                    http_response_code(401); //User has bad auth
                }

                if ($allowed) {
                    $sql = "
                      UPDATE drive
                      SET isDeleted='1'
                      WHERE driveId = '$driveId'
                    ";
                    $result = $conn->query($sql);
                } else {
                    http_response_code(403); //User if forbidden from operation
                    break;
                }
                //TODO: should check for db success from result object
                http_response_code(202);
            }
            break;
        default:
            http_response_code(400);
    }
} else {
    http_response_code(400);
}
$conn->close();

?>
