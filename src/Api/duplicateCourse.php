<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';
include 'permissionsAndSettingsFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];
$success = true;

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (!array_key_exists('courseId', $_POST)) {
    $success = false;
    $message = 'Request error, missing courseId';
}

if ($success) {
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
    $dateDifference = mysqli_real_escape_string(
        $conn,
        $_POST['dateDifference']
    );
    $newLabel = mysqli_real_escape_string($conn, $_POST['newLabel']);

    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );

    if ($requestorPermissions['canViewContentSource'] != '1') {
        $success = false;
        $message = 'You are not authoried to duplicate this course';
    }
}

if ($success) {
    // Random course picture
    $course_pics = include 'coursePics.php';
    $randomNumber = rand(0, count($course_pics) - 1);
    $course_pic = $course_pics[$randomNumber];

    //Random courseId
    $nextCourseId = include 'randomId.php';
    $nextCourseId = '_' . $nextCourseId;
    $defaultRoleId = include 'randomId.php'; //student
    $ownerRoleId = include 'randomId.php';
    $designerRoleId = include 'randomId.php';
    $instructorRoleId = include 'randomId.php';
    $authorRoleId = include 'randomId.php';
    $taRoleId = include 'randomId.php';
    $proctorRoleId = include 'randomId.php';
    $guestInstructorRoleId = include 'randomId.php';
    $auditorRoleId = include 'randomId.php';

    //create duplicate course
    $result = $conn->query(
        "INSERT INTO course (courseId,label,image,defaultRoleId)
        VALUES
        ('$nextCourseId','$newLabel','$course_pic','$defaultRoleId')"
    );

    /** Default Roles */
    $result = $conn->query(
        //Owner
        "INSERT INTO course_role
        SET
        courseId = '$nextCourseId',
        roleId = '$ownerRoleId',
        label = 'Owner',
        canViewContentSource = '1',
        canEditContent = '1',
        canPublishContent = '1',
        canViewUnassignedContent = '1',
        canProctor = '1',
        canViewAndModifyGrades = '1',
        canViewActivitySettings = '1',
        canModifyActivitySettings = '1',
        canModifyCourseSettings = '1',
        dataAccessPermission = 'Identified',
        canViewUsers = '1',
        canManageUsers = '1',
        isAdmin = '1',
        isOwner = '1'"
    );

    $result = $conn->query(
        //Designer
        "INSERT INTO course_role
        SET
        courseId = '$nextCourseId',
        roleId = '$designerRoleId',
        label = 'Designer',
        canViewContentSource = '1',
        canEditContent = '1',
        canPublishContent = '1',
        canViewUnassignedContent = '1',
        canProctor = '1',
        canViewAndModifyGrades = '1',
        canViewActivitySettings = '1',
        canModifyActivitySettings = '1',
        canModifyCourseSettings = '1',
        dataAccessPermission = 'Identified',
        canViewUsers = '1',
        canManageUsers = '1',
        isAdmin = '1'"
    );

    $result = $conn->query(
        //Instructor (non-editing)
        "INSERT INTO course_role
        SET
        courseId = '$nextCourseId',
        roleId = '$instructorRoleId',
        label = 'Instructor (non-editing)',
        canViewContentSource = '1',
        canViewUnassignedContent = '1',
        canProctor = '1',
        canViewAndModifyGrades = '1',
        canViewActivitySettings = '1',
        canModifyActivitySettings = '1',
        dataAccessPermission = 'Aggregate',
        canViewUsers = '1',
        canManageUsers = '1'"
    );

    $result = $conn->query(
        //TA
        "INSERT INTO course_role
        SET
        courseId = '$nextCourseId',
        roleId = '$taRoleId',
        label = 'TA',
        canViewContentSource = '1',
        canViewUnassignedContent = '1',
        canProctor = '1',
        canViewAndModifyGrades = '1',
        canViewActivitySettings = '1',
        dataAccessPermission = 'Aggregate',
        canViewUsers = '1'"
    );

    $result = $conn->query(
        //Guest Instructor
        "INSERT INTO course_role
        SET
        courseId = '$nextCourseId',
        roleId = '$guestInstructorRoleId',
        label = 'Guest Instructor',
        canViewContentSource = '1',
        canViewUnassignedContent = '1',
        canViewActivitySettings = '1'"
    );

    $result = $conn->query(
        //Author
        "INSERT INTO course_role
        SET
        courseId = '$nextCourseId',
        roleId = '$authorRoleId',
        label = 'Author',
        canViewContentSource = '1',
        canViewUnassignedContent = '1',
        canEditContent = '1',
        canPublishContent = '1',
        dataAccessPermission = 'Aggregate'"
    );

    $result = $conn->query(
        //Proctor
        "INSERT INTO course_role
        SET
        courseId= '$nextCourseId',
        roleId= '$proctorRoleId',
        label= 'Proctor',
        canProctor = '1',
        canViewUsers = '1'"
    );

    $result = $conn->query(
        //Student
        "INSERT INTO course_role
        SET
        courseId= '$nextCourseId',
        roleId= '$defaultRoleId',
        label= 'Student',
        isIncludedInGradebook = '1'"
    );

    $result = $conn->query(
        //Auditor
        "INSERT INTO course_role
        SET
        courseId= '$nextCourseId',
        roleId= '$auditorRoleId',
        label= 'Auditor'"
    );

    /** End Default Roles */

    //add requesting user as owner
    $result = $conn->query(
        "INSERT INTO course_user
      SET
      courseId ='$nextCourseId',
      userId ='$userId',
      roleId ='$ownerRoleId'"
    );
}

