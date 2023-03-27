<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

$success = true;
$message = '';

$sql = "
SELECT cc.label,
cc.courseId,
p.doenetId AS 'pageDoenetId'
FROM course_content AS cc
LEFT JOIN pages AS p
    ON p.containingDoenetId = cc.doenetId
WHERE cc.doenetId = '$doenetId'
AND cc.isPublic = '1'
";
$result = $conn->query($sql);
$label = '';
$courseId = '';
$pageDoenetId = '';

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $label = $row['label'];
    $courseId = $row['courseId'];
    $pageDoenetId = $row['pageDoenetId'];
}

$sql = "
    SELECT u.firstName,
    u.lastName
    FROM user AS u
    LEFT JOIN course AS c
    ON u.userId = c.portfolioCourseForUserId
    WHERE c.courseId = '$courseId'
    ";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $firstName = $row['firstName'];
    $lastName = $row['lastName'];
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'label' => $label,
    'firstName' => $firstName,
    'lastName' => $lastName,
    'courseId' => $courseId,
    'pageDoenetId' => $pageDoenetId,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
