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
    CAST(jsonDefinition as CHAR) AS json,
    p.doenetId AS 'pageDoenetId'
    FROM course_content AS cc
    LEFT JOIN pages AS p
    ON p.containingDoenetId = cc.doenetId
    WHERE cc.courseId = (SELECT courseId FROM course WHERE portfolioCourseForUserId = '$userId')
    AND cc.isDeleted = 0
    AND cc.isPublic = 0
    ORDER BY addToPrivatePortfolioDate DESC
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $json = json_decode($row['json'], true);
            $activity = [
                'doenetId' => $row['doenetId'],
                'version' => $json['version'],
                'content' => $json['content'],
                'imagePath' => $row['imagePath'],
                'label' => $row['label'],
                'public' => $row['isPublic'],
                'pageDoenetId' => $row['pageDoenetId'],
            ];
            array_push($privateActivities, $activity);
        }
    }
    $sql = "
    SELECT cc.doenetId,
    cc.imagePath,
    cc.label,
    cc.isPublic,
    CAST(jsonDefinition as CHAR) AS json,
    p.doenetId AS 'pageDoenetId'
    FROM course_content AS cc
    LEFT JOIN pages AS p
    ON p.containingDoenetId = cc.doenetId
    WHERE cc.courseId = (SELECT courseId FROM course WHERE portfolioCourseForUserId = '$userId')
    AND cc.isDeleted = 0
    AND cc.isPublic = 1
    ORDER BY addToPublicPortfolioDate DESC
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $json = json_decode($row['json'], true);
            $activity = [
                'doenetId' => $row['doenetId'],
                'version' => $json['version'],
                'content' => $json['content'],
                'imagePath' => $row['imagePath'],
                'label' => $row['label'],
                'public' => $row['isPublic'],
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
    'privateActivities' => $privateActivities,
    'fullName' => $fullName,
    'notMe' => $notMe,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