$permissionsAndSettings = [];

if ($success) {
    $permissionsAndSettings = getpermissionsAndSettings($conn, $userId);
}

//Recursive function that returns order ids and collection link ids
function mine_activity_for_ids($jsonArr)
{
    $linkids = [];
    $orderids = [];
    $pageids = [];
    $collectionDoenetIds = [];
    if (count($jsonArr) > 0) {
        $jsonContent = $jsonArr['content'];
        foreach ($jsonContent as $content) {
            if ($content['type'] == 'collectionLink') {
                array_push($linkids, $content['doenetId']);
                //Add page ids here
                foreach (
                    $content['pagesByCollectionSource']
                    as $key => $value
                ) {
                    if ($key != 'object') {
                        //Only add if not there already
                        if (!in_array($key, $collectionDoenetIds)) {
                            array_push($collectionDoenetIds, $key);
                        }
                    }

                    if (is_array($value) || is_object($value)) {
                        foreach ($value as $page) {
                            array_push($pageids, $page);
                        }
                    }
                }
            }
            if ($content['type'] == 'order') {
                array_push($orderids, $content['doenetId']);
                $child_ids = mine_activity_for_ids($content);
                $linkids = array_merge($linkids, $child_ids['LinkIds']);
                $orderids = array_merge($orderids, $child_ids['OrderIds']);
                $pageids = array_merge($pageids, $child_ids['PageIds']);
                $collectionDoenetIds = array_merge(
                    $collectionDoenetIds,
                    $child_ids['CollectionIds']
                );
            }
        }
    }
    return [
        'LinkIds' => $linkids,
        'OrderIds' => $orderids,
        'PageIds' => $pageids,
        'CollectionIds' => $collectionDoenetIds,
    ];
}

