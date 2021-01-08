<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$contentId = mysqli_real_escape_string($conn,$_REQUEST["contentId"]);
$branchId = mysqli_real_escape_string($conn,$_REQUEST["branchId"]);
$itemId = mysqli_real_escape_string($conn,$_REQUEST["itemId"]);

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
	WHERE branchId = '$branchId' and itemId = '$itemId'
	AND draft = 0
	ORDER BY timestamp ASC
	";
		$content_id_array = array();
	$result = $conn->query($sql);
	if ($result->num_rows < 1){
		$response_arr = array(
			"success" => 0,
			"doenetML" => "",
			"reason" => "No Matching Content",
	);
	}else{
		while ($row = $result->fetch_assoc()){
			$contentId =$row["contentId"];
			
			array_push($content_id_array,$row["contentId"]);
		}
	} //This in the right spot?

	//SECURITY
	//1 - test if branch is public
	$sql = "SELECT public
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
		$public = $row['public'];
		if ($public == "0"){
		//Assume they should NOT have access
		$should_have_access = FALSE;

			//SECURITY 2
			//Test if they are part of a repo
			$sql = "SELECT ra.userId as userId
			FROM folder_content AS fc
			LEFT JOIN repo_access AS ra
			ON fc.rootId = ra.repoId
			WHERE fc.childId = '$branchId' 
			AND ra.userId = '3oN5gDY3392zexHopijG6'
			";

			$result = $conn->query($sql);
				if ($result->num_rows > 0){
				$should_have_access = TRUE;
			}else{
				//SECURITY 3
				//TEST if the branch is not in a repo and is user's
				$sql = "
				SELECT userId 
			FROM user_content
			WHERE userId = '3oN5gDY3392zexHopijG6'
			AND branchId = '$branchId'
			";
				$result = $conn->query($sql);
				if ($result->num_rows > 0){
					$should_have_access = TRUE;
				}
			}
		}
	
   if ($should_have_access){

	if ($contentId == ""){

		//load draft version because contentid was not specified
		$sql = "SELECT doenetML,title, timestamp
		FROM content
		WHERE branchId = '$branchId' and itemId='$itemId'
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
		WHERE contentId = '$contentId' and itemId='$itemId'
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

