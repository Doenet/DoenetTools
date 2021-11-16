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
$screenName =  mysqli_real_escape_string($conn,$_POST["screenName"]);
$firstName =  mysqli_real_escape_string($conn,$_POST["firstName"]);
$lastName =  mysqli_real_escape_string($conn,$_POST["lastName"]);
$profilePicture =  mysqli_real_escape_string($conn,$_POST["profilePicture"]);
$trackingConsent =  mysqli_real_escape_string($conn,$_POST["trackingConsent"]);
$roleStudent =  mysqli_real_escape_string($conn,$_POST["roleStudent"]);
$roleInstructor =  mysqli_real_escape_string($conn,$_POST["roleInstructor"]);
$roleCourseDesigner =  mysqli_real_escape_string($conn,$_POST["roleCourseDesigner"]);

if ($roleStudent == true){$roleStudent = "1";}else{$roleStudent = "0";}
if ($roleInstructor == true){$roleInstructor = "1";}else{$roleInstructor = "0";}
if ($roleCourseDesigner == true){$roleCourseDesigner = "1";}else{$roleCourseDesigner = "0";}

$sql = "UPDATE user
        SET screenName = '$screenName', 
        firstName = '$firstName', 
        lastName = '$lastName',  
        profilePicture = '$profilePicture', 
        trackingConsent = '$trackingConsent', 
        roleStudent = '$roleStudent', 
        roleInstructor = '$roleInstructor', 
        roleCourseDesigner = '$roleCourseDesigner'
        WHERE userId = '$userId' ";
// echo $sql;
$result = $conn->query($sql);


// set response code - 200 OK
http_response_code(200);

$response_arr = array("success" => "1");

// make it json format
echo json_encode($response_arr);

$conn->close();

