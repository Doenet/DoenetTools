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
SELECT   -- get personal content
  c.branchId as branchId,
  c.title as title,
  c.contentId as contentId,
  c.timestamp as publishDate,
  c.removedFlag as removedFlag,
  c.draft as draft,
  fc.rootId as rootId, 
  fc.folderId as parentId,
  c.public as isPublic,
  cb.isPinned as isPinned
FROM content AS c
LEFT JOIN user_content uc ON uc.branchId = c.branchId
LEFT JOIN folder_content fc ON fc.childId = c.branchId AND fc.childType='content'
LEFT JOIN content_branch cb ON c.branchId = cb.branchId
WHERE uc.username='$remoteuser' AND c.removedFlag=0 AND cb.isPinned='0'
ORDER BY branchId, publishDate DESC;
";

if (!$userId) {
  $sql="
  SELECT   -- get pinned content
    c.branchId as branchId,
    c.title as title,
    c.contentId as contentId,
    c.timestamp as publishDate,
    c.removedFlag as removedFlag,
    c.draft as draft,
    fc.rootId as rootId, 
    fc.folderId as parentId,
    c.public as isPublic,
    cb.isPinned as isPinned
  FROM content AS c
  LEFT JOIN folder_content fc ON fc.childId = c.branchId AND fc.childType='content'
  LEFT JOIN content_branch cb ON c.branchId = cb.branchId
  WHERE cb.isPinned='1' AND c.removedFlag=0
  UNION
  SELECT
    c.branchId as branchId,
    c.title as title,
    c.contentId as contentId,
    c.timestamp as publishDate,
    c.removedFlag as removedFlag,
    c.draft as draft,
    fc.rootId as rootId, 
    fc.folderId as parentId,
    c.public as isPublic,
    cb.isPinned as isPinned
  FROM folder_content AS fc, folder AS f, content AS c
  LEFT JOIN content_branch cb ON c.branchId = cb.branchId
  WHERE (f.folderId = fc.rootId OR f.folderId = fc.folderId) AND f.isPinned='1' AND fc.childId = c.branchId
  ORDER BY branchId, publishDate DESC;
  ";
}


$result = $conn->query($sql); 
$response_arr = array();
$branchId_info_arr = array();
$sort_order_arr = array();
$ci_array = array();
         
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
                "type" => "content",
                "parentId" => $row["parentId"] == NULL ? "root" : $row["parentId"],
                "rootId" => $row["rootId"] == NULL ? "root" : $row["rootId"],
                "isPublic" => ($row["isPublic"] == 1),
                "isPinned" => ($row["isPinned"] == 1), 
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

$filtered_sort_order_arr = array();

foreach($sort_order_arr as $key => $value) {
  if ($branchId_info_arr[$value]["parentId"] == "root") {
    array_push($filtered_sort_order_arr,$value);
  }
}

$response_arr = array(
        "branchId_info"=>$branchId_info_arr,
        "sort_order"=>$filtered_sort_order_arr,
);
    
 // set response code - 200 OK
 http_response_code(200);
     
 // make it json format
 echo json_encode($response_arr);
$conn->close();
?>
           