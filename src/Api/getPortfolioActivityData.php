<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

$success = true;
$message = '';

if ($userId == '') {
    $success = false;
    $message = 'Error: You need to sign in';
}

$activityData = [
    'doenetId' => $doenetId,
    'imagePath' => '',
    'label' => '',
    'learningOutcomes' => '',
    'public' => false, //default to private
    'isNew' => true,
];

//Assume we are updating the activity and need the current settings
if ($success) {
    $sql = "
    SELECT imagePath,
    label,
    learningOutcomes,
    isPublic
    FROM course_content
    WHERE doenetId='$doenetId'
    AND courseId = (SELECT courseId FROM course WHERE portfolioCourseForUserId = '$userId')
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $activityData = [
            'doenetId' => $doenetId,
            'imagePath' => $row['imagePath'],
            'label' => $row['label'],
            'learningOutcomes' => $row['learningOutcomes'],
            'public' => $row['isPublic'],
            'isNew' => false,
        ];
    } else {
        $activityData['isNew'] = true;
        //It's a new activity or a hack
        //So test if it's a hack
        $sql = "
        SELECT doenetId 
        FROM next_doenetId
        WHERE userId='$userId'
        AND doenetId='$doenetId'
        ";
        $result = $conn->query($sql);
        if ($result->num_rows <= 0) {
            //It's a Hack
            $success = false;
            $message =
                'Error: You need to click add activity before navigating here';
        }
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'activityData' => $activityData,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
