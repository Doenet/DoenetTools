<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
// include "permissionsAndSettingsForOneCourseFunction.php";
$jwtArray = include "jwtArray.php";
// $userId = $jwtArray['userId'];

$success = TRUE;
$message = "";
$events = [];

$doenetIds = array_map(function($item) use($conn) {
  return mysqli_real_escape_string($conn, $item);
}, $_REQUEST["doenetId"]);

$secretCodeRecieved = mysqli_real_escape_string($conn,$_REQUEST["secretCode"]);

//In the last five minutes only
$sql = "
SELECT `timestamp`
FROM eventSecretCodes
WHERE secretCode = '$secretCodeRecieved'
AND timestamp >= NOW() - INTERVAL 5 MINUTE
";
$result = $conn->query($sql);


$secretCodeMatches = 0;
if ($result->num_rows > 0) {
	$secretCodeMatches = 1;
}

//Keep the eventSecretCodes table small
$sql = "
DELETE FROM eventSecretCodes
WHERE timestamp <= NOW() - INTERVAL 5 MINUTE
";
$result = $conn->query($sql);

//Temporary log
$joined_doenetIds = implode(",", $doenetIds);
$sql = "
INSERT INTO temp_log
(doenetIds,secretCodeMatches,secretCodeRecieved,timestamp)
VALUES
('$joined_doenetIds','$secretCodeMatches','$secretCodeRecieved',NOW())
";
$conn->query($sql);
//End Temporary log

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
	pageVariantIndex,
	activityVariantIndex,
	object,
	context,
	result,
	timestamp,
	version
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
					"pageVariantIndex"=>$row['pageVariantIndex'],
					"activityVariantIndex"=>$row['activityVariantIndex'],
					"object"=>$row['object'],
					"context"=>$row['context'],
					"result"=>$row['result'],
					"timestamp"=>$row['timestamp'],
					"version"=>$row['version'],
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