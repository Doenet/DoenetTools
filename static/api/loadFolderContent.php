<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$parentId = mysqli_real_escape_string($conn,$_REQUEST["parentId"]);
$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
$isRepo = mysqli_real_escape_string($conn,$_REQUEST["isRepo"]);

//If files table doesn't exist for user then create it 
$sql = "SHOW TABLES LIKE 'item_$userId';";
$result = $conn->query($sql); 
$table_existed = TRUE;
if ($result->num_rows == 0){
  $table_existed = FALSE;
  $sql = "
  CREATE TABLE `items_$userId` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `driveId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
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

  //TODO: If table still not created create a random named table and rename it to items_userid

  //TODO: Add demos to newly created table

}




$success = TRUE;
$results_arr = array();




$results_arr[$parentId] = selectChildren($parentId,$userId,$driveId,$conn);
$children_arr = array_keys($results_arr[$parentId]);
foreach ($children_arr as &$childId){
  $results_arr[$childId] = selectChildren($childId,$userId,$driveId,$conn);
}


$response_arr = array(
  "results"=>$results_arr,
  "success"=>$success
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

function selectChildren($parentId,$userId,$driveId,$conn){
  $return_arr = array();
  //ADD FOLDERS AND REPOS
  $sql="
  SELECT 
    i.itemId as itemId,
    i.label as label,
    i.parentId as parentId,
    i.creationDate as creationDate,
    i.isDeleted as isDeleted,
    i.itemType as itemType
  FROM items_$userId AS i
  WHERE parentId = '$parentId'
  AND driveId = '$driveId'
  AND isDeleted = 0
  ";

  $result = $conn->query($sql); 
  while($row = $result->fetch_assoc()){ 

  $item = array(
    "id"=>$row['itemId'],
    "label"=>$row['label'],
    "parentId"=>$parentId,
    "type"=>$row['itemType']
  );
  $return_arr[$row['itemId']] = $item;
  // array_push($return_arr, $item);
  }
  return $return_arr;
}


?>