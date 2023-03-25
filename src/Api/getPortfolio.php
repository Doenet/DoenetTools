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
$privateActivities = [];
$fullName = '';
$notMe = false;

if ($success) {
    $courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);

    $sql = "
    SELECT courseId
    FROM course
    WHERE portfolioCourseForUserId='$userId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($courseId != $row['courseId']) {
            $notMe = true;
        }
    } else {
        $notMe = true; //If not signed it then it's definitly not you
    }
}

if ($success && !$notMe) {
    $sql = "
    SELECT firstName,
    lastName
    FROM user
    WHERE userId='$userId'
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
    cc.isPublic,
    p.doenetId AS 'pageDoenetId'
    FROM course_content AS cc
    LEFT JOIN pages AS p
    ON p.containingDoenetId = cc.doenetId
    WHERE cc.courseId = (SELECT courseId FROM course WHERE portfolioCourseForUserId = '$userId')
    AND cc.isDeleted = '0'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $activity = [
                'doenetId' => $row['doenetId'],
                'imagePath' => $row['imagePath'],
                'label' => $row['label'],
                'public' => $row['isPublic'],
                'pageDoenetId' => $row['pageDoenetId'],
            ];
            if ($row['isPublic'] == '1') {
                array_push($publicActivities, $activity);
            } else {
                array_push($privateActivities, $activity);
            }
        }
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'publicActivities' => $publicActivities,
    'privateActivities' => $privateActivities,
    'fullName' => $fullName,
    'notMe' => $notMe,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
