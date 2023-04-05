<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'createPortfolioCourseFunction.php';


$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];
$success = true;
$message = "";

$prevActivityDoenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);

if ($prevActivityDoenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}else if ($userId == ""){
  $success = FALSE;
  $message = 'Internal Error: you need to be signed in to duplicate an activity';
}

$prevCourseId = "";

//Make sure the activity is public
if ($success) {
    $sql = "
    SELECT isPublic,
    courseId
    FROM course_content
    WHERE doenetId = '$prevActivityDoenetId'
    AND isDeleted='0'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $isPublic = $row['isPublic'];
    $prevCourseId = $row['courseId'];

    if ($isPublic != '1'){
        $success = FALSE;
        $message = 'Internal Error: Activity is not public';
    }
    }else{
        $success = FALSE;
        $message = 'Internal Error: Activity is not available';
    }
}

$nextCourseId = '';

//Identify and make if needed the destination course
if ($success) {
    $sql = "
    SELECT c.courseId
    FROM user AS u
    LEFT JOIN course AS c
    ON u.userId = c.portfolioCourseForUserId
    WHERE u.userId = '$userId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $nextCourseId = $row['courseId'];
    }

    if ($nextCourseId == ''){
        //Need to make a course for this user
        $nextCourseId = createPortfolioCourseFunction($conn,$userId);
    }

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

$destinationFilesToUpdate = [];
$nextActivityDoenetId = "";

// Duplicate the activity
if ($success) {

    //Querry the activity's information
    $sql = "
    SELECT 
    type,
    label,
    sortOrder,
    CAST(jsonDefinition as CHAR) AS json,
    imagePath,
    CAST(learningOutcomes as CHAR) AS learningOutcomes
    FROM course_content
    WHERE doenetId='$prevActivityDoenetId'
    ";
    // echo $sql;

    $result = $conn->query($sql);
    $previous_course_content = [];
    
    $nextActivityDoenetId = include 'randomId.php';
    $nextActivityDoenetId = '_' . $nextActivityDoenetId;
    $prevToNextDoenetIds = [];
    $prevToNextDoenetIds[$prevCourseId] = $nextCourseId; //Need this for parentDoenetIds
    $prevToNextDoenetIds[$prevActivityDoenetId] = $nextActivityDoenetId; 

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        $previous_course_content = [
            'type' => $row['type'],
            'label' => $row['label'],
            'jsonDefinition' => $row['json'],
            'imagePath' => $row['imagePath'],
            'learningOutcomes' => $row['learningOutcomes'],
        ];
    }

    // $previous_course_content

    // var_dump($previous_course_content['jsonDefinition']);

    //#1 TODO: fix the mine activity.  It's not returning the pageIds
    $allPageIds = mine_activity_for_ids(
        json_decode($previous_course_content['jsonDefinition'], true)
    );
    // var_dump($allPageIds);


    //Get all the pages for the Activity
    $sql = "
    SELECT
    doenetId,
    label,
    containingDoenetId
    FROM pages
    WHERE containingDoenetId='$prevActivityDoenetId'
    AND isDeleted='0'
    ";
    $result = $conn->query($sql);
    $insert_to_pages = [];
    $contained_pages = []; //Array of pages contained keyed by previous doenetId
    $prevFirstPageDoenetId = "";

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $nextDoenetId = include 'randomId.php';
            $nextDoenetId = '_' . $nextDoenetId;

            $pageDoenetId = $row['doenetId'];
            //Only need the first page
            if ($prevFirstPageDoenetId == ''){
                $prevFirstPageDoenetId = $pageDoenetId;
            }
            $containingDoenetId = $row['containingDoenetId'];
            $label = $row['label'];
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

        $type = $previous_course_content['type'];
        $doenetId = $nextActivityDoenetId;
        $label = $previous_course_content['label'];
        $jsonDefinition = $previous_course_content['jsonDefinition'];
        $imagePath = $previous_course_content['imagePath'];
        $learningOutcomes = $previous_course_content['learningOutcomes'];
    

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

        //TODO: Fix sortOrder

        $escapedLabel = mysqli_real_escape_string($conn, $label);
        //TODO: Figure out learningOutcomes
        array_push(
            $next_course_content,
            "('$type','$nextCourseId','$nextActivityDoenetId','$nextCourseId','$escapedLabel',NOW(),'1','1','1','1','n','$jsonDefinition','$imagePath')"
        );
    
    // $str_insert_to_course_content = implode(',', $next_course_content);
    // // echo $str_insert_to_course_content;
    // $sql = "
    // INSERT INTO course_content (type,courseId,doenetId,parentDoenetId,label,creationDate,isAssigned,isGloballyAssigned,isPublic,userCanViewSource,sortOrder,jsonDefinition,imagePath)
    // VALUES
    // $str_insert_to_course_content
    // ";
    // $result = $conn->query($sql);
    // // INSERT next pages into next course
    // $sql = "
    // INSERT INTO pages (courseId,containingDoenetId,doenetId,label)
    // VALUES
    // $str_insert_to_pages
    // ";
    // $result = $conn->query($sql);
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
 //Replace previous doenetIds with next doenetIds in destinationFile
if ($success) {
    foreach($destinationFilesToUpdate as &$destinationFile){
        $doenetML = file_get_contents($destinationFile);

        foreach(array_keys($prevToNextDoenetIds) as $prev){
            $next = $prevToNextDoenetIds[$prev];
            $doenetML=str_replace($prev, $next, $doenetML);
        }

        file_put_contents($destinationFile, $doenetML);
    }
}


$nextFirstPageDoenetId = $prevToNextDoenetIds[$prevFirstPageDoenetId];

$response_arr = [
    'success' => $success,
    'message' => $message,
    'courseId' => $nextCourseId,
    'nextActivityDoenetId' => $nextActivityDoenetId,
    'nextPageDoenetId' => $nextFirstPageDoenetId,
];

echo json_encode($response_arr);

$conn->close();
?>
