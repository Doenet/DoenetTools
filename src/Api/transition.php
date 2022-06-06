<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$id_and_json_array = [];

// SELECT id, CAST(JSON_EXTRACT(jsonDefinition->'$.order', '$.content') as CHAR) AS json

$sql = "
SELECT id, CAST(jsonDefinition as CHAR) AS json
FROM course_content
WHERE type = 'activity'
ORDER BY id
";
$result = $conn->query($sql);
while($row = $result->fetch_assoc()){
	array_push($id_and_json_array,array(
		"id" => $row['id'],
		"json" => $row['json']
	));
}

foreach($id_and_json_array as $id_and_json){
	$id = $id_and_json['id'];
	$json = $id_and_json['json'];
	$jsonArray = json_decode($json,true);
	$contentArray = $jsonArray['order']['content'];
	unset($jsonArray['order']);
	$jsonArray['content'] = $contentArray;
	$newJSON = json_encode($jsonArray);

	echo "•id $id";
	if ($contentArray == ""){
		echo " no order in json found! \n";
	}else{
		$sql = "
		UPDATE course_content
		SET jsonDefinition=JSON_MERGE('{}','$newJSON') 
		WHERE id = '$id'
		";
		$result = $conn->query($sql);
		echo " done \n";
	}
}


 http_response_code(200);



$conn->close();

?>