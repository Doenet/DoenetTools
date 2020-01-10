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
f.creationDate as creationDate
FROM folder AS f
LEFT JOIN course_content cc ON f.folderId=cc.itemId
WHERE cc.courseId='$courseId'
";

$result = $conn->query($sql); 
$response_arr = array();
$folder_info_arr = array();
$branch_info_arr = array();
         
if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    $folder_info_arr[$row["folderId"]] = array(
      "title" => $row["title"],
      "publishDate" => $row["creationDate"],
      "parentId" => $row["parentId"]
    );
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
  c.draft as draft
  FROM content AS c
  LEFT JOIN course_content cc ON cc.itemId = c.branchId
  WHERE cc.courseId='$courseId'
  ORDER BY c.branchId, c.timestamp DESC
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

$response_arr = array(
  "folderInfo"=>$folder_info_arr,
  "branchInfo"=>$branchId_info_arr
);
    
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();


?>