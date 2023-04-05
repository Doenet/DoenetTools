<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'createPortfolioCourseFunction.php';
include 'mineActivityForIdsFunction.php';


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

    $result = $conn->query($sql);
    $previous_activity_content = [];

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        $previous_activity_content = [
            'type' => $row['type'],
            'label' => $row['label'],
            'jsonDefinition' => $row['json'],
            'imagePath' => $row['imagePath'],
            'learningOutcomes' => $row['learningOutcomes'],
        ];
    }
    
    $nextActivityDoenetId = include 'randomId.php';
    $nextActivityDoenetId = '_' . $nextActivityDoenetId;
    $prevToNextDoenetIds = [];
    $prevToNextDoenetIds[$prevCourseId] = $nextCourseId; //Need this for parentDoenetIds
    $prevToNextDoenetIds[$prevActivityDoenetId] = $nextActivityDoenetId; 


    $allPreviousIds = mine_activity_for_ids(
        json_decode($previous_activity_content['jsonDefinition'], true)
    );
    $allPreviousPageIds = $allPreviousIds['PageIds'];
    $allPreviousOrderIds = $allPreviousIds['OrderIds'];

    $nextActivityJsonDefinition = $previous_activity_content['jsonDefinition'];

    //Insert new pages for the new activity
    //And prepare the new activity json
    foreach ($allPreviousPageIds as $previousPageId){
        $nextDoenetId = include 'randomId.php';
        $nextDoenetId = '_' . $nextDoenetId;
        $prevToNextDoenetIds[$previousPageId] = $nextDoenetId;
        $nextActivityJsonDefinition = str_replace(
            $previousPageId,
            $nextDoenetId,
            $nextActivityJsonDefinition);

        //copy the page file
        $sourceFile = "../media/byPageId/$previousPageId.doenet";
        $destinationFile = "../media/byPageId/$nextDoenetId.doenet";

        $dirname = dirname($destinationFile);
        if (!is_dir($dirname)) {
            mkdir($dirname, 0755, true);
        }
        if (!copy($sourceFile, $destinationFile)) {
            $success = false;
            $message = 'failed to copy';
        }    

    }
    

    //SELECT all the pages table info
    $allPreviousPageIdsQuoted = array_map(function($value) {
        return '"' . $value . '"';
    }, $allPreviousPageIds);
    $str_select_pages = implode(',', $allPreviousPageIdsQuoted);

    $insert_to_pages = [];

    $sql = "
    SELECT
    doenetId,
    label,
    containingDoenetId
    FROM pages
    WHERE doenetId IN ($str_select_pages)
    AND isDeleted='0'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {

            $previousDoenetId = $row['doenetId'];
            $nextDoenetId = $prevToNextDoenetIds[$previousDoenetId];
            $containingDoenetId = $row['containingDoenetId'];
            $nextContainingDoenetId = $prevToNextDoenetIds[$containingDoenetId];
            $label = $row['label'];
            $escapedLabel = mysqli_real_escape_string($conn, $label);
            array_push(
                $insert_to_pages,
                "('$nextCourseId','$nextContainingDoenetId','$nextDoenetId','$escapedLabel')"
            );
            //TODO: Make sure orders work
               //         if ($contained_pages[$containingDoenetId] == '') {
    //             $contained_pages[$containingDoenetId] = [
    //                 [
    //                     'previous' => $pageDoenetId,
    //                     'next' => $nextDoenetId,
    //                 ],
    //             ];
    //         } else {
    //             array_push($contained_pages[$containingDoenetId], [
    //                 'previous' => $pageDoenetId,
    //                 'next' => $nextDoenetId,
    //             ]);
    //         }
        }
    }
    $str_insert_to_pages = implode(',', $insert_to_pages);


     //Prepare the new activity json for new orders

    
    //TODO: Fix sortOrder
    //TODO: Figure out learningOutcomes

    $escapedLabel = mysqli_real_escape_string($conn, $previous_activity_content['label']);
    $imagePath = $previous_activity_content['imagePath'];
    $type = $previous_activity_content['type'];
    $str_insert_to_course_content = "('$type','$nextCourseId','$nextActivityDoenetId','$nextCourseId','$escapedLabel',NOW(),'0','0','0','1','n','$nextActivityJsonDefinition','$imagePath')";
    
    
    //INSERT the new activity into course_content
    $sql = "
    INSERT INTO course_content (type,courseId,doenetId,parentDoenetId,label,creationDate,isAssigned,isGloballyAssigned,isPublic,userCanViewSource,sortOrder,jsonDefinition,imagePath)
    VALUES
    $str_insert_to_course_content
    ";
    $conn->query($sql);
    
    //INSERT all the new pages into the pages table
    $sql = "
    INSERT INTO pages (courseId,containingDoenetId,doenetId,label)
    VALUES
    $str_insert_to_pages
    ";
    $conn->query($sql);


   

 
}


//copy support files
// if ($success) {
//     foreach ($activity_and_collection_ids as $doenetId) {
//         $nextDoenetId = $prevToNextDoenetIds[$doenetId];

//         $sql = "
//         INSERT INTO support_files
//         (userId,cid,doenetId,fileType,description,asFileName,sizeInBytes,widthPixels,heightPixels,timestamp,isListed,isPublic)
//         SELECT 
//         '$userId' AS userId,
//         cid,
//         '$nextDoenetId' AS doenetId,
//         fileType,
//         description,
//         asFileName,
//         sizeInBytes,
//         widthPixels,
//         heightPixels,
//         timestamp,
//         isListed,
//         isPublic
//         FROM support_files
//         WHERE doenetId = '$doenetId'
//     ";
//         $result = $conn->query($sql);
//     }
// }
 //Replace previous doenetIds with next doenetIds in destinationFile
// if ($success) {
//     foreach($destinationFilesToUpdate as &$destinationFile){
//         $doenetML = file_get_contents($destinationFile);

//         foreach(array_keys($prevToNextDoenetIds) as $prev){
//             $next = $prevToNextDoenetIds[$prev];
//             $doenetML=str_replace($prev, $next, $doenetML);
//         }

//         file_put_contents($destinationFile, $doenetML);
//     }
// }


$nextFirstPageDoenetId = $prevToNextDoenetIds[$allPreviousPageIds[0]];

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
