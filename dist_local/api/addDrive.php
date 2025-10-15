<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
$isPublic = mysqli_real_escape_string($conn,$_REQUEST["isPublic"]);
$label = mysqli_real_escape_string($conn,$_REQUEST["label"]);
$type = mysqli_real_escape_string($conn,$_REQUEST["type"]);
$image = mysqli_real_escape_string($conn,$_REQUEST["image"]);
$color = mysqli_real_escape_string($conn,$_REQUEST["color"]);
// $sourceDriveId = mysqli_real_escape_string($conn,$_REQUEST["sourceDriveId"]);

$success = TRUE;
$message = "";

if ($driveId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing driveId';
}elseif ($isPublic == ""){
  $success = FALSE;
  $message = 'Internal Error: missing isPublic';
}elseif ($label == ""){
  $success = FALSE;
  $message = 'Internal Error: missing label';
}elseif ($type == ""){
  $success = FALSE;
  $message = 'Internal Error: missing type';
}elseif ($image == ""){
  $success = FALSE;
  $message = 'Internal Error: missing image';
}elseif ($color == ""){
  $success = FALSE;
  $message = 'Internal Error: missing color';
}elseif ($userId == ""){
  $success = FALSE;
  $message = "You need to be signed in to create a $type";
}


if ($success){

$contentOrCourse = 'content';
if ($type === "new course drive"){
  $contentOrCourse = 'course';
}

$sql = "
INSERT INTO drive
(driveId,label,driveType,isShared,isPublic,image,color)
VALUES
('$driveId','$label','$contentOrCourse','0','$isPublic','$image','$color')
";

$result = $conn->query($sql); 

$sql = "
INSERT INTO drive_user
(userId,driveId,canEditContent,canViewDrive,canDeleteDrive,canShareDrive,canAddItemsAndFolders,
canDeleteItemsAndFolders,canMoveItemsAndFolders,canRenameItemsAndFolders,
canPublishItemsAndFolders,canViewUnreleasedItemsAndFolders,canViewUnassignedItemsAndFolders,canChangeAllDriveSettings,role)
VALUES
('$userId','$driveId','1','1','1','1','1','1','1','1','1','1','1','1','Owner')
";
$result = $conn->query($sql); 

  //   $message = "Can't save to database.";


}



$response_arr = array(
  "success"=>$success,
  "message"=>$message
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>