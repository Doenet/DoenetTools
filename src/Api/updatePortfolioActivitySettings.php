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

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (!array_key_exists('doenetId', $_POST)) {
    $success = false;
    $message = 'Missing doenetId';
} elseif (!array_key_exists('label', $_POST)) {
    $success = false;
    $message = 'Missing label';
} elseif (!array_key_exists('imagePath', $_POST)) {
    $success = false;
    $message = 'Missing imagePath';
}

//Test if doenetId is a UserId Course
if ($success) {
    $label = mysqli_real_escape_string($conn, $_POST['label']);
    $doenetId = mysqli_real_escape_string($conn, $_POST['doenetId']);
    $imagePath = mysqli_real_escape_string($conn, $_POST['imagePath']);
    $public = mysqli_real_escape_string($conn, $_POST['public']);
    $isPublic = '0';
    if ($public) {
        $isPublic = '1';
    }
    $learningOutcomes = mysqli_real_escape_string(
        $conn,
        $_POST['learningOutcomes']
    );

    //Test if we are adding content
    $sql = "
    SELECT doenetId
    FROM next_doenetId
    WHERE doenetId = '$doenetId'
    AND userId = '$userId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        //Adding content

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

        $jsonDefinition =
            '{"type":"activity","version": "0.1.0","isSinglePage": true,"content":["' .
            $pageDoenetId .
            '"],"assignedCid":null,"draftCid":null,"itemWeights": [1],"files":[]}';
        $sql = "SELECT sortOrder
        FROM `course_content`
        WHERE courseId = '$courseId'
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
    } else {
        //Test if the user has permission to update
        $sql = "
        SELECT courseId
        FROM course_content
        WHERE doenetId = '$doenetId'
        ";
        $result = $conn->query($sql);
        $courseId = '';

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $courseId = $row['courseId'];
            $permissions = permissionsAndSettingsForOneCourseFunction(
                $conn,
                $userId,
                $courseId
            );
            if ($permissions['canEditContent'] != '1') {
                $success = false;
                $message = 'You need permission to edit content.';
            }
        } else {
            $success = false;
            $message = "Error: doenetId doesn't match.";
        }

        if ($success) {
            $sql = "
                UPDATE course_content
                SET label = '$label', 
                imagePath = '$imagePath',
                isPublic = '$isPublic',
                learningOutcomes = '$learningOutcomes'
                WHERE doenetId = '$doenetId'
                AND courseId = '$courseId'
                ";
            $conn->query($sql);
        }
    }

    //Remove from next_doenetId to keep table small
    $sql = "
      DELETE FROM next_doenetId
      WHERE doenetId = '$doenetId'
      AND userId = '$userId'
      ";
    $conn->query($sql);
}

$response_arr = [
    'success' => $success,
    'message' => $message,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
