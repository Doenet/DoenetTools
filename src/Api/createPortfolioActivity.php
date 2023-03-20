<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'lexicographicalRankingSort.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = '';

if ($userId == '') {
    $success = false;
    $message = 'You need to be signed in to create a portfolio activity.';
}

//Test if doenetId is a UserId Course
if ($success) {
    $portfolioCourseId = '';
    //Test if the user has a portfolio course
    //If they don't then make one.
    $sql = "
        SELECT courseId 
        FROM course 
        WHERE portfolioCourseForUserId = '$userId'
        ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $portfolioCourseId = $row['courseId'];
    } else {
        //Make the portfolio course as the user doesn't have one
        $portfolioCourseId = include 'randomId.php';
        $defaultRoleId = include 'randomId.php';

        $sql = "
            INSERT INTO course 
            (courseId,label,isPublic,defaultRoleId,portfolioCourseForUserId)
            VALUES
            ('$portfolioCourseId','Portfolio Course',1,'$defaultRoleId','$userId')
            ";
        $conn->query($sql);

        $sql = "
            INSERT INTO course_role 
            (courseId,roleId,label,isIncludedInGradebook,canViewCourse,canViewUnassignedContent,
            canViewContentSource,canEditContent,canPublishContent,canProctor,canViewAndModifyGrades,
            canViewActivitySettings,canModifyActivitySettings,canModifyCourseSettings,canViewUsers,
            canManageUsers,isAdmin,isOwner)
            VALUES
            ('$portfolioCourseId','$defaultRoleId','Owner',0,1,1,1,1,1,1,1,1,1,1,1,1,1,1)
            ";
        $conn->query($sql);

        $sql = "
            INSERT INTO course_user 
            (courseId,userId,dateEnrolled,roleId)
            VALUES
            ('$portfolioCourseId','$userId',NOW(),'$defaultRoleId')
            ";
        $conn->query($sql);
    }
    $doenetId = include 'randomId.php';
    $doenetId = '_' . $doenetId;
    $pageDoenetId = include 'randomId.php';
    $pageDoenetId = '_' . $pageDoenetId;
    $previousContainingDoenetId = $portfolioCourseId; //Note this will require SQL when we have folders
    $label = 'Untitled Activity';
    $jsonDefinition =
        '{"type":"activity","version": "0.1.0","isSinglePage": true,"content":["' .
        $pageDoenetId .
        '"],"assignedCid":null,"draftCid":null,"itemWeights": [1],"files":[]}';
    $imagePath = '/media/activity_default.jpg';
    $learningOutcomes = '';
    $isPublic = '0';

    $sql = "SELECT sortOrder
        FROM `course_content`
        WHERE courseId = '$portfolioCourseId'
        AND sortOrder >= (Select sortOrder From `course_content` WHERE doenetId='$previousContainingDoenetId' AND isDeleted = 0)
        AND isDeleted = 0
        ORDER BY sortOrder
        LIMIT 2";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $prev = $row['sortOrder'] ?: '';
    $row = $result->fetch_assoc();
    $next = $row['sortOrder'] ?: '';
    $sortOrder = SortOrder\getSortOrder($prev, $next);

    $sql = "
        INSERT INTO course_content
        (type,courseId,doenetId,parentDoenetId,label,creationDate,isPublic,
        sortOrder,jsonDefinition,imagePath,learningOutcomes)
        VALUES
        ('activity','$portfolioCourseId','$doenetId','$portfolioCourseId','$label',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'),'$isPublic',
        '$sortOrder','$jsonDefinition','$imagePath','$learningOutcomes')
        ";

    $conn->query($sql);
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'doenetId' => $doenetId,
    'pageDoenetId' => $pageDoenetId,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
