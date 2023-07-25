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

$prevActivityDoenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);

try {
    if ($prevActivityDoenetId == ""){
        throw new Exception("Internal Error: missing doenetId");
    }else if ($userId == ""){
        throw new Exception("Internal Error: you need to be signed in to duplicate an activity");
    }

    $prevCourseId = "";

    //Make sure the activity is public and assigned
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
        throw new Exception("Internal Error: Activity is not public");
    }else if ($isAssigned != '1'){
        throw new Exception("Internal Error: Activity is not public");
    }}else{
        throw new Exception("Internal Error: Activity is not available");
    }

    $nextCourseId = '';

    //Identify and make if needed the destination course
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


    $destinationFilesToUpdate = [];
    $nextActivityDoenetId = "";

    // Duplicate the activity

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
            'imagePath' => is_null($row['imagePath']) ? "/activity_default.jpg" : $row['imagePath'],
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
        throw new Exception("Internal Error: Activity is not available");
    }

    $parse_results = parse_activity_definition_rename_pages($assignedActivity);

    if(!$parse_results["success"]) {
        $message = $parse_results["message"];
        throw new Exception("Internal Error: $message");
    }

    $nextActivityJsonDefinition = $parse_results["activity_definition"];

    $nextFirstPageDoenetId = $parse_results["first_page_id"];

    // for now, just copy the list of files?
    $nextActivityJsonDefinition["files"] = $activityJSON["files"];

    $nextActivityJsonDefinition = json_encode($nextActivityJsonDefinition);

    $insert_to_pages = [];

    foreach($parse_results["renamed_pages"] as $oldPageCid => $newPageInfo) {
        $newPageId = $newPageInfo["newPageId"];
        $label = $newPageInfo["label"];
        $sourceFile = "../media/$oldPageCid.doenet";
        $destinationFile = "../media/byPageId/$newPageId.doenet";

        $dirname = dirname($destinationFile);
        if (!is_dir($dirname)) {
            mkdir($dirname, 0755, true);
        }
        if (!copy($sourceFile, $destinationFile)) {
            throw new Exception("Internal Error: Failed to copy file");
        }

        if($label == NULL) {
            $label = "Untitled";
        } else {

            $label = str_replace(
                ["&quot;", "&apos;", "&lt;", "&gt;", "&amp;"],
                ['"', ",", "<", ">", "&"],
                $label
            );

            $label = mysqli_real_escape_string($conn, $label);
        }

        array_push(
            $insert_to_pages,
            "('$nextCourseId','$nextActivityDoenetId','$newPageId','$label')"
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


    // TODO: how do we handle support files?


    //content_contributor_history
    //Don't update history if duplicating to the same course
    if ($nextCourseId != $prevCourseId){
    $insert_content_contributor_history = [];
    //Get history
    $sql = "
    SELECT
    doenetId,
    courseId,
    assignedCID,
    isUserPortfolio,
    userId,
    timestamp
    FROM content_contributor_history
    WHERE doenetId = '$prevActivityDoenetId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()){
            $doenetId = $row['doenetId'];
            $courseId = $row['courseId'];
            $assignedCID = $row['assignedCID'];
            $isUserPortfolio = $row['isUserPortfolio'];
            $userId = $row['userId'];
            $timestamp = $row['timestamp'];
            array_push(
                $insert_content_contributor_history,
                "('$nextActivityDoenetId','$doenetId','$courseId','$assignedCID','$isUserPortfolio','$userId','$timestamp')"
            );
        }
    }

    //add prevous one to history with timestamp = now
    $sql = "
    SELECT portfolioCourseForUserId
    FROM course
    WHERE courseId = '$prevCourseId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $isUserPortfolio = is_null($row["portfolioCourseForUserId"]) ? "0" : "1";
        $prevUserId = $row["portfolioCourseForUserId"];
    }
    array_push(
        $insert_content_contributor_history,
        "('$nextActivityDoenetId','$prevActivityDoenetId','$prevCourseId','$assignedCid','$isUserPortfolio','$prevUserId',NOW())"
    );

    $str_insert_content_contributor_history = implode(',', $insert_content_contributor_history);


    // INSERT into content_contributor_history table
    $sql = "
    INSERT INTO content_contributor_history (doenetId,prevDoenetId,courseId,assignedCID,isUSerPortfolio,userId,timestamp)
    VALUES
    $str_insert_content_contributor_history
    ";
    $result = $conn->query($sql);
    }

    $response_arr = [
        'success' => true,
        'courseId' => $nextCourseId,
        'nextActivityDoenetId' => $nextActivityDoenetId,
        'nextPageDoenetId' => $nextFirstPageDoenetId,
    ];

    http_response_code(200);

} catch (Exception $e) {
    $response_arr = [
        'success' => false,
        'message' => $e->getMessage(),
    ];
    // TODO: change response code to an error when front end code can handle it
    http_response_code(200);

} finally {
    // make it json format
    echo json_encode($response_arr);
    $conn->close();
}
?>
