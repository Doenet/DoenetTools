<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$_POST = json_decode(file_get_contents("php://input"),true);
$folderInfo =  $_POST["folderInfo"];

// Data: [folderInfo...]
// for each folderId in folderInfo
//    for each childId in childFolders
//        if folderId=="root" => rootId="childId", folderId="root"
//        INSERT/UPDATE (rootId, folderId, childId, timestamp) in folders_content
//        UPDATE (folderId, parentId) in folders
//    for each childId in childContent
//        if folderId=="root" => rootId="root", folderId="root"
//        INSERT/UPDATE (rootId, folderId, childId, timestamp) in folders_content
//    for each childId in childUrls
//        if folderId=="root" => rootId="root", folderId="root"
//        INSERT/UPDATE (rootId, folderId, childId, timestamp) in folders_content

$folder_values = "";
$folder_content_values = "";

foreach ($folderInfo as $currFolderId => $currFolderInfo) {
  
  foreach ($currFolderInfo["childFolders"] as $childId) {
    $rootId = $currFolderInfo["rootId"];
    $folderId = $currFolderId;
    if ($currFolderId == "root") { $rootId = $folderId; $folderId = "root"; }

    $folder_content_values .= "('$rootId', '$folderId', '$childId', 'folder', NOW()),";
    $folder_values .= "('$childId', '$currFolderId'),";
  }
  foreach ($currFolderInfo["childContent"] as $childId) {
    $rootId = $currFolderInfo["rootId"];
    $folderId = $currFolderId;
    if ($currFolderId == "root") { $rootId = "root"; $folderId = "root"; }

    $folder_content_values .= "('$rootId', '$folderId', '$childId', 'content', NOW()),";
    $folder_values .= "('$childId', '$currFolderId'),";
  }
  foreach ($currFolderInfo["childUrls"] as $childId) {
    $rootId = $currFolderInfo["rootId"];
    $folderId = $currFolderId;
    if ($currFolderId == "root") { $rootId = "root"; $folderId = "root"; }

    $folder_content_values .= "('$rootId', '$folderId', '$childId', 'url', NOW()),";
    $folder_values .= "('$childId', '$currFolderId'),";
  }
}

$sql = "
  INSERT INTO folder_content (rootId, folderId, childId, childType, timestamp) VALUES".
    substr($folder_content_values, 0, -1)
  ."ON DUPLICATE KEY UPDATE 
    rootId=VALUES(rootId), 
    folderId=VALUES(folderId), 
    childId=VALUES(childId), 
    childType=VALUES(childType), 
    timestamp=VALUES(timestamp)";

$result = $conn->query($sql); 

$sql = "
  INSERT INTO folder (folderId, parentId) VALUES".
    substr($folder_values, 0, -1)
  ."ON DUPLICATE KEY UPDATE 
    folderId=VALUES(folderId), 
    parentId=VALUES(parentId)";

$result = $conn->query($sql); 


if ($result === TRUE) {
  http_response_code(200);
}else {
  echo "Error: " . $sql . "\n" . $conn->error;
}

$conn->close();
?>

