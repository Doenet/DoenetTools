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

$success = true;
$foundAttempt = false;
$message = '';

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);
$studentUserId = mysqli_real_escape_string($conn, $_REQUEST['userId']);

if (!isset($_REQUEST['courseId'])) {
    $success = false;
    $message = 'Request error, missing courseId';
} elseif (!isset($_GET['doenetId'])) {
    $success = false;
    $message = 'Request error, missing doenetId';
}

//If javascript didn't send a userId use the signed in $requestorUserId
if ($studentUserId == '') {
    $studentUserId = $requestorUserId;
}

//Permisson check to view others grades
if ($success && $studentUserId != $requestorUserId) {
    $courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);

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
    // check if can show solution in gradebook
    $result = $conn->query(
        "SELECT showSolutionInGradebook, paginate
		FROM assignment
		WHERE doenetId = '$doenetId'"
    );
    $row = $result->fetch_assoc();
    $showSolutionInGradebook = $row['showSolutionInGradebook'];
    $paginate = $row['paginate'];

    $result = $conn->query(
        "SELECT 
			cid,
			variantIndex,
			attemptNumber
		FROM activity_state
		WHERE userId = '$studentUserId'
		AND doenetId = '$doenetId'
		ORDER BY attemptNumber ASC"
    );
    $attemptInfo = [];
    if ($result->num_rows > 0) {
        $foundAttempt = true;

        while ($row = $result->fetch_assoc()) {
            array_push($attemptInfo, [
                'attemptNumber' => $row['attemptNumber'],
                'cid' => $row['cid'],
                'variant' => $row['variantIndex'],
            ]);
        }
    }
}

http_response_code(200);

// make it json format
echo json_encode([
    'success' => $success,
    'message' => $message,
    'foundAttempt' => $foundAttempt,
    'attemptInfo' => $attemptInfo,
    'showSolutionInGradebook' => $showSolutionInGradebook,
    'paginate' => $paginate,
]);

$conn->close();
?>
