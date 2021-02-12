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
$canViewUnpublishItemsAndFolders = $row["canViewUnpublishItemsAndFolders"];
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

  if ($canViewUnpublishItemsAndFolders == "1"){
    //See unpublished
    $sql="
  SELECT 
  dc.itemId as itemId,
  dc.parentFolderId as parentFolderId,
  dc.label as label,
  dc.creationDate as creationDate,
  dc.isPublished as isPublished,
  dc.itemType as itemType,
  dc.branchId as branchId,
  dc.assignmentId as assignmentId,
  dc.urlId as urlId,
  dc.isAssignment as isAssignment,
  dc.sortOrder as sortOrder,
  u.url as url,
  u.description as urlDescription,
  a.title as assignment_title,
  a.contentId as contentId,
  a.isPublished as assignment_isPublished
FROM drive_content AS dc
LEFT JOIN url AS u
ON u.urlId = dc.urlId
LEFT JOIN assignment AS a
ON dc.assignmentId = a.assignmentId
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
    "urlDescription"=>$row['urlDescription'],
    "assignment_title"=>$row['assignment_title'],
    "assignment_isPublished"=>$row['assignment_isPublished'],
    "isAssignment"=>$row['isAssignment'],
    "sortOrder"=>$row['sortOrder']
  );
  array_push($results_arr,$item);
  }
  }else{
    //Can't see unpublished
    $sql="
    SELECT 
    dc.itemId as itemId,
    dc.parentFolderId as parentFolderId,
    dc.label as label,
    dc.creationDate as creationDate,
    dc.isPublished as isPublished,
    dc.itemType as itemType,
    dc.branchId as branchId,
    dc.assignmentId as assignmentId,
    dc.urlId as urlId,
    dc.isAssignment as isAssignment,
    dc.sortOrder as sortOrder,
    u.url as url,
    u.description as urlDescription,
    a.title as assignment_title,
    a.contentId as contentId,
    a.isPublished as assignment_isPublished
  FROM drive_content AS dc
  LEFT JOIN url AS u
  ON u.urlId = dc.urlId
  LEFT JOIN assignment AS a
  ON dc.assignmentId = a.assignmentId
    WHERE driveId = '$driveId'
    AND isDeleted = 0
    AND dc.isPublished = 1
    ";
    $result = $conn->query($sql); 
    //TODO if number of entries is larger than 50,000 then only give the drive's root and root children 
    while($row = $result->fetch_assoc()){ 
      $assignmentId = "";
      $assignment_title = "";
      $isAssignment = "0";
      $assignment_isPublished = "0";
      if ($row['assignment_isPublished'] == "1"){
        $assignmentId = $row['assignmentId'];
        $assignment_title = $row['assignment_title'];
        $isAssignment = $row['isAssignment'];
        $assignment_isPublished = "1";
      }
    $item = array(
      "itemId"=>$row['itemId'],
      "parentFolderId"=>$row['parentFolderId'],
      "label"=>$row['label'],
      "creationDate"=>$row['creationDate'],
      "isPublished"=>$row['isPublished'],
      "itemType"=>$row['itemType'],
      "branchId"=>$row['branchId'],
      "contentId"=>$row['contentId'],
      "urlId"=>$row['urlId'],
      "url"=>$row['url'],
      "urlDescription"=>$row['urlDescription'],
      "assignment_isPublished"=>$assignment_isPublished,
      "assignmentId"=>$assignmentId,
      "assignment_title"=>$assignment_title,
      "isAssignment"=>$isAssignment,
      "sortOrder"=>$row['sortOrder']
    );
    array_push($results_arr,$item);
    }
  }
  
  

}else{

  //Get just one folder's information
  //Haven't needed this yet

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