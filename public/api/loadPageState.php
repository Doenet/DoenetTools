<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
//header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$requestorUserId = $jwtArray['userId'];
$examUserId = $jwtArray['examineeUserId'];
$examDoenetId = $jwtArray['doenetId'];

// $device = $jwtArray['deviceName'];

$cid = mysqli_real_escape_string($conn, $_REQUEST['cid']);
$pageNumber = mysqli_real_escape_string($conn, $_REQUEST['pageNumber']);
$attemptNumber = mysqli_real_escape_string($conn, $_REQUEST['attemptNumber']);
$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);
$requestedVariantIndex = mysqli_real_escape_string(
    $conn,
    $_REQUEST['requestedVariantIndex']
);
$allowLoadState = mysqli_real_escape_string($conn, $_REQUEST['allowLoadState']);
$showCorrectness = mysqli_real_escape_string($conn, $_REQUEST['showCorrectness']);
$solutionDisplayMode = mysqli_real_escape_string($conn, $_REQUEST['solutionDisplayMode']);
$showFeedback = mysqli_real_escape_string($conn, $_REQUEST['showFeedback']);
$showHints = mysqli_real_escape_string($conn, $_REQUEST['showHints']);
$autoSubmit = mysqli_real_escape_string($conn, $_REQUEST['autoSubmit']);

if ($showFeedback == "true"){ $showFeedback = '1'; } else { $showFeedback = '0'; }
if ($showHints == "true"){ $showHints = '1'; } else { $showHints = '0'; }
if ($autoSubmit == "true"){ $autoSubmit = '1'; } else { $autoSubmit = '0'; }
if ($showCorrectness == "true"){ $showCorrectness = '1'; } else { $showCorrectness = '0'; }

$effectiveUserId = $requestorUserId;

$paramUserId = mysqli_real_escape_string($conn, $_REQUEST['userId']);

$success = true;
$message = '';
if ($cid == '') {
    $success = false;
    $message = 'Internal Error: missing cid';
} elseif ($pageNumber == '') {
    $success = false;
    $message = 'Internal Error: missing pageNumber';
} elseif ($attemptNumber == '') {
    $success = false;
    $message = 'Internal Error: missing attemptNumber';
} elseif ($doenetId == '') {
    $success = false;
    $message = 'Internal Error: missing doenetId';
} elseif ($requestedVariantIndex == '') {
    $success = false;
    $message = 'Internal Error: missing requestedVariantIndex';
} elseif ($allowLoadState == '') {
    $success = false;
    $message = 'Internal Error: missing allowLoadState';
} elseif ($solutionDisplayMode == '') {
    $success = false;
    $message = 'Internal Error: missing solutionDisplayMode';
} elseif ($effectiveUserId == '') {
    if ($examUserId == '') {
        $success = false;
        $message = 'No access - Need to sign in';
    } elseif ($examDoenetId != $doenetId) {
        $success = false;
        $message = "No access for doenetId: $doenetId";
    } else {
        $effectiveUserId = $examUserId;
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

//Check permissions for using a paramUserId
if ($success && $paramUserId != '' && $paramUserId != $effectiveUserId) {
    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $requestorUserId,
        $courseId
    );

    if ($requestorPermissions['canViewAndModifyGrades'] == '1') {
        $effectiveUserId = $paramUserId;
    } else {
        $success = false;
        $message = 'You are only allowed to view your own data';
    }
}

if ($success) {
    $loadedState = false;

    if ($allowLoadState == 'true') {
        $result = $conn->query(
            "SELECT 
                saveId, 
                coreInfo, 
                coreState, 
                rendererState
            FROM page_state
            WHERE userId = '$effectiveUserId'
                AND doenetId = '$doenetId'
                AND cid = '$cid'
                AND pageNumber='$pageNumber'
                AND attemptNumber='$attemptNumber'"
        );

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $coreState = $row['coreState'];
            $rendererState = $row['rendererState'];
            $coreInfo = $row['coreInfo'];
            $saveId = $row['saveId'];
            $loadedState = true;

            // TODO: check if instructor changed cid
        }
    }

    if ($success && !$loadedState) {
        // no saved page state (or flag set to now allow loading page state),
        // look up initial renderer state

        $result = $conn->query(
            "SELECT rendererState, coreInfo
            FROM initial_renderer_state
            WHERE cid = '$cid'
            AND variantIndex = '$requestedVariantIndex'
            AND showCorrectness = '$showCorrectness'
            AND solutionDisplayMode = '$solutionDisplayMode'
            AND showFeedback = '$showFeedback'
            AND showHints = '$showHints'
            AND autoSubmit = '$autoSubmit'
            "
        );

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $coreState = null;
            $rendererState = $row['rendererState'];
            $coreInfo = $row['coreInfo'];
            $loadedState = true;
        } else {
            // value missing from initial_renderer_state
            // will need to initialize core to determine rendererState
            $coreState = null;
            $rendererState = null;
            $coreInfo = null;
        }
    }
}

$response_arr = [
    'success' => $success,
    'loadedState' => $loadedState,
    'coreState' => $coreState,
    'rendererState' => $rendererState,
    'coreInfo' => $coreInfo,
    'saveId' => $saveId,
    'message' => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
