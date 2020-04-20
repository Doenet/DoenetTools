<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

//prerelease security
$sql = "SELECT accessAllowed FROM user WHERE username='$remoteuser'";
$result = $conn->query($sql); 
$row = $result->fetch_assoc();
if ($row["accessAllowed"] != 1){
	$response_arr = array(
		"access"=> FALSE
	);
} else {


$contentId =  mysqli_real_escape_string($conn,$_REQUEST["contentId"]);
$branchId =  mysqli_real_escape_string($conn,$_REQUEST["branchId"]);



if ($contentId == "" && $branchId == ""){
	$response_arr = array(
		"success" => 0,
		"doenetML" => "",
		);
}else{
	//Find all the published contentIds
	$sql = "SELECT contentId
	FROM content
	WHERE branchId = '$branchId'
	AND draft = 0
	ORDER BY timestamp ASC
	";
	$result = $conn->query($sql);
	if ($result->num_rows < 1){
		$response_arr = array(
			"success" => 0,
			"doenetML" => "",
			);
	}else{
		$content_id_array = array();
		while ($row = $result->fetch_assoc()){
			
			array_push($content_id_array,$row["contentId"]);
		}
	}
	if ($contentId == ""){
		//load draft version
		$sql = "SELECT doenetML,title, timestamp
		FROM content
		WHERE branchId = '$branchId'
		AND draft = 1
		";
		$result = $conn->query($sql);
		$row = $result->fetch_assoc();
		$doenetML = $row["doenetML"];
		$title = $row["title"];
	
			$response_arr = array(
				"success" => 1,
				"doenetML" => $doenetML,
				"title"=>$title,
				"contentIds"=>$content_id_array
				);
	}else{
		//load contentId match version
		$sql = "SELECT doenetML,title, timestamp
		FROM content
		WHERE contentId = '$contentId'
		AND draft = 0
		";
		$result = $conn->query($sql);
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

	



	
	
         
}
 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

