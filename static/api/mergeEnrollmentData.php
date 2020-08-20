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
$courseId = mysqli_real_escape_string($conn,$_POST["courseId"]);
$mergeHeads = array_map(function($branchId) use($conn) {
return mysqli_real_escape_string($conn, $branchId);
}, $_POST['mergeHeads']);
$mergeId = array_map(function($branchId) use($conn) {
	return mysqli_real_escape_string($conn, $branchId);
}, $_POST['mergeId']);
$mergeFirstName = array_map(function($branchId) use($conn) {
	return mysqli_real_escape_string($conn, $branchId);
}, $_POST['mergeFirstName']);
$mergeLastName = array_map(function($branchId) use($conn) {
	return mysqli_real_escape_string($conn, $branchId);
}, $_POST['mergeLastName']);
$mergeEmail = array_map(function($branchId) use($conn) {
	return mysqli_real_escape_string($conn, $branchId);
}, $_POST['mergeEmail']);
$mergeSection = array_map(function($branchId) use($conn) {
	return mysqli_real_escape_string($conn, $branchId);
}, $_POST['mergeSection']);
$mergeDropped = array_map(function($branchId) use($conn) {
	return mysqli_real_escape_string($conn, $branchId);
}, $_POST['mergeDropped']);
$userIds = array_map(function($branchId) use($conn) {
	return mysqli_real_escape_string($conn, $branchId);
}, $_POST['userIds']);


//Get existing ID's and emails
$sql = "
SELECT email,
empId
FROM course_enrollment
WHERE courseId = '$courseId'
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
		$sql = "UPDATE course_enrollment
		SET
		$update_columns
		WHERE
		courseId = '$courseId'
		AND empId = '$id'";
	}else{
		$sql = "UPDATE course_enrollment
		SET
		$update_columns
		WHERE
		courseId = '$courseId'
		AND email = '$email'";
	}

	$result = $conn->query($sql);

}else{
	//INSERT
	$userId = $userIds[$i];

	$sql = "
	INSERT INTO course_enrollment
	(courseId,userId,firstName,lastName,email,empId,dateEnrolled,section)
	VALUES
	('$courseId','$userId','$firstName','$lastName','$email','$id',NOW(),'$section')
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
FROM course_enrollment
WHERE withdrew = '0'
AND courseId = '$courseId'
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

