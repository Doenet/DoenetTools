<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$contentId =  mysqli_real_escape_string($conn,$_REQUEST["contentId"]);

echo "contentID is \n";
echo $contentId;
// invariant: contentId is always provided
$sql = "SELECT doenetML
		FROM content
		WHERE contentId = '$contentId'
		AND draft = 0
		";
		$result = $conn->query($sql);
		$row = $result->fetch_assoc();
		$doenetML = $row["doenetML"];
		// $title = $row["title"];
	
	
			$response_arr = array(
				"success" => 1,
				"doenetML" => $doenetML,
				// "title"=>$title,
				// "contentIds"=>$content_id_array
				);
echo "done PHP";
 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

