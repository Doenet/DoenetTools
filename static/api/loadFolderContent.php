<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
// $userId = $jwtArray['userId'];
$userId = '3oN5gDY3392zexHopijG6';


$parentFolderId = mysqli_real_escape_string($conn,$_REQUEST["parentId"]);
$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
$init = mysqli_real_escape_string($conn,$_REQUEST["init"]);

$success = TRUE;
$results_arr = array();
//make sure the user is supposed to have drive read access
$sql = "
SELECT 
isShared, 
canViewDrive, 
canDeleteDrive, 
canShareDrive,
canAddItemsAndFolders,
canDeleteItemsAndFolders,
canMoveItemsAndFolders,
canRenameItemsAndFolders,
canChangeAllDriveSettings
FROM drive_user
WHERE userId = '$userId'
AND driveId = '$driveId'
";

$result = $conn->query($sql); 

if ($result->num_rows > 0){
$row = $result->fetch_assoc();
$canViewDrive = $row["canViewDrive"];
$perms = array(
    "isShared"=>$row["isShared"],
    "canViewDrive"=>$row["canViewDrive"],
    "canDeleteDrive"=>$row["canDeleteDrive"],
    "canShareDrive"=>$row["canShareDrive"],
    "canAddItemsAndFolders"=>$row["canAddItemsAndFolders"],
    "canDeleteItemsAndFolders"=>$row["canDeleteItemsAndFolders"],
    "canMoveItemsAndFolders"=>$row["canMoveItemsAndFolders"],
    "canRenameItemsAndFolders"=>$row["canRenameItemsAndFolders"],
    "canChangeAllDriveSettings"=>$row["canChangeAllDriveSettings"]
    
  );
}else{
  $perms = array();
  $success = FALSE;
}


if ($success && $canViewDrive){

$sql = "SELECT driveId
FROM drive_content
WHERE driveId = '$driveId'";
$result = $conn->query($sql); 

if ($result->num_rows == 0){
  $success = FALSE;
}

if ($init == 'true'){
  $sql="
  SELECT 
    d.contentId as contentId,
    d.label as label,
    d.parentFolderId as parentFolderId,
    d.creationDate as creationDate,
    d.itemType as itemType
  FROM drive_content AS d
  WHERE driveId = '$driveId'
  AND isDeleted = 0
  ";

  $result = $conn->query($sql); 
  //TODO if number of entries is larger than 50,000 then only give the drive's root and root children 
  while($row = $result->fetch_assoc()){ 

  $item = array(
    "id"=>$row['contentId'],
    "label"=>$row['label'],
    "parentFolderId"=>$row['parentFolderId'],
    "creationDate"=>$row['creationDate'],
    "type"=>$row['itemType']
  );
  array_push($results_arr,$item);
  }
}else{

  $results_arr[$parentFolderId] = selectChildren($parentFolderId,$userId,$driveId,$conn);
  $children_arr = array_keys($results_arr[$parentFolderId]);
  foreach ($children_arr as &$childId){
    $results_arr[$childId] = selectChildren($childId,$userId,$driveId,$conn);
  }

}
}

$response_arr = array(
  "results"=>$results_arr,
  "perms"=>$perms,
  "success"=>$success
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

function selectChildren($parentFolderId,$userId,$driveId,$conn){
  $return_arr = array();
  //ADD FOLDERS AND REPOS
  $sql="
  SELECT 
    d.contentId as contentId,
    d.label as label,
    d.parentFolderId as parentFolderId,
    d.creationDate as creationDate,
    d.itemType as itemType
  FROM drive_content AS d
  WHERE driveId = '$driveId'
  AND parentFolderId = '$parentFolderId'
  AND isDeleted = 0
  ";

  $result = $conn->query($sql); 
  while($row = $result->fetch_assoc()){ 

  $item = array(
    "id"=>$row['contentId'],
    "label"=>$row['label'],
    "parentFolderId"=>$parentFolderId,
    "creationDate"=>$row['creationDate'],
    "type"=>$row['itemType']
  );
  $return_arr[$row['contentId']] = $item;
  // array_push($return_arr, $item);
  }
  return $return_arr;
}


?>