<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";



// if (array_key_exists('driveId', get_defined_vars())) {
$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);

if ($courseId == "") {
	$success = false;
	$message = "Internal Error: missing courseId";
}

if ($success){
$sql = "
SELECT canEditContent
FROM course_user
WHERE courseId='$courseId'
AND userId='$userId'
";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
	$row = $result->fetch_assoc();
	$canEditContent = $row['canEditContent'];
}
$containingDoenetIds = [];
	//Can the user edit content?
	//Yes then all items and json
	//No then no Recipies, no banks and no unused files
	if ($canEditContent == '1'){
		$sql = "
		SELECT cc.type,
		cc.doenetId,
		cc.cid,
		cc.parentDoenetId,
		cc.label,
		cc.creationDate,
		cc.isAssigned,
		cc.isGloballyAssigned,
		cc.isPublic,
		CAST(cc.jsonDefinition as CHAR) AS json,
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
		a.proctorMakesAvailable AS proctorMakesAvailable
		FROM course_content AS cc
		LEFT JOIN assignment AS a
		ON a.doenetId = cc.doenetId
		WHERE cc.courseId='$courseId'
		AND cc.isDeleted = '0'
		ORDER BY cc.sortOrder
		";

		$result = $conn->query($sql);
		$items = [];
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()){
				$item = array(
					"doenetId"=>$row['doenetId'],
					"type"=>$row['type'],
					"parentDoenetId"=>$row['parentDoenetId'],
					"label"=>$row['label'],
					"creationDate"=>$row['creationDate'],
					"isAssigned"=>$row['isAssigned'] == '1' ? true : false,
					"isGloballyAssigned"=>$row['isGloballyAssigned'] == '1' ? true : false,
					"isPublic"=>$row['isPublic'] == '1' ? true : false,
					"assignedDate" => $row['assignedDate'],
          "pinnedAfterDate" => $row['pinnedAfterDate'],
          "pinnedUntilDate" => $row['pinnedUntilDate'],
          "dueDate" => $row['dueDate'],
          "timeLimit" => $row['timeLimit'],
          "numberOfAttemptsAllowed" => $row['numberOfAttemptsAllowed'],
          "attemptAggregation" => $row['attemptAggregation'],
          "totalPointsOrPercent" => $row['totalPointsOrPercent'],
          "gradeCategory" => $row['gradeCategory'],
          "individualize" => $row['individualize'] == '1' ? true : false,
          "showSolution" => $row['showSolution'] == '1' ? true : false,
          "showSolutionInGradebook" => $row['showSolutionInGradebook'] == '1' ? true : false,
          "showFeedback" => $row['showFeedback'] == '1' ? true : false,
          "showHints" => $row['showHints'] == '1' ? true : false,
          "showCorrectness" => $row['showCorrectness'] == '1' ? true : false,
          "showCreditAchievedMenu" => $row['showCreditAchievedMenu'] == '1' ? true : false,
          "proctorMakesAvailable" => $row['proctorMakesAvailable'] == '1' ? true : false,
				);

				if ($row['type'] == 'activity' || $row['type'] == 'bank'){
					array_push($containingDoenetIds,$row['doenetId']);
				}
				
				$json = json_decode($row['json'],true);
				// var_dump($json);
				$item = array_merge($json,$item);
				

				$item['isOpen'] = false; 
				$item['isSelected'] = false;

				array_push($items,$item);
			}
			foreach($containingDoenetIds as $containingDoenetId){
				$sql = "
				SELECT 
				doenetId,
				containingDoenetId,
				label
				FROM pages
				WHERE containingDoenetId = '$containingDoenetId'
				AND isDeleted = '0'
				";
				$result = $conn->query($sql);
				if ($result->num_rows > 0) {
					while($row = $result->fetch_assoc()){
						$item = array(
							"type"=>"page",
							"doenetId"=>$row['doenetId'],
							"containingDoenetId"=>$row['containingDoenetId'],
							"label"=>$row['label']
						);
						$item['isSelected'] = false; //Note: no isOpen
						array_push($items,$item);

					}
				}

			}
		}

	}else{
		//TODO: student can't edit version
	}
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
	"items"=>$items,
  );

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>