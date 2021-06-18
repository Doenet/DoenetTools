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
$enrollUserId = mysqli_real_escape_string($conn,$_POST["userId"]);



	$sql = "
	INSERT INTO enrollment
	(driveId,userId,firstName,lastName,email,dateEnrolled,section)
	VALUES
	('$driveId','$enrollUserId','NULL','NULL','$email',NOW(),'NULL')
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
	('$enrollUserId','$driveId','1','0','0','0','0','0','0','0','0','0','0','Student')
	";
	$result = $conn->query($sql);
  



$response_arr = array(
	"success" => 1
);
         
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

