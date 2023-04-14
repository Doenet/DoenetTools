<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'createPortfolioCourseFunction.php';
include 'mineActivityForIdsFunction.php';
include 'parseActivityDefinitionRenamePages.php';

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

//Make sure the activity is public and assigned
if ($success) {
    $sql = "
    SELECT isPublic,
    isAssigned,
    courseId
    FROM course_content
    WHERE doenetId = '$prevActivityDoenetId'
    AND isDeleted='0'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $isPublic = $row['isPublic'];
    $isAssigned = $row['isAssigned'];
    $prevCourseId = $row['courseId'];

    if ($isPublic != '1'){
        $success = FALSE;
        $message = 'Internal Error: Activity is not public';
    }
    }else if ($isAssigned != '1'){
        $success = FALSE;
        $message = 'Internal Error: Activity is not public';
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

    //Query the activity's information
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

    $activityJSON = json_decode($previous_activity_content['jsonDefinition'], true);
    $assignedCid = $activityJSON["assignedCid"];

    $assignedActivity = file_get_contents("../media/$assignedCid.doenet");

    if($assignedActivity == FALSE) {
        $success = FALSE;
        $message = 'Internal Error: Activity is not available';
    } else {

        $parse_results = parse_activity_definition_rename_pages($assignedActivity);

        if(!$parse_results["success"]) {
            $success = FALSE;
            $message = 'Internal Error: $parse_results["message"]';
        } else {

            $nextActivityJsonDefinition = $parse_results["activity_definition"];

            $nextFirstPageDoenetId = $parse_results["first_page_id"];

            // for now, just copy the list of files?
            $nextActivityJsonDefinition["files"] = $activityJSON["files"];

            $nextActivityJsonDefinition = json_encode($nextActivityJsonDefinition);

            $insert_to_pages = [];

            foreach($parse_results["renamed_pages"] as $old_page_cid => $new_page_id) {
                $sourceFile = "../media/$old_page_cid.doenet";
                $destinationFile = "../media/byPageId/$new_page_id.doenet";
        
                $dirname = dirname($destinationFile);
                if (!is_dir($dirname)) {
                    mkdir($dirname, 0755, true);
                }
                if (!copy($sourceFile, $destinationFile)) {
                    $success = false;
                    $message = 'failed to copy';
                }  

                array_push(
                    $insert_to_pages,
                    "('$nextCourseId','$nextActivityDoenetId','$new_page_id','Untitled')"
                );
            }


            $escapedLabel = mysqli_real_escape_string($conn, $previous_activity_content['label']);
            $imagePath = $previous_activity_content['imagePath'];
            $type = $previous_activity_content['type'];
            $str_insert_to_course_content = "('$type','$nextCourseId','$nextActivityDoenetId','$nextCourseId','$escapedLabel',NOW(),'0','0','0','1','n','$nextActivityJsonDefinition','$imagePath',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))";
            
            
            //INSERT the new activity into course_content
            $sql = "
            INSERT INTO course_content (type,courseId,doenetId,parentDoenetId,label,creationDate,isAssigned,isGloballyAssigned,isPublic,userCanViewSource,sortOrder,jsonDefinition,imagePath,addToPrivatePortfolioDate)
            VALUES
            $str_insert_to_course_content
            ";
            $conn->query($sql);
            

            $str_insert_to_pages = implode(',', $insert_to_pages);
            //INSERT all the new pages into the pages table
            $sql = "
            INSERT INTO pages (courseId,containingDoenetId,doenetId,label)
            VALUES
            $str_insert_to_pages
            ";
            $result = $conn->query($sql);


        }
    }
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
