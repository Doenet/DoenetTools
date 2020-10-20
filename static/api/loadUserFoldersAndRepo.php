<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "getRepoData.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$sql="
SELECT  -- get all personal folders 
  f.folderId as folderId,
  f.title as title,
  f.parentId as parentId,
  f.creationDate as creationDate,
  f.isRepo as isRepo,
  f.public as isPublic,
  f.isPinned as isPinned,
  fc.rootId as rootId
FROM user_folders AS uf
LEFT JOIN folder f ON uf.folderId = f.folderId
LEFT JOIN folder_content fc ON uf.folderId = fc.childId
WHERE uf.userId='$userId' AND f.isPinned='0'
UNION
SELECT  -- get all shared folders 
  f.folderId as folderId,
  f.title as title,
  f.parentId as parentId,
  f.creationDate as creationDate,
  f.isRepo as isRepo,
  f.public as isPublic,
  f.isPinned as isPinned,
  fc.rootId as rootId
FROM folder f
LEFT JOIN folder_content fc ON f.folderId = fc.childId
WHERE f.folderId IN ('".implode("','",$childFoldersArray)."')
ORDER BY title ASC
";

if (!$userId) {
  $sql="
  SELECT   -- get all pinned repos
    f.folderId as folderId,
    f.title as title,
    f.parentId as parentId,
    f.creationDate as creationDate,
    f.isRepo as isRepo,
    f.public as isPublic,
    f.isPinned as isPinned,
    f.folderId as rootId
    FROM folder AS f
  WHERE f.isPinned='1'
  UNION
  SELECT
    f.folderId as folderId,
    f.title as title,
    f.parentId as parentId,
    f.creationDate as creationDate,
    f.isRepo as isRepo,
    f.public as isPublic,
    f.isPinned as isPinned,
    f.folderId as rootId
    FROM folder_content AS fc, folder AS f
  WHERE (f.folderId = fc.rootId OR f.folderId = fc.folderId) AND f.isPinned='1' AND fc.childId = f.folderId
  ";
}

$result = $conn->query($sql); 
$response_arr = array();
$folder_info_arr = array();
$fi_array = array();
$all_fi_array = array();
$repos_arr = array();
if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    if ($row["parentId"] == "root") array_push($fi_array, $row["folderId"]);
    if ($row["isRepo"] == 1) array_push($repos_arr,$row["folderId"]);
    array_push($all_fi_array, $row["folderId"]);
    $folder_info_arr[$row["folderId"]] = array(
          "title" => $row["title"],
          "publishDate" => $row["creationDate"],
          "parentId" => $row["parentId"],
          "rootId" => $row["rootId"] == NULL ? $row["folderId"] : $row["rootId"],
          "type" => "folder",
          "childContent" => array(),
          "childUrls" => array(),
          "childFolders" => array(),
          "isRepo" => ($row["isRepo"] == 1),
          "isPublic" => ($row["isPublic"] == 1),
          "isPinned" => ($row["isPinned"] == 1), 
          "numChild" => 0
    );
  }
}

// insert root object into folderInfo
$folder_info_arr["root"] = array(
  "title" => "root",
  "publishDate" => "",
  "parentId" => "root",
  "rootId" => "root",
  "type" => "folder",
  "childContent" => array(),
  "childUrls" => array(),
  "childFolders" => array(),
  "isRepo" => FALSE,
  "isPublic" => TRUE,
  "isPinned" => FALSE,
  "numChild" => 0
);

// get children content and folders
$sql="
SELECT 
 fc.folderId as folderId,
 fc.childId as childId,
 fc.childType as childType,
 fc.timestamp as creationDate
FROM folder_content AS fc
WHERE fc.removedFlag=0 AND fc.folderId IN ('".implode("','",$all_fi_array)."')
ORDER BY fc.folderId
";

$result = $conn->query($sql); 

if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    if ($row["childType"] == "content") {
      array_push($folder_info_arr[$row["folderId"]]["childContent"], $row["childId"]);
    } else if ($row["childType"] == "folder"){
      array_push($folder_info_arr[$row["folderId"]]["childFolders"], $row["childId"]);
    } else if ($row["childType"] == "url"){
      array_push($folder_info_arr[$row["folderId"]]["childUrls"], $row["childId"]);
    }
    $folder_info_arr[$row["folderId"]]["numChild"]++;
  }
}


$response_arr = array(
  "folderInfo"=>  array_merge($folder_info_arr, $repo_info_arr),
  "folderIds"=> array_merge($fi_array, $repo_array),
);

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();


?>