<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$parentId = array_key_exists("parentId",$_REQUEST) ? mysqli_real_escape_string($conn,$_REQUEST["parentId"]) : "";
$driveId = array_key_exists("driveId",$_REQUEST) ? mysqli_real_escape_string($conn,$_REQUEST["driveId"]) : "";
$init = array_key_exists("init",$_REQUEST) ? mysqli_real_escape_string($conn,$_REQUEST["init"]) : "";

$success = TRUE;
$message = "";
$results_arr = array();

//note: not currently using $parentId
if ($driveId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing driveId';
}elseif ($userId == ""){
  $success = FALSE;
  $message = "You need to be signed in to learn of drive users";
}


//make sure the user is supposed to have drive read access
$sql = "
SELECT 
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
canChangeAllDriveSettings
FROM drive_user
WHERE userId = '$userId'
AND driveId = '$driveId'
";

$result = $conn->query($sql); 

if ($result->num_rows > 0){
$row = $result->fetch_assoc();
$canViewDrive = $row["canViewDrive"];
$canViewUnreleasedItemsAndFolders = $row["canViewUnreleasedItemsAndFolders"];
$canViewUnassignedItemsAndFolders = $row["canViewUnassignedItemsAndFolders"];
$perms = array(
    "isShared"=>$row["isShared"],
    "canViewDrive"=>$row["canViewDrive"],
    "canDeleteDrive"=>$row["canDeleteDrive"],
    "canShareDrive"=>$row["canShareDrive"],
    "canAddItemsAndFolders"=>$row["canAddItemsAndFolders"],
    "canDeleteItemsAndFolders"=>$row["canDeleteItemsAndFolders"],
    "canMoveItemsAndFolders"=>$row["canMoveItemsAndFolders"],
    "canRenameItemsAndFolders"=>$row["canRenameItemsAndFolders"],
    "canPublishItemsAndFolders"=>$row["canPublishItemsAndFolders"],
    "canViewUnreleasedItemsAndFolders"=>$row["canViewUnreleasedItemsAndFolders"],
    "canViewUnassignedItemsAndFolders"=>$row["canViewUnassignedItemsAndFolders"],
    "canChangeAllDriveSettings"=>$row["canChangeAllDriveSettings"]
    
  );
}else{
  $perms = array();
  $message = "You don't have access to this drive.";
  $success = FALSE;
}


if ($success){

$sql = "SELECT driveId
FROM drive
WHERE driveId = '$driveId'
AND isDeleted = '0'
";

$result = $conn->query($sql); 

if ($result->num_rows == 0){
  $success = FALSE;
  $message = "Drive is deleted";
}

if ($success && $init == 'true'){

  
    //See unpublished
    $sql="
  SELECT 
  dc.itemId as itemId,
  dc.parentFolderId as parentFolderId,
  dc.label as label,
  dc.creationDate as creationDate,
  dc.isReleased as isReleased,
  dc.isAssigned as isAssigned,
  dc.isPublic as isPublic,
  dc.itemType as itemType,
  dc.doenetId as doenetId,
  dc.sortOrder as sortOrder
  FROM drive_content AS dc
  WHERE dc.driveId = '$driveId'
  AND dc.isDeleted = 0
  ";

  //We are using isReleased as isAssigned for now
  // if ($canViewUnassignedItemsAndFolders == "0"){
  //   $sql = $sql . " AND dc.isAssigned = 1";
  // }

  if ($canViewUnreleasedItemsAndFolders == "0"){
    $sql = $sql . " AND (dc.isReleased = 1 OR dc.itemType='Folder')";
  }
 
  $result = $conn->query($sql); 
  //TODO if number of entries is larger than 50,000 then only give the drive's root and root children 
  while($row = $result->fetch_assoc()){ 
  $item = array(
    "itemId"=>$row['itemId'],
    "parentFolderId"=>$row['parentFolderId'],
    "label"=>$row['label'],
    "creationDate"=>$row['creationDate'],
    "isReleased"=>$row['isReleased'],
    "isAssigned"=>$row['isAssigned'],
    "isPublic"=>$row['isPublic'],
    "itemType"=>$row['itemType'],
    "doenetId"=>$row['doenetId'],
    "sortOrder"=>$row['sortOrder'],
    "driveId"=>$driveId
  );
  array_push($results_arr,$item);
  }
 
  
  

}else{

  //Get just one folder's information
  //Haven't needed this yet

}
}

$response_arr = array(
  "results"=>$results_arr,
  "perms"=>$perms,
  "success"=>$success,
  "message"=>$message
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>