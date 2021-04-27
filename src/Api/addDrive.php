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
$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
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
}elseif ($courseId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing courseId';
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
(driveId,label,driveType,isShared,courseId,image,color)
VALUES
('$driveId','$label','$contentOrCourse','0','$courseId','$image','$color')
";

$result = $conn->query($sql); 

$sql = "
INSERT INTO drive_user
(userId,driveId,canViewDrive,canDeleteDrive,canShareDrive,canAddItemsAndFolders,
canDeleteItemsAndFolders,canMoveItemsAndFolders,canRenameItemsAndFolders,
canPublishItemsAndFolders,canViewUnpublishItemsAndFolders,canChangeAllDriveSettings)
VALUES
('$userId','$driveId','1','1','1','1','1','1','1','1','1','1')
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