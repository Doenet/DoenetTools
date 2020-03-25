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

	//load contentId match version
	$sql = "
	SELECT
	t.teamName AS teamName,
	tm.fullName AS fullName,
	tm.userName AS userName
	FROM team_members AS tm 
	LEFT JOIN team AS t
	ON t.teamId = tm.teamId
	WHERE t.teamId IN (SELECT teamId FROM team_members WHERE userName = '$remoteuser')
	ORDER BY t.teamName,tm.fullName

	";
	$result = $conn->query($sql);
	$rosters = array();
	$teamNames = array();
	while($row = $result->fetch_assoc()){
		
		$teamName = $row["teamName"];
		$fullName = $row["fullName"];
		$userName = $row["userName"];

		if ($previous_teamName != $teamName){
			array_push($teamNames,$teamName);
			$rosters[$teamName] = [];
			

		}
		array_push($rosters[$teamName],[
			'fullName'=>$fullName,
			'userName'=>$userName
			]);
    $previous_teamName = $teamName;
	}
	

		$response_arr = array(
			"success" => 1,
			"teamNames" => $teamNames,
			"rosters" => $rosters
			);
	}
	
         
 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

