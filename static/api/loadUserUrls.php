<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$sql="
SELECT   -- get personal urls
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
LEFT JOIN user_urls uu ON uu.urlId = u.urlId
WHERE uu.username='$remoteuser' AND u.removedFlag=0
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
      f.folderId as folderId
    FROM repo_access AS ra
    LEFT JOIN folder f ON ra.repoId = f.folderId
    WHERE ra.username='$remoteuser' AND ra.removedFlag=0
    UNION
    SELECT 
      f.folderId as folderId
    FROM user_folders AS uf
    LEFT JOIN folder f ON uf.folderId = f.folderId
    WHERE uf.username='$remoteuser'
  )
ORDER BY title
";

$result = $conn->query($sql); 
$response_arr = array();
$url_info_arr = array();
$urlId_arr = array();

if ($result->num_rows > 0){
    while($row = $result->fetch_assoc()){ 
      if ($row["parentId"] == "root") array_push($urlId_arr, $row["urlId"]);
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
  "urlInfo"=>$url_info_arr,
  "urlIds"=>$urlId_arr,
);
    
 // set response code - 200 OK
 http_response_code(200);
     
 // make it json format
 echo json_encode($response_arr);
$conn->close();
?>
           