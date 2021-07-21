<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);
$driveId = mysqli_real_escape_string($conn,$_POST["driveId"]);
$mergeHeads = array_map(function($doenetId) use($conn) {
return mysqli_real_escape_string($conn, $doenetId);
}, $_POST['mergeHeads']);
$mergeId = array_map(function($doenetId) use($conn) {
	return mysqli_real_escape_string($conn, $doenetId);
}, $_POST['mergeId']);
$mergeFirstName = array_map(function($doenetId) use($conn) {
	return mysqli_real_escape_string($conn, $doenetId);
}, $_POST['mergeFirstName']);
$mergeLastName = array_map(function($doenetId) use($conn) {
	return mysqli_real_escape_string($conn, $doenetId);
}, $_POST['mergeLastName']);
$mergeEmail = array_map(function($doenetId) use($conn) {
	return mysqli_real_escape_string($conn, $doenetId);
}, $_POST['mergeEmail']);
$mergeSection = array_map(function($doenetId) use($conn) {
	return mysqli_real_escape_string($conn, $doenetId);
}, $_POST['mergeSection']);
$mergeDropped = array_map(function($doenetId) use($conn) {
	return mysqli_real_escape_string($conn, $doenetId);
}, $_POST['mergeDropped']);
$userIds = array_map(function($doenetId) use($conn) {
	return mysqli_real_escape_string($conn, $doenetId);
}, $_POST['userIds']);


//Get existing ID's and emails
$sql = "
SELECT email,
empId
FROM enrollment
WHERE driveId = '$driveId'
";
$result = $conn->query($sql);
$db_emails = array();
$db_empids = array();
while ($row = $result->fetch_assoc()){
array_push($db_emails,$row['email']);
array_push($db_empids,$row['empId']);
}

$dataLength = count($mergeId);
if ($dataLength == 0){$dataLength = count($mergeEmail);}
//Insert or Update records
for($i = 0; $i < $dataLength; $i++){
$id = "0";
$firstName = "";
$lastName = "";
$email = "";
$section = "";
$withdrew = "0";
if (in_array("id",$mergeHeads,false)){ $id = $mergeId[$i]; }
if (in_array("firstName",$mergeHeads,false)){ $firstName = $mergeFirstName[$i]; }
if (in_array("lastName",$mergeHeads,false)){ $lastName = $mergeLastName[$i]; }
if (in_array("email",$mergeHeads,false)){ $email = $mergeEmail[$i]; }
if (in_array("section",$mergeHeads,false)){ $section = $mergeSection[$i]; }
if (in_array("dropped",$mergeHeads,false) &&
$mergeDropped[$i] == "Dropped"	){ $withdrew = "1"; }

if (($id != "0" && in_array($id,$db_empids,FALSE)) || in_array($email,$db_emails,FALSE)){
	//UPDATE
	$update_columns = "";
	if ($firstName != ""){ $update_columns = $update_columns . "firstName = '$firstName',";}
	if ($lastName != ""){ $update_columns = $update_columns . "lastName = '$lastName',";}
	if ($email != ""){ $update_columns = $update_columns . "email = '$email',";}
	if ($section != ""){ $update_columns = $update_columns . "section = '$section',";}
	$update_columns = rtrim($update_columns, ", "); //REMOVE trailing comma
	if ($email == ""){
		$sql = "UPDATE enrollment
		SET
		$update_columns
		WHERE
		driveId= '$driveId'
		AND empId = '$id'";
	}else{
		$sql = "UPDATE enrollment
		SET
		$update_columns
		WHERE
		driveId = '$driveId'
		AND email = '$email'";
	}

	$result = $conn->query($sql);

}else{
	//INSERT
	$userId = $userIds[$i];

	$sql = "
	INSERT INTO enrollment
	(driveId,userId,firstName,lastName,email,empId,dateEnrolled,section)
	VALUES
	('$driveId','$userId','$firstName','$lastName','$email','$id',NOW(),'$section')
	";
	$result = $conn->query($sql);

	$sql = "
	INSERT INTO drive_user
	(userId,
	driveId,
	canViewDrive, 
	canDeleteDrive, 
	canShareDrive,
	canAddItemsAndFolders,
	canDeleteItemsAndFolders,
	canMoveItemsAndFolders,
	canRenameItemsAndFolders,
	canPublishItemsAndFolders,
	canViewUnreleasedItemsAndFolders,
	canViewUnassignedItemsAndFolders,
	canChangeAllDriveSettings,
	role)
	VALUES
	('$userId','$driveId','1','0','0','0','0','0','0','0','0','0','0','Student')
	";
	$result = $conn->query($sql);
	$sql = "
	INSERT INTO user
	(userId,
	screenName,
	email, 
	studentId, 
	lastName,
	firstName,
	profilePicture,
	trackingConsent,
	roleStudent,
	roleInstructor)
	VALUES
	('$userId','NULL','$email','NULL','$lastName','$firstName','quokka','1','1','0')
	";
	$result = $conn->query($sql);
}
}

//Get all records for JS

$sql = "
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
 echo json_encode($response_arr);

$conn->close();

?>

