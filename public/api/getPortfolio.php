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
    SELECT doenetId,
    imagePath,
    label,
    isPublic,
    CAST(jsonDefinition as CHAR) AS json,
    CAST(learningOutcomes as CHAR) AS learningOutcomes
    FROM course_content AS cc
    WHERE courseId = (SELECT courseId FROM course WHERE portfolioCourseForUserId = '$userId')
    AND isDeleted = 0
    AND isPublic = 0
    ORDER BY addToPrivatePortfolioDate DESC
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $json = json_decode($row['json'], true);
            $learningOutcomes = json_decode($row['learningOutcomes'], true);
            $activity = [
                'doenetId' => $row['doenetId'],
                'version' => $json['version'],
                'content' => $json['content'],
                'imagePath' => $row['imagePath'],
                'label' => $row['label'],
                'public' => $row['isPublic'],
                'learningOutcomes' => $learningOutcomes,
            ];
            array_push($privateActivities, $activity);
        }
    }
    $sql = "
    SELECT doenetId,
    imagePath,
    label,
    isPublic,
    CAST(jsonDefinition as CHAR) AS json,
    CAST(learningOutcomes as CHAR) AS learningOutcomes
    FROM course_content AS cc
    WHERE courseId = (SELECT courseId FROM course WHERE portfolioCourseForUserId = '$userId')
    AND isDeleted = 0
    AND isPublic = 1
    ORDER BY addToPublicPortfolioDate DESC
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $json = json_decode($row['json'], true);
            $learningOutcomes = json_decode($row['learningOutcomes'], true);
            $activity = [
                'doenetId' => $row['doenetId'],
                'version' => $json['version'],
                'content' => $json['content'],
                'imagePath' => $row['imagePath'],
                'label' => $row['label'],
                'public' => $row['isPublic'],
                'learningOutcomes' => $learningOutcomes,

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
