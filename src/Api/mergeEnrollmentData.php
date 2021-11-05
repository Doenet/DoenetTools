<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
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

$success = TRUE;
$message = "";

//TODO: Need a permission related to see grades (not du.canEditContent)
$sql = "
SELECT du.canEditContent 
FROM drive_user AS du
WHERE du.userId = '$userId'
AND du.driveId = '$driveId'
AND du.canEditContent = '1'
";
 
$result = $conn->query($sql);
if ($result->num_rows < 1) {
	$success = FALSE;
	$message = "No access granted for enrollment data.";
}

if ($success){
//Get existing ID's and emails
$sql = "
SELECT email
FROM enrollment
WHERE driveId = '$driveId'
";
$result = $conn->query($sql);
$db_emails = array();
while ($row = $result->fetch_assoc()){
	array_push($db_emails,$row['email']);
}

//Insert or Update records
for($i = 0; $i < count($mergeEmail); $i++){
	$id = "0";
	$firstName = "";
	$lastName = "";
	$email = "";
	$section = "";
	$new_userId = include "randomId.php";
	

	if (in_array("email",$mergeHeads,false)){ $email = $mergeEmail[$i]; }
	if (in_array("id",$mergeHeads,false)){ $id = $mergeId[$i]; }
	if (in_array("firstName",$mergeHeads,false)){ $firstName = $mergeFirstName[$i]; }
	if (in_array("lastName",$mergeHeads,false)){ $lastName = $mergeLastName[$i]; }
	if (in_array("section",$mergeHeads,false)){ $section = $mergeSection[$i]; }

	$isEmailInUserTable = FALSE;
	//Check if the email is already stored in user table
	$sql = "
	SELECT userId
	FROM user
	WHERE email = '$email'
	";
	$result = $conn->query($sql);
	if ($result->num_rows > 0) {
	$row = $result->fetch_assoc();
	$new_userId = $row['userId'];
	$isEmailInUserTable = TRUE;
}


	if (in_array($email,$db_emails,FALSE)){
		//Already in the database so update with new information
		$update_columns = "";
		if ($firstName != ""){ $update_columns = $update_columns . "firstName = '$firstName',";}
		if ($lastName != ""){ $update_columns = $update_columns . "lastName = '$lastName',";}
		if ($email != ""){ $update_columns = $update_columns . "email = '$email',";}
		if ($section != ""){ $update_columns = $update_columns . "section = '$section',";}
		$update_columns = rtrim($update_columns, ", "); //REMOVE trailing comma

		$sql = "UPDATE enrollment
		SET
		$update_columns
		WHERE
		driveId = '$driveId'
		AND email = '$email'";
		
		$result = $conn->query($sql);

	}else{
		//No previous record so INSERT
		$sql = "
		INSERT INTO enrollment
		(driveId,userId,firstName,lastName,email,empId,dateEnrolled,section)
		VALUES
		('$driveId','$new_userId','$firstName','$lastName','$email','$id',NOW(),'$section')
		";
		$result = $conn->query($sql);

		//Check if their email address is already in the drive_user table (from another role)
		$sql = "
		SELECT email
		FROM user AS u
		JOIN drive_user AS du
		ON du.userId = u.userId
		WHERE u.email = '$email'
		AND du.driveId = '$driveId'
		";
		$result = $conn->query($sql);

		if ($result->num_rows < 1) {
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
			('$new_userId','$driveId','1','0','0','0','0','0','0','0','0','0','0','Student')
			";
			$result = $conn->query($sql);
		}
	}


		if (!$isEmailInUserTable) {
	//If they don't have an account in user table then make one
	// Random screen name
	$screen_names = include 'screenNames.php';
	$randomNumber = rand(0,(count($screen_names) - 1));
	$screenName = $screen_names[$randomNumber];

	// Random profile picture
	$profile_pics = include 'profilePics.php';
	$randomNumber = rand(0,(count($profile_pics) - 1));
	$profilePicture = $profile_pics[$randomNumber];

	$sql = "
		INSERT INTO user
		(userId,
		screenName,
		email, 
		lastName,
		firstName,
		profilePicture,
		trackingConsent,
		roleStudent,
		roleInstructor)
		VALUES
		('$new_userId','$screenName','$email','$lastName','$firstName','$profilePicture','1','1','0')
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
section,
withdrew
FROM enrollment
WHERE driveId = '$driveId'
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
				"section"=>$row["section"],
				"withdrew"=>$row["withdrew"]
			);
			array_push($enrollmentArray,$learner);
		}


	}

$response_arr = array(
	"success" => $success,
	"message"=> $message,
	"enrollmentArray" => $enrollmentArray,
);
         
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

