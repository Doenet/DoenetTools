<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$folderId =  mysqli_real_escape_string($conn,$_REQUEST["folderId"]);  // root or folderId

if ($folderId === "root") {
  $sql="
    SELECT 
    f.folderId as folderId,
    f.title as title,
    f.parentId as parentId,
    f.creationDate as creationDate,
    f.isRepo as isRepo
    FROM repo_access AS ra
    LEFT JOIN folder f ON ra.repoId = f.folderId
    WHERE ra.username='$remoteuser'
    UNION
    SELECT 
    f.folderId as folderId,
    f.title as title,
    f.parentId as parentId,
    f.creationDate as creationDate,
    f.isRepo as isRepo
    FROM user_folders AS uf
    LEFT JOIN folder f ON uf.folderId = f.folderId
    WHERE uf.username='$remoteuser'
  ";
} else {
  $sql="
    SELECT 
    f.folderId as folderId,
    f.title as title,
    f.parentId as parentId,
    f.creationDate as creationDate
    FROM folder_content AS fc
    LEFT JOIN folder f ON fc.childId = f.folderId
    WHERE fc.folderId='$folderId' AND fc.childType='folder'
  ";
}

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
          "isRepo" => ($row["isRepo"] == 1)
    );
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