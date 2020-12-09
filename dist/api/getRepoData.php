<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$sql="
SELECT   -- get all repos user has access to
  f.folderId as folderId,
  f.title as title,
  f.parentId as parentId,
  f.creationDate as creationDate,
  f.isRepo as isRepo,
  f.public as isPublic,
  f.isPinned as isPinned,
  f.folderId as rootId
FROM repo_access AS ra
LEFT JOIN folder f ON ra.repoId = f.folderId
WHERE ra.userId='$userId' AND ra.removedFlag=0 AND f.isPinned='0'
ORDER BY isPinned DESC
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
  ";
}

$result = $conn->query($sql); 
$response_arr = array();
$repo_info_arr = array();
$repo_array = array();
$all_repo_array = array();
$repos_arr = array();
if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    if ($row["parentId"] == "root") array_push($repo_array, $row["folderId"]);
    if ($row["isRepo"] == 1) array_push($repos_arr,$row["folderId"]);
    array_push($all_repo_array, $row["folderId"]);
    $repo_info_arr[$row["folderId"]] = array(
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

// get children content and folders
$sql="
SELECT 
 fc.folderId as folderId,
 fc.rootId as rootId,
 fc.childId as childId,
 fc.childType as childType,
 fc.timestamp as creationDate
FROM folder_content AS fc
WHERE fc.removedFlag=0 AND fc.rootId IN ('".implode("','",$all_repo_array)."')
ORDER BY fc.folderId
";


$result = $conn->query($sql); 
$childContentArray = array();
$childFoldersArray = array();
$childUrlsArray = array();

if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    if ($row["childType"] == "content") {
      if ($row["rootId"] == $row["folderId"]) array_push($repo_info_arr[$row["rootId"]]["childContent"], $row["childId"]);
      array_push($childContentArray, $row["childId"]);
    } else if ($row["childType"] == "folder"){
      if ($row["rootId"] == $row["folderId"]) array_push($repo_info_arr[$row["rootId"]]["childFolders"], $row["childId"]);
      array_push($childFoldersArray, $row["childId"]);
    } else if ($row["childType"] == "url"){
      if ($row["rootId"] == $row["folderId"]) array_push($repo_info_arr[$row["rootId"]]["childUrls"], $row["childId"]);
      array_push($childUrlsArray, $row["childId"]);
    }
    if ($row["rootId"] == $row["folderId"]) $repo_info_arr[$row["rootId"]]["numChild"]++;
  }
}

//Collect users who can access repos
foreach ($repos_arr as $repoId) {
  $sql = "
  SELECT 
    u.firstName AS firstName,
    u.lastName AS lastName,
    u.username AS username,
    u.email AS email,
    ra.owner AS owner
    FROM repo_access AS ra
    LEFT JOIN user AS u
    ON u.email = ra.email
    WHERE ra.repoId = '$repoId'
  ";
$result = $conn->query($sql); 
$users = array();
while($row = $result->fetch_assoc()){ 
  $user_info = array(
    "firstName"=>$row["firstName"],
    "lastName"=>$row["lastName"],
    "username"=>$row["username"],
    "email"=>$row["email"],
    "owner"=>$row["owner"]
  );
  array_push($users,$user_info);
}

$repo_info_arr[$repoId]["user_access_info"] = $users;
}

$response_arr = array(
  "repoInfo"=>$repo_info_arr,
  "repoIds"=>$repo_array,
  "repoContentIds"=>$childContentArray,
  "repoFolderIds"=>$childFoldersArray,
  "repoUrlIds"=>$childUrlsArray,
);


$conn->close();
?>