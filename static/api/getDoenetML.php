<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$emailaddress = $jwtArray['email'];

$contentId = mysqli_real_escape_string($conn,$_REQUEST["contentId"]);
$branchId = mysqli_real_escape_string($conn,$_REQUEST["branchId"]);

//Test if didn't request with a branchId
if ($branchId == ""){
	$response_arr = array(
		"success" => 0,
		"doenetML" => "",
		"reason" => "No BranchId",
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
			"reason" => "No Matching Content",
	);
	}else{
		$content_id_array = array();
		while ($row = $result->fetch_assoc()){
			
			array_push($content_id_array,$row["contentId"]);
		}
	} //This in the right spot?

	//SECURITY
	//1 - test if branch is public
	$sql = "SELECT private
	FROM content_branch
	WHERE branchId = '$branchId'
	AND removedFlag = '0'
	";
	$result = $conn->query($sql);
	if ($result->num_rows < 1){
		//Branch doesn't exist
		$response_arr = array(
			"success" => 0,
			"doenetML" => "",
			"reason" => "No Matching Content",
		);
	}else{

		//Assume they should have access
		$should_have_access = TRUE;
		$row = $result->fetch_assoc();
		$private = $row['private'];

		if ($private == "1"){
		//Assume they should NOT have access
		$should_have_access = FALSE;

			//SECURITY 2
			//Test if they are part of a repo
			$sql = "SELECT ra.username
			FROM content_branch AS cb
			LEFT JOIN folder_content AS fc
			ON fc.childId = cb.branchId
			LEFT JOIN repo_access AS ra
			ON fc.rootId = ra.repoId
			WHERE cb.branchId = '$branchId' 
			AND cb.removedFlag = '0'
			AND ra.username = '$emailaddress'
			";
			$result = $conn->query($sql);
			if ($result->num_rows > 0){
				$should_have_access = TRUE;
			}
		}
	
   if ($should_have_access){


	if ($contentId == ""){

		//load draft version because contentid was not specified
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

		 }else{
		//Shouldn't have access
		$response_arr = array(
			"success" => 0,
			"doenetML" => "",
			);
	 }
	
}

}

	



	
	
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

