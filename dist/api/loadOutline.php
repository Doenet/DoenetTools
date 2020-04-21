<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
//Base level so just find the last sortOrder and increment by 100
$sql = "
SELECT a.assignmentId AS assignmentId,
a.assignmentName AS assignmentName,
a.contentId AS contentId, 
a.sourceBranchId AS sourceBranchId,
a.assignedDate AS assignedDate,
a.dueDate AS dueDate,
a.timeLimit AS timeLimit,
a.numberOfAttemptsAllowed AS numberOfAttemptsAllowed,
a.totalPointsOrPercent AS totalPointsOrPercent,
a.gradeCategory AS gradeCategory,
a.individualize AS individualize,
a.multipleAttempts AS multipleAttempts,
a.showSolution AS showSolution,
a.showFeedback AS showFeedback,
a.showHints AS showHints,
a.showCorrectness AS showCorrectness,
a.proctorMakesAvailable AS proctorMakesAvailable,
ch.courseHeadingId AS courseHeadingId,
ch.headingText AS headingText,
ch.headingLevel AS headingLevel,
c.doenetML AS doenetML,
ua.dueDateOverride AS dueDateOverride,
ua.credit AS credit,
ua.timeLimitOverride AS timeLimitOverride,
ua.numberOfAttemptsAllowedOverride AS numberOfAttemptsAllowedOverride,
uaa.attemptNumber AS attemptNumber,
uaa.assignedVariant AS assignedVariant,
uaa.generatedVariant AS generatedVariant,
uaa.latestDocumentState AS latestDocumentState
FROM course_heading AS ch
LEFT JOIN assignment AS a
ON ch.courseHeadingId = a.courseHeadingId
AND a.proctorMakesAvailable = 0
LEFT JOIN content_branch AS c
ON c.branchId = a.sourceBranchId
LEFT JOIN user_assignment AS ua
ON ua.assignmentId = a.assignmentId AND ua.username = '$remoteuser'
LEFT JOIN user_assignment_attempt AS uaa
ON uaa.assignmentId = a.assignmentId AND uaa.username = '$remoteuser' AND uaa.attemptNumber = (SELECT MAX(attemptNumber) as attemptNumber FROM user_assignment_attempt WHERE assignmentId=a.assignmentId and username='$remoteuser')
WHERE ch.courseId = '$courseId' 
ORDER BY ch.sortOrder,a.sortOrder
";
$result = $conn->query($sql);

$response_arr = array();
$heading_arr = array();
$headingLevel_arr = array();
$headingId_arr = array();
$assignments_arr = array();
         
if ($result->num_rows > 0){
    while($row = $result->fetch_assoc()){ 
	if ($row["assignmentId"] != ""){
	if (!isset($assignments_arr[$row["courseHeadingId"]])){
	$assignments_arr[$row["courseHeadingId"]] = array();
	}
	array_push($assignments_arr[$row["courseHeadingId"]],
	array(
	"assignmentName" => $row["assignmentName"],
	"courseHeadingId" => $row["courseHeadingId"],
	"assignmentId" => $row["assignmentId"],
	"contentId" => $row["contentId"],
	"sourceBranchId" => $row["sourceBranchId"],
	"assignedDate" => $row["assignedDate"],
	"dueDate" => $row["dueDate"],
	"timeLimit" => $row["timeLimit"],
	"numberOfAttemptsAllowed" => $row["numberOfAttemptsAllowed"],
	"gradeCategory" => $row["gradeCategory"],
	"doenetML" => $row["doenetML"],
	"dueDateOverride" => $row["dueDateOverride"],
	"timeLimitOverride" => $row["timeLimitOverride"],
	"numberOfAttemptsAllowedOverride" => $row["numberOfAttemptsAllowedOverride"],
	"attemptNumber" => $row["attemptNumber"],
	"assignedVariant" => $row["assignedVariant"],
	"generatedVariant" => $row["generatedVariant"],
	"credit" => $row["credit"],
	"totalPointsOrPercent" => $row["totalPointsOrPercent"],
	"individualize" => $row["individualize"],
	"multipleAttempts" => $row["multipleAttempts"],
	"showSolution" => $row["showSolution"],
	"showFeedback" => $row["showFeedback"],
	"showHints" => $row["showHints"],
	"showCorrectness" => $row["showCorrectness"],
	"proctorMakesAvailable" => $row["proctorMakesAvailable"],
	"latestDocumentState" => $row["latestDocumentState"]
	)
	);
	}

	if ($prev_headingId != $row["courseHeadingId"]){
        array_push($heading_arr,$row["headingText"]);
        array_push($headingLevel_arr,$row["headingLevel"]);
	array_push($headingId_arr,$row["courseHeadingId"]); } $prev_headingId = $row["courseHeadingId"]; } } 
 // set response code - 200 OK

$response_arr = array(
"headingText" => $heading_arr,
"headingLevel" => $headingLevel_arr,
"headingId" => $headingId_arr,
"assignments" => $assignments_arr,
);

 http_response_code(200);

 // make it json format
 //echo json_encode($heading_arr);
// echo json_encode($response_arr);
 echo json_encode($response_arr);

$conn->close();

?>

