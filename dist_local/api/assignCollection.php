<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (!array_key_exists('doenetId', $_POST)) {
    http_response_code(400);
    echo json_encode('Missing doenetId');
} elseif (!array_key_exists('groups', $_POST)) {
    http_response_code(400);
    echo json_encode('Missing groups');
} elseif (!array_key_exists('entries', $_POST)) {
    http_response_code(400);
    echo json_encode('Missing entries');
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
        $sql = "SELECT canChangeAllDriveSettings
        FROM drive_user
        WHERE userId = '$userId'
        AND driveId = '$driveId'
        ";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $allowed = $row['canChangeAllDriveSettings'];
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
    $groups = json_decode($_POST['groups']);
    $entries = json_decode($_POST['entries']);
    $numEntries = count($entries);

    $sql = "UPDATE drive_content
    SET isReleased = 1
    WHERE doenetId = '$doenetId'
    ";

    $result = $conn->query($sql);

    foreach ($groups as $key => &$group) {
        foreach ($group as &$studentEmail) {
            //TODO: make this a single DB interaction
            $sql = "SELECT userId
            FROM enrollment
            WHERE email = '$studentEmail'
            AND driveId = '$driveId'
            ";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $studentsUserId = $row['userId'];
                $entry = $entries[$key % $numEntries];
                $sql = "SELECT doenetId
                FROM user_assignment
                WHERE userId = '$studentsUserId'
                AND doenetId = '$entry->doenetId'
                AND cid = '$entry->entryContentId'
                ";
                $result = $conn->query($sql);

                if ($result->num_rows < 1) {
                    $sql = "INSERT INTO user_assignment
                    (doenetId,cid,userId)
                    VALUES
                    ('$entry->doenetId','$entry->entryContentId','$studentsUserId')
                    ";

                    $result = $conn->query($sql);
                }
                $sql = "SELECT cid
                FROM user_assignment_attempt
                WHERE userId = '$studentsUserId'
                AND doenetId = '$entry->doenetId'
                AND attemptNumber = '1'
                ";
                $result = $conn->query($sql);
                $row = $result->fetch_assoc();
                $db_contentId = $row['cid'];

                $sql = "SELECT began
                FROM user_assignment_attempt
                WHERE userId = '$studentsUserId'
                AND doenetId = '$entry->doenetId'
                AND cid = '$entry->entryContentId'
                AND attemptNumber = '$attemptNumber'
                ";
                $result = $conn->query($sql);

                if ($result->num_rows < 1) {
                    $sql = "INSERT INTO user_assignment_attempt
                    (doenetId,cid,userId,attemptNumber,assignedVariant)
                    VALUES
                    ('$entry->doenetId','$entry->entryContentId','$studentsUserId','1','$entry->entryVariant')
                    ";

                    $result = $conn->query($sql);
                }
            } else {
                http_response_code(400);
                return;
            }
        }
    }
    unset($group, $student);
    http_response_code(200);
}

//     $cid = mysqli_real_escape_string($conn, $_POST['cid']);
//     $attemptNumber = mysqli_real_escape_string($conn, $_POST['attemptNumber']);
//     $requestedVariant = mysqli_real_escape_string(
//         $conn,
//         $_POST['requestedVariant']
//     );

//     if ($success) {
//     }

//     $sql = "SELECT userId
//         FROM  user_assignment_attempt_item
//         WHERE userId = '$userId'
//         AND doenetId = '$doenetId'
//         AND cid = '$cid'
//         AND attemptNumber = '$attemptNumber'
// ";

//     $result = $conn->query($sql);

//     //Only insert if not stored
//     if ($result->num_rows < 1) {
//         //Insert weights
//         for (
//             $itemNumber = 1;
//             $itemNumber < count($weights) + 1;
//             $itemNumber++
//         ) {
//             //Store Item  weights
//             $weight = $weights[$itemNumber - 1];
//             $itemVariant = $itemVariants[$itemNumber - 1];
//             if ($itemVariant == 'null') {
//                 $itemVariant = ''; //TODO: Make Null work
//             }

//             $sql = "INSERT INTO user_assignment_attempt_item
//     (userId,doenetId,cid,attemptNumber,itemNumber,weight,generatedVariant)
//     values
//     ('$userId','$doenetId','$cid','$attemptNumber','$itemNumber','$weight','$itemVariant')
//     ";
//             $result = $conn->query($sql);
//         }
//     }
// }

$conn->close();
?>