//Duplicate Content
if ($success) {
    //Figure out what the new doenetId's for content will be
    //and store all of the course content
    $sql = "
    SELECT 
    type,
    doenetId,
    parentDoenetId,
    label,
    isAssigned,
    isGloballyAssigned,
    isPublic,
    userCanViewSource,
    sortOrder,
    CAST(jsonDefinition as CHAR) AS json
    FROM course_content
    WHERE courseId='$courseId'
    AND isDeleted='0'
    ";

    $result = $conn->query($sql);
    $prevToNextDoenetIds = [];
    $prevToNextDoenetIds[$courseId] = $nextCourseId; //Need this for parentDoenetIds
    $previous_course_content = [];
    $assigned_course_content_doenetIds = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $type = $row['type'];
            $doenetId = $row['doenetId'];
            $parentDoenetId = $row['parentDoenetId'];
            $label = $row['label'];
            $userCanViewSource = $row['userCanViewSource'];
            $sortOrder = $row['sortOrder'];
            $isAssigned = $row['isAssigned'];
            $isGloballyAssigned = $row['isGloballyAssigned'];
            $isPublic = $row['isPublic'];
            $json = $row['json'];
            if ($isAssigned == '1') {
                array_push($assigned_course_content_doenetIds, $doenetId);
            }

            $nextDoenetId = include 'randomId.php';
            $nextDoenetId = '_' . $nextDoenetId;
            $prevToNextDoenetIds[$doenetId] = $nextDoenetId;

            array_push($previous_course_content, [
                'type' => $type,
                'courseId' => $nextCourseId,
                'doenetId' => $doenetId,
                'parentDoenetId' => $parentDoenetId,
                'label' => $label,
                'userCanViewSource' => $userCanViewSource,
                'sortOrder' => $sortOrder,
                'isAssigned' => $isAssigned,
                'isGloballyAssigned' => $isGloballyAssigned,
                'isPublic' => $isPublic,
                'jsonDefinition' => $json,
            ]);
        }
    }

    //Get all the pages for the course
    $sql = "
    SELECT
    doenetId,
    label,
    containingDoenetId
    FROM pages
    WHERE courseId='$courseId'
    AND isDeleted='0'
    ";

    $result = $conn->query($sql);
    $insert_to_pages = [];
    $contained_pages = []; //Array of pages contained keyed by previous doenetId

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $pageDoenetId = $row['doenetId'];
            $containingDoenetId = $row['containingDoenetId'];
            $label = $row['label'];
            $nextDoenetId = include 'randomId.php';
            $nextDoenetId = '_' . $nextDoenetId;
            $nextContainingDoenetId = $prevToNextDoenetIds[$containingDoenetId];
            $escapedLabel = mysqli_real_escape_string($conn, $label);
            array_push(
                $insert_to_pages,
                "('$nextCourseId','$nextContainingDoenetId','$nextDoenetId','$escapedLabel')"
            );
            if ($contained_pages[$containingDoenetId] == '') {
                $contained_pages[$containingDoenetId] = [
                    [
                        'previous' => $pageDoenetId,
                        'next' => $nextDoenetId,
                    ],
                ];
            } else {
                array_push($contained_pages[$containingDoenetId], [
                    'previous' => $pageDoenetId,
                    'next' => $nextDoenetId,
                ]);
            }

            $prevToNextDoenetIds[$pageDoenetId] = $nextDoenetId;
        }
    }
    $str_insert_to_pages = implode(',', $insert_to_pages);

    //Update course content
    //Replace all the doenetIds for the pages with the new doenetId's
    $next_course_content = [];
    $collection_page_link_ids = [];
    $activity_and_collection_ids = [];

    foreach ($previous_course_content as $row) {
        $type = $row['type'];
        // $courseId = $row['courseId'];
        $doenetId = $row['doenetId'];
        $parentDoenetId = $row['parentDoenetId'];
        $label = $row['label'];
        $sortOrder = $row['sortOrder'];
        $isAssigned = $row['isAssigned'];
        $isGloballyAssigned = $row['isGloballyAssigned'];
        $isPublic = $row['isPublic'];
        $userCanViewSource = $row['userCanViewSource'];
        $jsonDefinition = $row['jsonDefinition'];

        //Replace previous course_content rows json with next page doenetIds
        if ($type == 'activity' || $type == 'bank') {
            array_push($activity_and_collection_ids, $doenetId);
            foreach ($contained_pages[$doenetId] as $pair) {
                $jsonDefinition = str_replace(
                    $pair['previous'],
                    $pair['next'],
                    $jsonDefinition
                );
            }
            $jsonIds = mine_activity_for_ids(
                json_decode($jsonDefinition, true)
            );
            $collection_page_link_ids = array_merge(
                $collection_page_link_ids,
                $jsonIds['PageIds']
            );
            $needNewIds = array_merge(
                $jsonIds['LinkIds'],
                $jsonIds['OrderIds'],
                $jsonIds['PageIds']
            );
            foreach ($needNewIds as $id) {
                $nextDoenetId = include 'randomId.php';
                $nextDoenetId = '_' . $nextDoenetId;
                $jsonDefinition = str_replace(
                    $id,
                    $nextDoenetId,
                    $jsonDefinition
                );
                $prevToNextDoenetIds[$id] = $nextDoenetId;
            }
            foreach ($jsonIds['CollectionIds'] as $id) {
                $nextDoenetId = $prevToNextDoenetIds[$id];
                $jsonDefinition = str_replace(
                    $id,
                    $nextDoenetId,
                    $jsonDefinition
                );
            }
        }

        //Use next doenetId
        $nextDoenetId = $prevToNextDoenetIds[$doenetId];
        $nextParentDoenetId = $prevToNextDoenetIds[$parentDoenetId];

        $escapedLabel = mysqli_real_escape_string($conn, $label);
        array_push(
            $next_course_content,
            "('$type','$nextCourseId','$nextDoenetId','$nextParentDoenetId','$escapedLabel',NOW(),'$isAssigned','$isGloballyAssigned','$isPublic','$userCanViewSource','$sortOrder','$jsonDefinition')"
        );
    }
    $str_insert_to_course_content = implode(',', $next_course_content);
    // echo $str_insert_to_course_content;
    $sql = "
    INSERT INTO course_content (type,courseId,doenetId,parentDoenetId,label,creationDate,isAssigned,isGloballyAssigned,isPublic,userCanViewSource,sortOrder,jsonDefinition)
    VALUES
    $str_insert_to_course_content
    ";
    $result = $conn->query($sql);

    // INSERT next pages into next course
    $sql = "
    INSERT INTO pages (courseId,containingDoenetId,doenetId,label)
    VALUES
    $str_insert_to_pages
    ";
    $result = $conn->query($sql);
}

