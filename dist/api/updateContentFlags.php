<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = '';

$_POST = json_decode(file_get_contents('php://input'), true);

$courseId = $_POST['courseId'];
$doenetId = mysqli_real_escape_string($conn, $_POST['doenetId']);
if ($courseId == '') {
    $success = false;
    $message = 'Internal Error: missing courseId';
}
if ($doenetId == '') {
    $success = false;
    $message = 'Internal Error: missing doenetId';
}

//bools only
$settingKeys = [
    'isPublic',
    'userCanViewSource',
    'isGloballyAssigned',
    // "isDeleted",
    // "isAssigned"
];

$proviedValues = [];

//protect against invalid boolean values
foreach ($settingKeys as $key) {
    if (array_key_exists($key, $_POST)) {
        if (mysqli_real_escape_string($conn, $_POST[$key])) {
            $proviedValues[$key] = '1';
        } else {
            $proviedValues[$key] = '0';
        }
    }
}
unset($key, $value);

//TODO: is this the right permission?
$permissions = permissionsAndSettingsForOneCourseFunction(
    $conn,
    $userId,
    $courseId
);
if (
    array_key_exists('isPublic', $proviedValues) &&
    $permissions['canPublishContent'] != '1'
) {
    $success = false;
    $message = 'You need permission to publish content.';
}

if (
    (array_key_exists('userCanViewSource', $proviedValues) ||
        array_key_exists('isGloballyAssigned', $proviedValues)) &&
    $permissions['canEditContent'] != '1'
) {
    $success = false;
    $message = 'You need permission to edit content.';
}

function array_map_assoc($callback, $array)
{
    $r = [];
    foreach ($array as $key => $value) {
        $r[$key] = $callback($key, $value);
    }
    return $r;
}

if ($success) {
    $updates = implode(
        ',',
        array_map_assoc(function ($key, $value) {
            if ($value == 'NULL') {
                return "$key = $value";
            } else {
                return "$key = '$value'";
            }
        }, $proviedValues)
    );

    if (count($proviedValues) > 0) {
        $sql = "UPDATE 
      `course_content` SET
      $updates
      WHERE courseId = '$courseId' AND doenetId = '$doenetId'
      ";
        $result = $conn->query($sql);

        if ($result == false) {
            $success = false;
            $message = 'Database error';
        }
    } else {
        $success = false;
        $message = 'Invalid request';
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
];

//set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
