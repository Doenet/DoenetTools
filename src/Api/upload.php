<?php
header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include "db_connection.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = true;
$uploads_dir = '../media/';

// echo 'file_get_contents->';
// var_dump(file_get_contents("php://input"));
// echo '<-';
// echo 'HTTP_RAW_POST_DATA->';
// var_dump($HTTP_RAW_POST_DATA);
// echo '<-';
// echo '_POST->';
// var_dump($_POST);
// echo '<-';
// echo '_FILES->';
// var_dump($_FILES);
// echo '<-';
// echo '_FILES[file]->';
// var_dump($_FILES['file']);
// echo '<-';
$type = $_FILES['file']['type'];
$tmp_name = $_FILES['file']['tmp_name'];
$error = $_FILES['file']['error'];
$extension = '';
if ($type == 'image/jpeg'){
  $extension = '.jpg';
}else if ($type == 'text/csv'){
  $extension = '.csv';
}
// $contentId = hash('sha256', $dangerousDoenetML);

$destination = $uploads_dir . 'test' . $extension;
echo "\n";
echo "type $type\n";
echo "tmp_name $tmp_name\n";
echo "destination $destination\n";
var_dump($_FILES['file']);
// echo "error $error\n";
move_uploaded_file($tmp_name, $destination);

// $_POST = json_decode(file_get_contents("php://input"),true);
// $file = file_get_contents("php://input");
// $firstName =  mysqli_real_escape_string($conn,$_POST["firstName"]);
// $lastName =  mysqli_real_escape_string($conn,$_POST["lastName"]);
// $profilePicture =  mysqli_real_escape_string($conn,$_POST["profilePicture"]);
// $trackingConsent =  mysqli_real_escape_string($conn,$_POST["trackingConsent"]);
// $roleStudent =  mysqli_real_escape_string($conn,$_POST["roleStudent"]);
// $roleInstructor =  mysqli_real_escape_string($conn,$_POST["roleInstructor"]);
// $roleCourseDesigner =  mysqli_real_escape_string($conn,$_POST["roleCourseDesigner"]);

// if ($roleStudent == true){$roleStudent = "1";}else{$roleStudent = "0";}
// if ($roleInstructor == true){$roleInstructor = "1";}else{$roleInstructor = "0";}
// if ($roleCourseDesigner == true){$roleCourseDesigner = "1";}else{$roleCourseDesigner = "0";}

// $sql = "UPDATE user
//         SET screenName = '$screenName', 
//         firstName = '$firstName', 
//         lastName = '$lastName',  
//         profilePicture = '$profilePicture', 
//         trackingConsent = '$trackingConsent', 
//         roleStudent = '$roleStudent', 
//         roleInstructor = '$roleInstructor', 
//         roleCourseDesigner = '$roleCourseDesigner'
//         WHERE userId = '$userId' ";
// // echo $sql;
// $result = $conn->query($sql);


// set response code - 200 OK
http_response_code(200);

$response_arr = array("success" => $success,"file" => $file);

// make it json format
// echo json_encode($response_arr);

$conn->close();

