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

$email = mysqli_real_escape_string($conn,$_POST["email"]);

//TODO: Need a permission related to see grades (not du.canChangeAllDriveSettings)
$sql = "
SELECT du.canChangeAllDriveSettings 
FROM drive_user AS du
WHERE du.userId = '$userId'
AND du.driveId = '$driveId'
AND du.canChangeAllDriveSettings = '1'
";
 
$result = $conn->query($sql);
if ($result->num_rows > 0) {


	$sql = "
	UPDATE enrollment SET dateEnrolled = NOW() , withDrew = 1 WHERE driveId = '$driveId' AND email='$email';
	";
  $result = $conn->query($sql);
$response_arr = array(
	"success" => 1
);
         
}
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