//Move Assignment table
if ($success) {
    foreach ($assigned_course_content_doenetIds as $assigned_doenetId) {
        $next_assigned_doenetId = $prevToNextDoenetIds[$assigned_doenetId];
        $sql = "
        INSERT INTO assignment (
            doenetId,
            courseId,
            assignedDate,
            pinnedAfterDate,
            pinnedUntilDate,
            dueDate,
            timeLimit,
            numberOfAttemptsAllowed,
            attemptAggregation,
            totalPointsOrPercent,
            gradeCategory,
            individualize,
            showSolution,
            showSolutionInGradebook,
            showFeedback,
            showHints,
            showCorrectness,
            showCreditAchievedMenu,
            paginate,
            showFinishButton,
            proctorMakesAvailable,
            autoSubmit,
            canViewAfterCompleted
            )
            SELECT '$next_assigned_doenetId' AS doenetId,
            '$nextCourseId' AS courseId,
            DATE_ADD(assignedDate, INTERVAL $dateDifference DAY) AS assignedDate,
            DATE_ADD(pinnedAfterDate, INTERVAL $dateDifference DAY) AS pinnedAfterDate,
            DATE_ADD(pinnedUntilDate, INTERVAL $dateDifference DAY) AS pinnedUntilDate,
            DATE_ADD(dueDate, INTERVAL $dateDifference DAY) AS dueDate,
            timeLimit,
            numberOfAttemptsAllowed,
            attemptAggregation,
            totalPointsOrPercent,
            gradeCategory,
            individualize,
            showSolution,
            showSolutionInGradebook,
            showFeedback,
            showHints,
            showCorrectness,
            showCreditAchievedMenu,
            paginate,
            showFinishButton,
            proctorMakesAvailable,
            autoSubmit,
            canViewAfterCompleted
            FROM assignment
            WHERE doenetId = '$assigned_doenetId'
        ";
        $result = $conn->query($sql);
    }
    //Copy the source page files to the new doenetId files
    // for all activities and collections

    foreach ($contained_pages as $array_of_pairs) {
        foreach ($array_of_pairs as $previous_pages_info) {
            $previous_page_doenetId = $previous_pages_info['previous'];
            $next_page_doenetId = $previous_pages_info['next'];

            $sourceFile = "../media/byPageId/$previous_page_doenetId.doenet";
            $destinationFile = "../media/byPageId/$next_page_doenetId.doenet";
            // echo "sourceFile $sourceFile \n";
            // echo "destinationFile $destinationFile \n\n";
            $dirname = dirname($destinationFile);
            if (!is_dir($dirname)) {
                mkdir($dirname, 0755, true);
            }
            if (!copy($sourceFile, $destinationFile)) {
                $success = false;
                $message = 'failed to copy';
            }
        }
    }
}

