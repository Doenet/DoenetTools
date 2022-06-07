<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
// include "permissionsAndSettingsForOneCourseFunction.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";
$events = [];

$doenetIds = array_map(function($item) use($conn) {
  return mysqli_real_escape_string($conn, $item);
}, $_REQUEST["doenetId"]);


// $_POST = json_decode(file_get_contents("php://input"),true);

// if (!array_key_exists('doenetIds', $_POST)) {
// 	$success = false;
// 	$message = "Internal Error: missing doenetIds";
// }

// if ($success){
// 	$doenetIds = array_map(function ($item) use ($conn) {
// 		return mysqli_real_escape_string($conn, $item);
// 	}, $_POST["doenetIds"]);
// }



// //TODO: future permission system
// // if ($success){

// // $permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
// //   if ($permissions["canEditContent"] != '1'){
// //     $success = FALSE;
// //     $message = "You need permission to edit content.";
// //   }
// // }


if ($success){

	$sql_doenetIds = implode("','", $doenetIds);
	$sql_doenetIds = "'" . $sql_doenetIds . "'";

	$sql = "
	SELECT userId,
	verb,
	doenetId,
	activityCid,
	pageCid,
	pageNumber,
	attemptNumber,
	variantIndex,
	object,
	context,
	result,
	timestamp,
	version,
	deviceName,
	valid
	FROM event
	WHERE doenetId IN ($sql_doenetIds)
	";

		$result = $conn->query($sql);
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()){
				array_push($events,array(
					"userId"=>$row['userId'],
					"verb"=>$row['verb'],
					"doenetId"=>$row['doenetId'],
					"activityCid"=>$row['activityCid'],
					"pageCid"=>$row['pageCid'],
					"pageNumber"=>$row['pageNumber'],
					"attemptNumber"=>$row['attemptNumber'],
					"variantIndex"=>$row['variantIndex'],
					"object"=>$row['object'],
					"context"=>$row['context'],
					"result"=>$row['result'],
					"timestamp"=>$row['timestamp'],
					"version"=>$row['version'],
					"deviceName"=>$row['deviceName'],
					"valid"=>$row['valid'],
				));
			}
		}
		
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
	"events"=>$events,
  );

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>