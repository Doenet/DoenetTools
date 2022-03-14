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
	//Can the user edit content?
	//Yes then all items and json
	//No then no Recipies, no banks and no unused files
	if ($canEditContent == '1'){
		$sql = "
		SELECT contentType,
		doenetId,
		cid,
		parentDoenetId,
		label,
		creationDate,
		isAssigned,
		isGloballyAssigned,
		isPublic,
		CAST(jsonDefinition as CHAR) AS json
		FROM course_content
		WHERE courseId='$courseId'
		AND isDeleted = '0'
		ORDER BY sortOrder
		";

		$result = $conn->query($sql);
		$items = [];
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()){
				$item = array(
					"contentType"=>$row['contentType'],
					"doenetId"=>$row['doenetId'],
					"cid"=>$row['cid'],
					"parentDoenetId"=>$row['parentDoenetId'],
					"label"=>$row['label'],
					"creationDate"=>$row['creationDate'],
					"isDeleted"=>$row['isDeleted'],
					"isAssigned"=>$row['isAssigned'],
					"isGloballyAssigned"=>$row['isGloballyAssigned'],
					"isPublic"=>$row['isPublic'],
				);
				
				$json = json_decode($row['json'],true);
				// var_dump($json);
				$item = array_merge($json,$item);
				
				if ($item['contentType'] == 'Section'){
					$item['isOpen'] = false;
				}
				array_push($items,$item);
			}
		}

	}else{

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

