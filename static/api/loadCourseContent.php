<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]); 

$sql="
SELECT 
f.folderId as folderId,
f.title as title,
f.parentId as parentId,
f.creationDate as creationDate,
f.isRepo as isRepo,
f.public as isPublic,
f.folderId as rootId
FROM folder AS f
LEFT JOIN course_content cc ON f.folderId=cc.itemId
WHERE cc.courseId='$courseId'
UNION
SELECT  -- get all nested folders
  f.folderId as folderId,
  f.title as title,
  f.parentId as parentId,
  f.creationDate as creationDate,
  f.isRepo as isRepo,
  f.public as isPublic,
  fc.rootId as rootId
FROM folder_content AS fc
LEFT JOIN folder f ON fc.childId = f.folderId
WHERE fc.removedFlag=0 AND rootId IN (
  SELECT 
  fc.rootId as rootId
  FROM folder_content AS fc
  LEFT JOIN course_content cc ON fc.folderId=cc.itemId
  WHERE cc.courseId='$courseId'
) AND fc.childType='folder'
";

$result = $conn->query($sql); 
$response_arr = array();
$folder_info_arr = array();
$branch_info_arr = array();
$url_info_arr = array();
$all_fi_array = array();
         
if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    array_push($all_fi_array, $row["folderId"]);
    $folder_info_arr[$row["folderId"]] = array(
      "title" => $row["title"],
      "publishDate" => $row["creationDate"],
      "parentId" => $row["parentId"],
      "rootId" => $row["rootId"],
      "childContent" => array(),
      "childFolders" => array(),
      "childUrls" => array(),
      "isRepo" => ($row["isRepo"] == 1),
      "isPublic" => ($row["isPublic"] == 1)
    );
  }
}

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
  }
}

// get course content
$sql="
  SELECT 
  c.branchId as branchId,
  c.title as title,
  c.contentId as contentId,
  c.timestamp as publishDate,
  c.removedFlag as removedFlag,
  c.draft as draft,
  'root' as rootId, 
  'root' as parentId,
  c.public as public
  FROM content AS c
  LEFT JOIN course_content cc ON cc.itemId = c.branchId
  WHERE cc.courseId='$courseId'
  UNION
  SELECT  -- get children content 
    c.branchId as branchId,
    c.title as title,
    c.contentId as contentId,
    c.timestamp as publishDate,
    c.removedFlag as removedFlag,
    c.draft as draft,
    fc.rootId as rootId, 
    fc.folderId as parentId,
    c.public as public
  FROM content AS c
  LEFT JOIN folder_content fc ON fc.childId = c.branchId
  WHERE fc.childType='content' AND c.removedFlag=0
  AND fc.rootId IN (
    SELECT 
    fc.rootId as rootId
    FROM folder_content AS fc
    LEFT JOIN course_content cc ON fc.folderId=cc.itemId
    WHERE cc.courseId='$courseId'
  )
  ORDER BY branchId, publishDate DESC
";

$result = $conn->query($sql); 
$ci_array = array();
$sort_order_arr = array();
         
if ($result->num_rows > 0){
    while($row = $result->fetch_assoc()){ 
            
        $end_bi = end($sort_order_arr);
        $bi = $row["branchId"]; 
        
        $ci = array(
                "contentId"=> $row["contentId"],
                "publishDate"=> $row["publishDate"],
                "draft"=> $row["draft"]
        );
        
        //     echo "$bi\n";
        //     echo $row["contentId"]."\n";
        //     var_dump($ci);
        //     echo "\n----\n\n";
        if ($bi != $end_bi){
                if ($end_bi !== false){ //Only add when we have a branchId
                        $branchId_info_arr[$end_bi]["contentIds"] = $ci_array;
                        $ci_array = array();
                }
                $branchId_info_arr[$bi] = array(
                "title"=>$row["title"],
                "publishDate" => "",
                "draftDate" => "",
                "parentId" => null
                );
                array_push($sort_order_arr,$bi);
        }
        if ($row["draft"] == 1) {
                $branchId_info_arr[$bi]["draftDate"] = $row["publishDate"];       
        }
        else if ($row["draft"] == 0) {
                if ($branchId_info_arr[$bi]["publishDate"] <= $row["publishDate"]) {
                        $branchId_info_arr[$bi]["publishDate"] = $row["publishDate"];               
                }                        
        }
        array_push($ci_array,$ci);
    }
    if ($end_bi !== false){ //Only add when we have a branchId
        $branchId_info_arr[$end_bi]["contentIds"] = $ci_array;
    }
}

$sql="
SELECT   -- get course urls
  u.urlId as urlId,
  u.title as title,
  u.url as url,
  u.description as description,
  u.timestamp as publishDate,
  u.removedFlag as removedFlag,
  u.usesDoenetAPI as usesDoenetAPI,
  'root' as rootId, 
  'root' as parentId,
  u.public as isPublic
FROM url AS u
LEFT JOIN course_content cc ON cc.itemId = u.urlId
  WHERE cc.courseId='$courseId'
UNION
SELECT  -- get children urls 
  u.urlId as urlId,
  u.title as title,
  u.url as url,
  u.description as description,
  u.timestamp as publishDate,
  u.removedFlag as removedFlag,
  u.usesDoenetAPI as usesDoenetAPI,
  fc.rootId as rootId, 
  fc.folderId as parentId,
  u.public as isPublic
FROM url AS u
LEFT JOIN folder_content fc ON fc.childId = u.urlId
WHERE fc.childType='url' AND u.removedFlag=0
AND rootId IN (
  SELECT 
  fc.rootId as rootId
  FROM folder_content AS fc
  LEFT JOIN course_content cc ON fc.folderId=cc.itemId
  WHERE cc.courseId='$courseId'
)
ORDER BY title
";

$result = $conn->query($sql); 

if ($result->num_rows > 0){
    while($row = $result->fetch_assoc()){ 
      $url_info_arr[$row["urlId"]] = array(
        "title" => $row["title"],
        "url" => $row["url"],
        "description" => $row["description"],
        "publishDate" => $row["publishDate"],
        "usesDoenetAPI" => ($row["usesDoenetAPI"] == 1),
        "parentId" => $row["parentId"],
        "rootId" => $row["rootId"],
        "isPublic" => ($row["isPublic"] == 1)
      );
    }
}

$response_arr = array(
  "folderInfo"=>$folder_info_arr,
  "branchInfo"=>$branchId_info_arr,
  "urlInfo" => $url_info_arr
);
    
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();


?>