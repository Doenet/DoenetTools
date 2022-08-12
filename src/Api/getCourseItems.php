<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";

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
	$permissions = permissionsAndSettingsForOneCourseFunction( $conn, $userId, $courseId );

function nullishCoalesce(&$value, $default) {
	return isset($value) ? $value : $default;
}

$containingDoenetIds = [];
	//Can the user edit content?
	if ($permissions["canEditContent"] == '1'){
		//Yes then all items and json
		$sql = "
		SELECT cc.type,
		cc.doenetId,
		cc.parentDoenetId,
		cc.label,
		cc.creationDate,
		cc.isAssigned,
		cc.isGloballyAssigned,
		cc.isPublic,
		cc.userCanViewSource,
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
		a.paginate AS paginate,
		a.proctorMakesAvailable AS proctorMakesAvailable
		FROM course_content AS cc
		LEFT JOIN assignment AS a
		ON a.doenetId = cc.doenetId
		WHERE cc.courseId='$courseId'
		AND cc.isDeleted = '0'
		ORDER BY cc.sortOrder
		";

		//TODO: Emilio and Kevin Discuss default behavior on undefine server keys
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
					"userCanViewSource"=>$row['userCanViewSource'] == '1' ? true : false,
					"assignedDate" => $row['assignedDate'],
          "pinnedAfterDate" => $row['pinnedAfterDate'],
          "pinnedUntilDate" => $row['pinnedUntilDate'],
          "dueDate" => $row['dueDate'],
          "timeLimit" => $row['timeLimit'],
          "numberOfAttemptsAllowed" => $row['numberOfAttemptsAllowed'],
          "attemptAggregation" => $row['attemptAggregation'],
          "totalPointsOrPercent" => $row['totalPointsOrPercent'],
          "gradeCategory" => $row['gradeCategory'],
          "individualize" => nullishCoalesce($row['individualize'], "0") == '1' ? true : false,
          "showSolution" => nullishCoalesce($row['showSolution'], "1") == '1' ? true : false,
          "showSolutionInGradebook" => nullishCoalesce($row['showSolutionInGradebook'], '1') == '1' ? true : false,
          "showFeedback" => nullishCoalesce($row['showFeedback'], '1') == '1' ? true : false,
          "showHints" => nullishCoalesce($row['showHints'], '1') == '1' ? true : false,
          "showCorrectness" => nullishCoalesce($row['showCorrectness'], '1') == '1' ? true : false,
          "showCreditAchievedMenu" => nullishCoalesce($row['showCreditAchievedMenu'], '1') == '1' ? true : false,
          "paginate" => nullishCoalesce($row['paginate'], '1') == '1' ? true : false,
          "proctorMakesAvailable" => nullishCoalesce($row['proctorMakesAvailable'], '0') == '1' ? true : false,
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

	}else if($permissions != false){
		//TODO: check that user can view content
		$sql = "
		SELECT cc.type,
		cc.doenetId,
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
		a.paginate AS paginate,
		a.proctorMakesAvailable AS proctorMakesAvailable
		FROM course_content AS cc
		LEFT JOIN assignment AS a
		ON a.doenetId = cc.doenetId
		LEFT JOIN user_assignment AS ua
		ON a.doenetId = ua.doenetId AND ua.userId = '$userId'
		WHERE cc.courseId='$courseId'
		AND cc.isDeleted = '0'
		AND cc.isAssigned=1
		AND (cc.type = 'activity' OR cc.type = 'section')
		AND (ua.isUnassigned = 0 OR cc.isGloballyAssigned = 1)
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
					"paginate" => $row['paginate'] == '1' ? true : false,
					"proctorMakesAvailable" => $row['proctorMakesAvailable'] == '1' ? true : false,
				);

				
				$json = json_decode($row['json'],true);
				// var_dump($json);
				$item = array_merge($json,$item);
				
				if ($row['type'] == 'activity'){
					array_push($containingDoenetIds,$row['doenetId']);
					unset($item['draftCid']);
				}
				
				$item['isOpen'] = false; 
				$item['isSelected'] = false;

				array_push($items,$item);
			}
			// foreach($containingDoenetIds as $containingDoenetId){
			// 	$sql = "
			// 	SELECT 
			// 	doenetId,
			// 	containingDoenetId,
			// 	label
			// 	FROM pages
			// 	WHERE containingDoenetId = '$containingDoenetId'
			// 	AND isDeleted = '0'
			// 	";
			// 	$result = $conn->query($sql);
			// 	if ($result->num_rows > 0) {
			// 		while($row = $result->fetch_assoc()){
			// 			$item = array(
			// 				"type"=>"page",
			// 				"doenetId"=>$row['doenetId'],
			// 				"containingDoenetId"=>$row['containingDoenetId'],
			// 				"label"=>$row['label']
			// 			);
			// 			$item['isSelected'] = false; //Note: no isOpen
			// 			array_push($items,$item);

			// 		}
			// 	}

			// }
		}
	}else{
		$success = false;
		$message = "You need permission to access this course.";
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