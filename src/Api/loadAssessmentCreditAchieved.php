<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$requestorUserId = $jwtArray['userId'];
$examUserId = array_key_exists("examineeUserId", $jwtArray)
    ? $jwtArray["examineeUserId"]
    : "";
$examDoenetId = array_key_exists("doenetId", $jwtArray)
    ? $jwtArray["doenetId"]
    : "";



$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);
$tool = mysqli_real_escape_string($conn, $_REQUEST['tool']);
$studentUserId = mysqli_real_escape_string($conn, $_REQUEST['userId']);
$attemptNumber = mysqli_real_escape_string($conn, $_REQUEST['attemptNumber']);

//If javascript didn't send a userId use the signed in $requestorUserId
if ($studentUserId == '') {
    $studentUserId = $requestorUserId;
}

$success = true;
$databaseError = false;

$message = '';
if ($doenetId == '') {
    $success = false;
    $message = 'Internal Error: missing doenetId';
} elseif ($attemptNumber == '') {
    $success = false;
    $message = 'Internal Error: missing attemptNumber';
} elseif ($tool == '') {
    $success = false;
    $message = 'Internal Error: missing tool';
} elseif ($requestorUserId == "" ) {
    if ($examUserId == "") {
        $success = false;
        $message = "No access - Need to sign in";
    } elseif ($examDoenetId != $doenetId) {
        $success = false;
        $message = "No access for doenetId: $doenetId";
    } else {
        $requestorUserId = $examUserId;
        $studentUserId = $examUserId;
    }
}



//find courseId
if ($success) {
    $result = $conn->query(
        "SELECT courseId
      FROM course_content
      WHERE doenetId='$doenetId'"
    );
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $courseId = $row['courseId'];
    } else {
        $success = false;
        $message = 'Content not found or no permission to view content';
    }
}
//We let users see their own grades
//But if it's a different student you need to
//have permission
if ($success && $studentUserId != $requestorUserId) {
    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $requestorUserId,
        $courseId
    );

    if ($requestorPermissions['canViewAndModifyGrades'] != '1') {
        $success = false;
        $message = 'You are only allowed to view your own data';
    }
}

if ($success) {
    $result = $conn->query(
        "SELECT 
        showCorrectness,
        totalPointsOrPercent
      FROM assignment
      WHERE doenetId = '$doenetId'"
    );
    $row = $result->fetch_assoc();
    $showCorrectness = $row['showCorrectness'];
    $totalPointsOrPercent = $row['totalPointsOrPercent'];

    //Override show correctness is false if we are in the gradebook
    $subTool = substr($tool, 0, 9);
    if ($showCorrectness == '1' || $subTool == 'gradebook' || $tool == 'endExam') {
        // look credit for assignment from user_asssignment

        $result = $conn->query(
            "SELECT credit
            FROM user_assignment
            WHERE userId = '$studentUserId'
              AND doenetId = '$doenetId'"
        );
        if ($result->num_rows < 1) {
            $databaseError = 1;
            $credit_for_assignment = 0;
            $success = false;
        } else {
            $row = $result->fetch_assoc();
            $credit_for_assignment = $row['credit'];
        }

        // Get credit for attempt from user_assignment_attempt
        $result = $conn->query(
            "SELECT credit
            FROM user_assignment_attempt
            WHERE userId = '$studentUserId'
              AND doenetId = '$doenetId'
              AND attemptNumber = '$attemptNumber'"
        );

        if ($result->num_rows < 1) {
            $databaseError = 2;
            $credit_for_attempt = 0;
            $success = false;
        } else {
            $row = $result->fetch_assoc();
            $credit_for_attempt = $row['credit'];
        }

        // Get credit for each item of attempt from user_assignment_attempt_item
        $result = $conn->query(
            "SELECT credit
            FROM user_assignment_attempt_item
            WHERE userId = '$studentUserId'
              AND doenetId = '$doenetId'
              AND attemptNumber = '$attemptNumber'
            ORDER BY itemNumber"
        );

        $credit_by_item = [];

        while ($row = $result->fetch_assoc()) {
            $credit_by_item[] = $row['credit'];
        }
    }
}

$response_arr = [
    'success' => $success,
    'databaseError' => $databaseError,
    'creditForAttempt' => $credit_for_attempt,
    'creditForAssignment' => $credit_for_assignment,
    'creditByItem' => $credit_by_item,
    'showCorrectness' => $showCorrectness,
    'totalPointsOrPercent' => $totalPointsOrPercent,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
