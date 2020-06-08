<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$contentId =  mysqli_real_escape_string($conn,$_REQUEST["contentId"]);

if ($contentId == ""){
	$response_arr = array(
		"success" => 0,
		"doenetML" => "",
		);
}else{
		//load contentId match version
		$sql = "SELECT doenetML,title, timestamp
		FROM content
		WHERE contentId = '$contentId'
		AND public = 1
		";
		$result = $conn->query($sql);
		if ($result->num_rows < 1){
			$response_arr = array(
				"success" => 0,
				"doenetML" => "",
				);
		}else{
			$row = $result->fetch_assoc();
			$doenetML = $row["doenetML"];
			$title = $row["title"];
		
		
			$response_arr = array(
				"success" => 1,
				"doenetML" => $doenetML,
				"title"=>$title,
				"contentIds"=>$content_id_array
				);
		}
	
	}
	
 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

