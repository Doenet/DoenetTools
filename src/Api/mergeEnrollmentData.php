<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";

$success = TRUE;
$message = "";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);
$courseId = mysqli_real_escape_string($conn,$_POST["courseId"]);

$permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);

  if ($permissions["canManageUsers"] != '1'){
    $success = FALSE;
    $message = "You need permission to manage users.";
  }

	if ($success){
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
	}

if ($success){
//Get existing information in the database
$sql = "
SELECT e.email AS enrollmentEmail,
u.email AS userEmail,
CAST(cu.roleLabels as CHAR) AS roleLabels
FROM enrollment AS e
RIGHT JOIN course_user AS cu
ON cu.userId = e.userId
LEFT JOIN user AS u
ON e.userId = u.userId
WHERE cu.courseId = '$courseId'
";
$result = $conn->query($sql);
$db_enrollment_table_emails = array();
$db_user_table_emails = array();
$db_email_to_role = array();

if ($result->num_rows > 0) {
	while ($row = $result->fetch_assoc()){
		array_push($db_enrollment_table_emails,$row['enrollmentEmail']);
		$userEmail = $row['userEmail'];
		array_push($db_user_table_emails,$userEmail);
		$db_email_to_role[$userEmail] = $row['roleLabels'];
	}
}

// Insert or Update records
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


	if (in_array($email,$db_enrollment_table_emails,FALSE)){
		//Already in the enrollment table so update with new information
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
		courseId = '$courseId'
		AND email = '$email'";
		
		$result = $conn->query($sql);

	}else{
		//No previous record so INSERT
		$sql = "
		INSERT INTO enrollment
		(courseId,userId,firstName,lastName,email,empId,dateEnrolled,section)
		VALUES
		('$courseId','$new_userId','$firstName','$lastName','$email','$id',NOW(),'$section')
		";
		$result = $conn->query($sql);

	}

		//Check if course_user table needs an insert or update
  $roleLabels = $db_email_to_role[$email];
	$roleLabelsJSON = ['Student'];
	if ($roleLabels != NULL){
		$roleLabelsJSON = json_decode($db_email_to_role[$email],true);
		if (!in_array("Student",$roleLabelsJSON,FALSE)){
			array_push($roleLabelsJSON,"Student");
			$json = json_encode($roleLabelsJSON);
			$sql = "
			UPDATE course_user
			SET canViewCourse = '1', roleLabels= '$json'
			WHERE courseId = '$courseId'
			AND userId = '$new_userId'
			";
			$result = $conn->query($sql);

		}

	}else{
		$json = json_encode($roleLabelsJSON);

				$sql = "
			INSERT INTO course_user
			(userId,courseId,canViewCourse,canViewContentSource,canEditContent,
			canPublishContent,canViewUnassignedContent,canProctor,canViewAndModifyGrades,
			canViewActivitySettings,canModifyCourseSettings,canViewUsers,canManageUsers,
			canModifyRoles,isOwner,roleLabels)
			VALUES
			('$new_userId','$courseId','1','0','0','0','0','0','0','0','0','0','0','0','0','$json')
			";	
			
			$result = $conn->query($sql);
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

// Get all records for JS
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
WHERE courseId = '$courseId'
ORDER BY firstName
";
$result = $conn->query($sql);

$enrollmentArray = array();
if ($result->num_rows > 1) {

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

