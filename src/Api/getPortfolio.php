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

if ($userId == '') {
    $success = false;
    $message = 'Error: You need to sign in';
}

$publicActivities = [];
$privateActivities = [];

//Assume we are updating the activity and need the current settings
if ($success) {
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
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