//Move Collection Links
if ($success) {
    $sql = "
    SELECT
    containingDoenetId,
    parentDoenetId,
    doenetId,
    sourceCollectionDoenetId,
    sourcePageDoenetId,
    label,
    timeOfLastUpdate
    FROM link_pages
    WHERE courseId = '$courseId'
    ";
    $result = $conn->query($sql);

    $insert_to_link_pages = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $containingDoenetId = $row['containingDoenetId'];
            $parentDoenetId = $row['parentDoenetId'];
            $doenetId = $row['doenetId'];
            $sourceCollectionDoenetId = $row['sourceCollectionDoenetId'];
            $sourcePageDoenetId = $row['sourcePageDoenetId'];
            $label = $row['label'];
            $escapedLabel = mysqli_real_escape_string($conn, $label);
            $timeOfLastUpdate = $row['timeOfLastUpdate'];
            array_push(
                $insert_to_link_pages,
                "('$nextCourseId',
                '$prevToNextDoenetIds[$containingDoenetId]',
                '$prevToNextDoenetIds[$parentDoenetId]',
                '$prevToNextDoenetIds[$doenetId]',
                '$prevToNextDoenetIds[$sourceCollectionDoenetId]',
                '$prevToNextDoenetIds[$sourcePageDoenetId]',
                '$escapedLabel',
                '$timeOfLastUpdate')"
            );
        }
    }
    $str_insert_to_link_pages = implode(',', $insert_to_link_pages);
    // INSERT next link pages into next course
    $sql = "
    INSERT INTO link_pages (courseId,containingDoenetId,parentDoenetId,doenetId,sourceCollectionDoenetId,sourcePageDoenetId,label,timeOfLastUpdate)
    VALUES
    $str_insert_to_link_pages
    ";
    $result = $conn->query($sql);

    //Copy page files
    foreach ($collection_page_link_ids as $page_link_id) {
        $next_page_link_id = $prevToNextDoenetIds[$page_link_id];

        $sourceFile = "../media/byPageId/$page_link_id.doenet";
        $destinationFile = "../media/byPageId/$next_page_link_id.doenet";
        $dirname = dirname($destinationFile);
        if (!is_dir($dirname)) {
            mkdir($dirname, 0755, true);
        }
        if (!copy($sourceFile, $destinationFile)) {
            $success = false;
            $message = 'failed to copy link pages';
        }
    }
}

//Copy course times
if ($success) {
    $sql = "
    INSERT INTO class_times
    (courseId,dotwIndex,startTime,endTime,sortOrder)
    SELECT 
    '$nextCourseId' AS courseId,
    dotwIndex,
    startTime,
    endTime,
    sortOrder
    FROM class_times
    WHERE courseId = '$courseId'
    ";
    $result = $conn->query($sql);
}

//copy support files
if ($success) {
    foreach ($activity_and_collection_ids as $doenetId) {
        $nextDoenetId = $prevToNextDoenetIds[$doenetId];

        $sql = "
        INSERT INTO support_files
        (userId,cid,doenetId,fileType,description,asFileName,sizeInBytes,widthPixels,heightPixels,timestamp,isListed,isPublic)
        SELECT 
        '$userId' AS userId,
        cid,
        '$nextDoenetId' AS doenetId,
        fileType,
        description,
        asFileName,
        sizeInBytes,
        widthPixels,
        heightPixels,
        timestamp,
        isListed,
        isPublic
        FROM support_files
        WHERE doenetId = '$doenetId'
    ";
        $result = $conn->query($sql);
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'courseId' => $nextCourseId,
    'permissionsAndSettings' => $permissionsAndSettings,
    'image' => $course_pic,
    'color' => 'none',
];

echo json_encode($response_arr);

$conn->close();
?>
