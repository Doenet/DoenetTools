<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = '';

// if ($userId == '') {
//     $success = false;
//     $message = 'Error: You need to sign in';
// }

$publicActivities = [];
$fullName = '';

$courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);

//Assume we are updating the activity and need the current settings
if ($success) {
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
        $fullName = $row['firstName'] . ' ' . $row['lastName'];
    }

    $sql = "
    SELECT cc.doenetId,
    cc.imagePath,
    cc.label,
    p.doenetId AS 'pageDoenetId'
    FROM course_content AS cc
    LEFT JOIN pages AS p
    ON p.containingDoenetId = cc.doenetId
    WHERE cc.courseId = '$courseId'
    AND cc.isPublic = '1'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $activity = [
                'doenetId' => $row['doenetId'],
                'imagePath' => $row['imagePath'],
                'label' => $row['label'],
                'pageDoenetId' => $row['pageDoenetId'],
            ];
            array_push($publicActivities, $activity);
        }
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'publicActivities' => $publicActivities,
    'fullName' => $fullName,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
