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
$init = mysqli_real_escape_string($conn,$_REQUEST["init"]);

$success = TRUE;
$results_arr = array();
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
canViewUnpublishItemsAndFolders,
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
    "canPublishItemsAndFolders"=>$row["canPublishItemsAndFolders"],
    "canViewUnpublishItemsAndFolders"=>$row["canViewUnpublishItemsAndFolders"],
    "canChangeAllDriveSettings"=>$row["canChangeAllDriveSettings"]
    
  );
}else{
  $perms = array();
  $success = FALSE;
}


if ($success && $canViewDrive){

$sql = "SELECT driveId
FROM drive
WHERE driveId = '$driveId'";
$result = $conn->query($sql); 

if ($result->num_rows == 0){
  $success = FALSE;
}

if ($init == 'true'){
  $sql="
  SELECT 
  dc.itemId as itemId,
  dc.parentFolderId as parentFolderId,
  dc.label as label,
  dc.creationDate as creationDate,
  dc.isPublished as isPublished,
  dc.itemType as itemType,
  dc.branchId as branchId,
  dc.contentId as contentId,
  dc.assignmentId as assignmentId,
  dc.urlId as urlId,
  u.url as url,
  u.description as urlDescription
FROM drive_content AS dc
LEFT JOIN url AS u
ON u.urlId = dc.urlId
  WHERE driveId = '$driveId'
  AND isDeleted = 0
  ";
  $result = $conn->query($sql); 
  //TODO if number of entries is larger than 50,000 then only give the drive's root and root children 
  while($row = $result->fetch_assoc()){ 
  $item = array(
    "itemId"=>$row['itemId'],
    "parentFolderId"=>$row['parentFolderId'],
    "label"=>$row['label'],
    "creationDate"=>$row['creationDate'],
    "isPublished"=>$row['isPublished'],
    "itemType"=>$row['itemType'],
    "branchId"=>$row['branchId'],
    "contentId"=>$row['contentId'],
    "assignmentId"=>$row['assignmentId'],
    "urlId"=>$row['urlId'],
    "url"=>$row['url'],
    "urlDescription"=>$row['urlDescription']
  );
  array_push($results_arr,$item);
  }
}else{

  // $results_arr[$parentId] = selectChildren($parentId,$userId,$driveId,$conn);
  // $children_arr = array_keys($results_arr[$parentId]);
  // foreach ($children_arr as &$childId){
  //   $results_arr[$childId] = selectChildren($childId,$userId,$driveId,$conn);
  // }

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

// function selectChildren($parentId,$userId,$driveId,$conn){
//   $return_arr = array();
//   //ADD FOLDERS AND REPOS
//   $sql="
//   SELECT 
//     d.itemId as itemId,
//     d.label as label,
//     d.parentId as parentId,
//     d.creationDate as creationDate,
//     d.itemType as itemType
//   FROM drive AS d
//   WHERE driveId = '$driveId'
//   AND parentId = '$parentId'
//   AND isDeleted = 0
//   ";

//   $result = $conn->query($sql); 
//   while($row = $result->fetch_assoc()){ 

//   $item = array(
//     "id"=>$row['itemId'],
//     "label"=>$row['label'],
//     "parentId"=>$parentId,
//     "creationDate"=>$row['creationDate'],
//     "type"=>$row['itemType']
//   );
//   $return_arr[$row['itemId']] = $item;
//   // array_push($return_arr, $item);
//   }
//   return $return_arr;
// }


?>