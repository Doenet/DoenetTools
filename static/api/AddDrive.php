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
$label = mysqli_real_escape_string($conn,$_REQUEST["label"]);

$success = TRUE;
$results_arr = array();


$sql = "
INSERT INTO drive
(driveId,label,driveType,isShared,courseId)
VALUES
('$driveId','$label','content','0',null)
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

$response_arr = array(
  "success"=>$success
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>