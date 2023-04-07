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
$email = mysqli_real_escape_string($conn,$_POST["email"]);
$enrollUserId = mysqli_real_escape_string($conn,$_POST["userId"]);

$success = TRUE;
$message = "";

if ($driveId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing driveId';
}elseif ($email == ""){
    $success = FALSE;
    $message = 'Internal Error: missing email';
}elseif ($enrollUserId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing enrollUserId';
}




//Is there a user account with the email address?
$sql ="
SELECT userId 
FROM user 
WHERE email = '$email'
";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
	//Already an account so use the stored userId
	$row = $result->fetch_assoc();
	$enrollUserId = $row['userId'];
}else{
	//No user account, so make one 
}
echo $enrollUserId;
//  $uniqueUser = mysqli_num_rows($result);

//Add to 
 
//Give access to the course at student level

//
//  $userInfo = $result->fetch_assoc();
//  $firstName = $userInfo['firstName'];
//  $lastName = $userInfo['lastName'];
// $userId = $userInfo['userId'];
// if($uniqueUser == 0){
// 	$sql = "
// 	INSERT INTO user
// 	(userId,
// 	screenName,
// 	email, 
// 	studentId, 
// 	lastName,
// 	firstName,
// 	profilePicture,
// 	trackingConsent,
// 	roleStudent,
// 	roleInstructor)
// 	VALUES
// 	('$enrollUserId','NULL','$email','NULL','NULL','NULL','quokka','1','1','0')
// 	";
// 	$result = $conn->query($sql);
// 	$sql = "
// 	INSERT INTO drive_user
// 	(userId,
// 	driveId,
// 	canViewDrive, 
// 	canDeleteDrive, 
// 	canShareDrive,
// 	canAddItemsAndFolders,
// 	canDeleteItemsAndFolders,
// 	canMoveItemsAndFolders,
// 	canRenameItemsAndFolders,
// 	canPublishItemsAndFolders,
// 	canViewUnreleasedItemsAndFolders,
// 	canViewUnassignedItemsAndFolders,
//   canChangeAllDriveSettings,
//   role)
// 	VALUES
// 	('$enrollUserId','$driveId','1','0','0','0','0','0','0','0','0','0','0','Student')
// 	";
// 	$result = $conn->query($sql);
// }else{
// 	$sql = "
// 	INSERT INTO enrollment
// 	(driveId,userId,firstName,lastName,email,dateEnrolled,section)
// 	VALUES
// 	('$driveId','$userId','$firstName','$lastName','$email',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'),'NULL')
// 	";
// 	$result = $conn->query($sql);
// 	$sql = "
// 	INSERT INTO drive_user
// 	(userId,
// 	driveId,
// 	canViewDrive, 
// 	canDeleteDrive, 
// 	canShareDrive,
// 	canAddItemsAndFolders,
// 	canDeleteItemsAndFolders,
// 	canMoveItemsAndFolders,
// 	canRenameItemsAndFolders,
// 	canPublishItemsAndFolders,
// 	canViewUnreleasedItemsAndFolders,
// 	canViewUnassignedItemsAndFolders,
//   canChangeAllDriveSettings,
//   role)
// 	VALUES
// 	('$userId','$driveId','1','0','0','0','0','0','0','0','0','0','0','Student')
// 	";
// 	$result = $conn->query($sql);
// }

  

$response_arr = array(
	"success"=>$success,
	"message"=>$message,
);
    
         

 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);

$conn->close();

?>

