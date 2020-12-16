<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$type = mysqli_real_escape_string($conn,$_REQUEST["type"]);

$success = TRUE;
$results_arr = array();
//If files table doesn't exist for user then create them 
$sql = "SHOW TABLES LIKE 'drives_$userId';";
$result = $conn->query($sql); 
$table_existed = TRUE;
if ($result->num_rows == 0 && $type == "personal"){
  
  $sql = "
  CREATE TABLE `drives_$userId` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `driveId` char(21) DEFAULT NULL,
    `label` varchar(255) DEFAULT NULL,
    `driveType` varchar(255) DEFAULT NULL,
    `isShared` tinyint(1) DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
  ";
$result = $conn->query($sql); 
$initPersonalDriveId = include 'randomId.php';
  $sql = "
  INSERT INTO drives_$userId (driveId,label,driveType,isShared)
  VALUES
  ('$initPersonalDriveId','Content','personal',0)
  ";
$result = $conn->query($sql); 

$sql = "
CREATE TABLE `drive_$initPersonalDriveId` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `itemId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parentId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `label` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creationDate` timestamp NULL DEFAULT NULL,
  `isDeleted` int(1) NOT NULL DEFAULT '0',
  `itemType` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `folderId` (`itemId`)
) ENGINE=InnoDB AUTO_INCREMENT=267 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
";
$result = $conn->query($sql); 

}

//Gather matching drive ids
$driveIdsAndLabels = array();
$sql = "
SELECT driveId,label
FROM drives_$userId
WHERE driveType='$type'
";

$result = $conn->query($sql); 
while($row = $result->fetch_assoc()){ 
  $driveAndLabel = array("driveId"=>$row['driveId'],"label"=>$row['label']);
  array_push($driveIdsAndLabels,$driveAndLabel);
}
$response_arr = array(
  "success"=>$success,
  "driveIdsAndLabels"=>$driveIdsAndLabels
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>