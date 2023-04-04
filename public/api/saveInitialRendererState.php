<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];

$_POST = json_decode(file_get_contents("php://input"), true);
$doenetId = mysqli_real_escape_string($conn, $_POST["doenetId"]);
$cid = mysqli_real_escape_string($conn, $_POST["cid"]);
$coreInfo = mysqli_real_escape_string($conn, $_POST["coreInfo"]);
$rendererState = mysqli_real_escape_string($conn, $_POST["rendererState"]);
$variantIndex = mysqli_real_escape_string($conn, $_POST["variantIndex"]);
$showCorrectness = mysqli_real_escape_string($conn, $_POST['showCorrectness']);
$solutionDisplayMode = mysqli_real_escape_string($conn, $_POST['solutionDisplayMode']);
$showFeedback = mysqli_real_escape_string($conn, $_POST['showFeedback']);
$showHints = mysqli_real_escape_string($conn, $_POST['showHints']);
$autoSubmit = mysqli_real_escape_string($conn, $_POST['autoSubmit']);

if ($showFeedback){ $showFeedback = '1'; } else { $showFeedback = '0'; }
if ($showHints){ $showHints = '1'; } else { $showHints = '0'; }
if ($autoSubmit){ $autoSubmit = '1'; } else { $autoSubmit = '0'; }
if ($showCorrectness){ $showCorrectness = '1'; } else { $showCorrectness = '0'; }

$success = true;
$message = "";
if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($cid == "") {
    $success = false;
    $message = "Internal Error: missing cid";
} elseif ($coreInfo == "") {
    $success = false;
    $message = "Internal Error: missing coreInfo";
} elseif ($rendererState == "") {
    $success = false;
    $message = "Internal Error: missing rendererState";
} elseif ($variantIndex == "") {
    $success = false;
    $message = "Internal Error: missing variantIndex";
} elseif ($solutionDisplayMode == '') {
    $success = false;
    $message = 'Internal Error: missing solutionDisplayMode';
} elseif ($userId == "") {
    $success = false;
    $message = "No access - Need to sign in";
}

if ($success) {

    $sql = "SELECT courseId from course_content
        WHERE doenetId='$doenetId'
        ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0){
        $row = $result->fetch_assoc();
        $courseId = $row["courseId"];

        $permissions = permissionsAndSettingsForOneCourseFunction(
            $conn,
            $userId,
            $courseId
        );
        if ($permissions["canEditContent"] != "1") {
            $success = false;
            $message = "You need edit permission save initial renderer state.";
        }
    } else {
        $success = FALSE;
        $message = "Assignment not found.";
    }
}


if ($success) {
    $sql = "INSERT INTO initial_renderer_state
        (cid, variantIndex, showCorrectness, solutionDisplayMode, showFeedback, showHints, autoSubmit, rendererState, coreInfo) 
        VALUES ('$cid', '$variantIndex', '$showCorrectness', '$solutionDisplayMode', '$showFeedback', '$showHints', '$autoSubmit', '$rendererState', '$coreInfo')
        ";

    $conn->query($sql);
    if ($conn->affected_rows == -1) {
        $message = "Row already exists";
    }
}

$response_arr = [
    "success" => $success,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
