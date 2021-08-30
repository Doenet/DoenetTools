<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$allowed = false;

if (array_key_exists('driveId', get_defined_vars())) {
	$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
	//check user has permission to edit drive
	$sql = "
		SELECT canChangeAllDriveSettings
		FROM drive_user
		WHERE userId = '$userId'
		AND driveId = '$driveId'
	";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
		$row = $result->fetch_assoc();
		$allowed = $row['canChangeAllDriveSettings'];
		if (!$allowed) {
			http_response_code(403); //User if forbidden from operation
		}
	} else {
		//Fail because there is no DB row for the user on this drive so we shouldn't allow an add
		http_response_code(401); //User has bad auth
	}
} else {
	//bad driveId
	http_response_code(400);
}


if($allowed){$sql = "
SELECT userId,
firstName,
lastName,
email,
empId,
dateEnrolled,
section
FROM enrollment
WHERE withdrew = '0'
AND driveId = '$driveId'
ORDER BY firstName
";
$result = $conn->query($sql);

$enrollmentArray = array();
		while ($row = $result->fetch_assoc()){
			$learner = array(
				"userId"=>$row["userId"],
				"firstName"=>$row["firstName"],
				"lastName"=>$row["lastName"],
				"email"=>$row["email"],
				"empId"=>$row["empId"],
				"dateEnrolled"=>$row["dateEnrolled"],
				"section"=>$row["section"]
			);
			array_push($enrollmentArray,$learner);
		}
$response_arr = array(
	"success" => 1,
	"enrollmentArray" => $enrollmentArray,
);
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);}

$conn->close();

?>

