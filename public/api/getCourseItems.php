<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";
include_once './models/baseModel.php';

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$response_arr = [];
try {
	Base_Model::checkForRequiredInputs($_REQUEST, ["courseId"]);

	// if (array_key_exists('driveId', get_defined_vars())) {
	$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);

	$permissions = permissionsAndSettingsForOneCourseFunction( $conn, $userId, $courseId );

	$containingDoenetIds = [];
	$activityDoenetIds = [];
	//Can the user View Unassigned Content?
	if ($permissions["canViewUnassignedContent"] == '1'){
		//Yes then all items and json
		$rows = Base_Model::queryFetchAssoc($conn, 
		"
			SELECT * from assignment_detail
			WHERE courseId='$courseId'
		");
		//TODO: Emilio and Kevin Discuss default behavior on undefine server keys

		$items = [];
        foreach($rows as $row) {
			$item = $row;

			if ($row['type'] == 'activity' || $row['type'] == 'bank'){
				array_push($containingDoenetIds,$row['doenetId']);
			}
			if ($row['type'] == 'activity' ){
				array_push($activityDoenetIds,$row['doenetId']);
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
		//page links
		foreach($activityDoenetIds as $activityDoenetId){
			$sql = "
			SELECT 
			doenetId,
			containingDoenetId,
			parentDoenetId,
			sourceCollectionDoenetId,
			sourcePageDoenetId,
			timeOfLastUpdate,
			label
			FROM link_pages
			WHERE containingDoenetId = '$activityDoenetId'
			";
			$result = $conn->query($sql);
			if ($result->num_rows > 0) {
				while($row = $result->fetch_assoc()){
					$item = array(
						"type"=>"pageLink",
						"doenetId"=>$row['doenetId'],
						"containingDoenetId"=>$row['containingDoenetId'],
						"parentDoenetId"=>$row['parentDoenetId'],
						"sourceCollectionDoenetId"=>$row['sourceCollectionDoenetId'],
						"sourcePageDoenetId"=>$row['sourcePageDoenetId'],
						"timeOfLastUpdate"=>$row['timeOfLastUpdate'],
						"label"=>$row['label']
					);
					$item['isSelected'] = false; //Note: no isOpen
					array_push($items,$item);

				}
			}
		}

	}else if($permissions != false){
		//TODO: check that user is in the course

		$sql = "
			SELECT * from assigned_assignment_detail
			WHERE courseId='$courseId'
			AND userId = '$userId'
		";

		$items = [];
        foreach($rows as $row) {
			$item = $row;
				
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
	}else{
		throw new Exception("You need permission to access this course.");
	}
 	http_response_code(200);
	$response_arr = array(
		"success" => true,
		"items" => $items
	);
} catch (Exception $ex) {
	// TODO - make this return error codes when the client is confirmed to have error handling code
 	//http_response_code(400);
 	http_response_code(200);
	$response_arr = array(
		"success"=>false,
		"message"=>$ex->getMessage()
	);
} finally {
	// make it json format
	echo json_encode($response_arr);

	$conn->close();
}
?>