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
    array_key_exists('type', $_REQUEST)
) {
    $driveId = $_REQUEST['driveId']; //why is this not like the others?
    // $driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
    $label = mysqli_real_escape_string($conn, $_REQUEST['label']);
    $type = mysqli_real_escape_string($conn, $_REQUEST['type']);
    //check user has permission to edit drive
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
        if ($type == 'update drive label') {
            $sql = "
              UPDATE drive
              SET label='$label'
              WHERE driveId = '$driveId'
              ";
            $result = $conn->query($sql);
        }
        if ($type == 'delete drive') {
            //   $sql = "
            //   UPDATE drive
            //   SET isDeleted='1'
            //   WHERE driveId = '$driveId'
            //   ";
            // $result = $conn->query($sql);
            // }
            for ($k = 0; $k < count($driveId); $k++) {
                $driveData = $driveId[$k];
                $sql = "
                  UPDATE drive
                  SET isDeleted='1'
                  WHERE driveId = '$driveData'
                  ";
                $result = $conn->query($sql);
            }
        }
        //   for($k = 0; $k < count($driveId); $k++){

        //     $driveData = $driveId[$k];
        //     $sql = "
        //     UPDATE drive
        //     SET isDeleted='1'
        //     WHERE driveId = '$driveData'
        //     ";
        //     $result = $conn->query($sql);
        //   }

        // }
        //should check for db success from result object
        http_response_code(202);
    } else {
        http_response_code(403); //User if forbidden from operation
    }
} else {
    http_response_code(400);
}
$conn->close();

?>
