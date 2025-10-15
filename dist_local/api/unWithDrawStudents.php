<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];
include "permissionsAndSettingsForOneCourseFunction.php";

$success = TRUE;
$message = "";

$_POST = json_decode(file_get_contents("php://input"),true);
$courseId = mysqli_real_escape_string($conn,$_POST["courseId"]);

$email = mysqli_real_escape_string($conn,$_POST["email"]);

$permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
  if ($permissions["canManageUsers"] != '1'){
    $success = FALSE;
    $message = "You need permission to manage users.";
  }
 

if ($success) {

	$sql = "UPDATE course_user AS cu
    LEFT JOIN user AS u
    ON u.userId = cu.userId
    SET 
    cu.dateWithdrew = NULL, 
    cu.withDrew = 0 
    WHERE cu.courseId = '$courseId' 
    AND u.email='$email';
    ";
  $result = $conn->query($sql);

         
}  

 http_response_code(200);

 $response_arr = array(
  "success"=>$success,
  "message"=>$message,
  );

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

