<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$sql="
SELECT 
 f.folderId as folderId,
 f.title as title,
 f.parentId as parentId,
 f.creationDate as creationDate
FROM folder AS f
ORDER BY f.title
";

$result = $conn->query($sql); 
$response_arr = array();
$folder_info_arr = array();
$fi_array = array();
if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    array_push($fi_array, $row["folderId"]);
    $folder_info_arr[$row["folderId"]] = array(
          "title" => $row["title"],
          "publishDate" => $row["creationDate"],
          "parentId" => $row["parentId"],
          "childFolder" => array(),
          "childContent" => array()
    );
  }
}

// get children content
$sql="
SELECT 
 f.folderId as folderId,
 f.childId as childId,
 f.childType as childType,
 f.timestamp as creationDate
FROM folder_content AS f
WHERE removedFlag=0
ORDER BY f.folderId
";

$result = $conn->query($sql); 

if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    if ($row["childType"] == "content") {
      array_push($folder_info_arr[$row["folderId"]]["childContent"], $row["childId"]);
    } else if ($row["childType"] == "folder"){
      array_push($folder_info_arr[$row["folderId"]]["childFolder"], $row["childId"]);
    }
  }
}

$response_arr = array(
  "folderInfo"=>$folder_info_arr,
  "folderIds"=>$fi_array,
);

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();


?>