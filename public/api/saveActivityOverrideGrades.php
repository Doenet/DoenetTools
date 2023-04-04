<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

date_default_timezone_set('UTC');
// America/Chicago

$jwtArray = include 'jwtArray.php';
$requestorUserId = $jwtArray['userId'];

$success = true;
$message = '';

if (!isset($_GET['userId'])) {
    $success = false;
    $message = 'Internal Error: missing userId';
} elseif (!isset($_GET['score'])) {
    $success = false;
    $message = 'Internal Error: missing score';
} elseif (!isset($_GET['doenetId'])) {
    $success = false;
    $message = 'Internal Error: missing doenetId';
}

if ($success) {
    $userId = mysqli_real_escape_string($conn, $_REQUEST['userId']);
    $score = mysqli_real_escape_string($conn, $_REQUEST['score']);
    $doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

    //Look up total points for assignment
    $result = $conn->query(
        "SELECT 
      totalPointsOrPercent,
      courseId
    FROM assignment
    WHERE doenetId = '$doenetId'"
    );
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $totalPointsOrPercent = $row['totalPointsOrPercent'];
        $courseId = $row['courseId'];
    } else {
        $success = false;
        $message = "No assignment with doenetId: $doenetId";
    }
}

//Check permissions
if ($success) {
    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $requestorUserId,
        $courseId
    );

    if ($requestorPermissions == false) {
        $success = false;
        $message = 'You are not authorized to view or modify grade data';
    } elseif ($requestorPermissions['canViewAndModifyGrades'] != '1') {
        $success = false;
        $message = 'You are only allowed to view your own data';
    }
}

if ($success) {
    $creditOverride = $score / $totalPointsOrPercent;

    // if we don't have a record for this user on the user_assignment table then we need to insert not update
    $result = $conn->query(
        "SELECT creditOverride
            FROM user_assignment
            WHERE doenetId = '$doenetId'
            AND userId = '$userId'"
    );

    $need_insert = true;
    if ($result->num_rows > 0) {
        $need_insert = false;
    }

    if ($need_insert) {
        // insert creditOverride in user_assigment
        $sql = "INSERT INTO user_assignment (doenetId,userId,credit,creditOverride)
              VALUES
              ('$doenetId','$userId','$creditOverride','$creditOverride')
              ";
    } else {
        // update creditOverride in user_assigment
        $sql = "UPDATE user_assignment
              SET credit='$creditOverride', creditOverride='$creditOverride'
              WHERE userId = '$userId'
              AND doenetId = '$doenetId'
              ";
    }
    $result = $conn->query($sql);
}

$response_arr = [
    'success' => $success,
    'message' => $message,
];

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
