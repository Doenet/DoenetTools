<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include "permissionsAndSettingsForOneCourseFunction.php";

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);
$pageId = mysqli_real_escape_string($conn, $_REQUEST['pageId']);

$response_arr;
try {
    $sql = "
    SELECT 
    label,
    courseId
    FROM pages
    WHERE doenetId = '$pageId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $pageLabel = $row['label'];
        $courseId = $row['courseId'];
    }

    $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
    if ($permissions["canEditContent"] != '1'){
        throw new Exception("No permission to edit this activity");
    }
    if ($permissions["canViewContentSource"] != '1'){
        throw new Exception("No permission to view this activity");
    }

    
    $sql = "
    SELECT 
    type,
    courseId,
    label,
    isBanned,
    isAssigned,
    isGloballyAssigned,
    isPublic,
    userCanViewSource,
    CAST(jsonDefinition as CHAR) AS json,
    imagePath,
    CAST(learningOutcomes as CHAR) AS learningOutcomes
    FROM course_content
    WHERE doenetId = '$doenetId'
    AND isDeleted = '0'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $type = $row['type'];
    $courseId = $row['courseId'];
    $label = $row['label'];
    $isBanned = $row['isBanned'];
    $isAssigned = $row['isAssigned'];
    $userCanViewSource = $row['userCanViewSource'];
    $isGloballyAssigned = $row['isGloballyAssigned'];
    $isPublic = $row['isPublic'];
    $userCanViewSource = $row['userCanViewSource'];
    $json = json_decode($row['json'], true);
    $imagePath = $row['imagePath'];
    $learningOutcomes = json_decode($row['learningOutcomes'], true);
    if ($isBanned == '1'){
        throw new Exception("Activity has been banned.");
    }

    $contentTable = [
    "type"=>$type,
    "label"=>$label,
    "isBanned"=>$isBanned,
    "isAssigned"=>$isAssigned,
    "userCanViewSource"=>$userCanViewSource,
    "isGloballyAssigned"=>$isGloballyAssigned,
    "isPublic"=>$isPublic,
    "imagePath"=>$imagePath,
    "content"=>$json['content'],
    "isSinglePage"=>$json['isSinglePage'],
    "isPublic"=>$isPublic,
    "version"=>$json['version'],
    "learningOutcomes"=>$learningOutcomes,
    ];

    }else{
        throw new Exception("Activity not found.");
    }

    //Try to add on the activity table settings
    $assignmentTable = [];

    $sql = "SELECT
    a.assignedDate AS assignedDate,
    a.dueDate AS dueDate,
    a.pinnedAfterDate As pinnedAfterDate,
    a.pinnedUntilDate As pinnedUntilDate,
    a.timeLimit AS timeLimit,
    a.numberOfAttemptsAllowed AS numberOfAttemptsAllowed,
    a.attemptAggregation AS attemptAggregation,
    a.totalPointsOrPercent AS totalPointsOrPercent,
    a.gradeCategory AS gradeCategory,
    a.individualize AS individualize,
    a.showSolution AS showSolution,
    a.showSolutionInGradebook AS showSolutionInGradebook,
    a.showFeedback AS showFeedback,
    a.showHints AS showHints,
    a.showCorrectness AS showCorrectness,
    a.showCreditAchievedMenu AS showCreditAchievedMenu,
    a.paginate AS paginate,
    a.showFinishButton AS showFinishButton,
    a.proctorMakesAvailable AS proctorMakesAvailable,
    a.autoSubmit AS autoSubmit,
    a.canViewAfterCompleted AS canViewAfterCompleted,
    a.doenetId AS doenetId
    FROM assignment AS a
    WHERE a.doenetId = '$doenetId' 
    ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0){
        $row = $result->fetch_assoc();

        $assignmentTable = array(
            "has_assignment_table" => true,
            "assignment_title" => $row['assignment_title'],
            "assignedDate" => $row['assignedDate'],
            "pinnedAfterDate" => $row['pinnedAfterDate'],
            "pinnedUntilDate" => $row['pinnedUntilDate'],
            "dueDate" => $row['dueDate'],
            "timeLimit" => $row['timeLimit'],
            "numberOfAttemptsAllowed" => $row['numberOfAttemptsAllowed'],
            "attemptAggregation" => $row['attemptAggregation'],
            "totalPointsOrPercent" => $row['totalPointsOrPercent'],
            "gradeCategory" => $row['gradeCategory'],
            "individualize" => $row['individualize'],
            "showSolution" => $row['showSolution'],
            "showSolutionInGradebook" => $row['showSolutionInGradebook'],
            "showFeedback" => $row['showFeedback'],
            "showHints" => $row['showHints'],
            "showCorrectness" => $row['showCorrectness'],
            "showCreditAchievedMenu" => $row['showCreditAchievedMenu'],
            "paginate" => $row['paginate'],
            "showFinishButton" => $row['showFinishButton'],
            "proctorMakesAvailable" => $row['proctorMakesAvailable'],
            "autoSubmit" => $row['autoSubmit'],
            "canViewAfterCompleted" => $row['canViewAfterCompleted'],
            "doenetId" => $row['doenetId']
        );
    }else{
    $assignmentTable = array(
    "has_assignment_table" => false,
    );
  }

  $activity = array_merge($contentTable,$assignmentTable);
  $activity['pageLabel'] = $pageLabel;

    $response_arr = [
        'success' => true,
        "activity"=>$activity,
        "courseId"=>$courseId,

    ];
    // set response code - 200 OK
    http_response_code(200);

} catch (Exception $e) {
    $response_arr = [
        'success' => false,
        'message' => $e->getMessage(),
    ];
    http_response_code(400);

} finally {
    // make it json format
    echo json_encode($response_arr);
    $conn->close();
}
?>