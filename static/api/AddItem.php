<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
$parentId = mysqli_real_escape_string($conn,$_REQUEST["parentId"]);
$itemId = mysqli_real_escape_string($conn,$_REQUEST["itemId"]);
$label = mysqli_real_escape_string($conn,$_REQUEST["label"]);
$type = mysqli_real_escape_string($conn,$_REQUEST["type"]);

$success = TRUE;
$results_arr = array();

$sql = "
SELECT canAddItemsAndFolders
FROM drive_user
WHERE userId = '$userId'
AND driveId = '$driveId'
";
$result = $conn->query($sql); 
if ($result->num_rows > 0){
$row = $result->fetch_assoc();
$canAdd = $row["canAddItemsAndFolders"];
if (!$canAdd){
  $success = FALSE;
}
}else{
  //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
  $success = FALSE;
}

if ($success){

//If not given parentId then use the user's drive
if ($parentId == ""){
  $parentId = "content";
}


$sql="
INSERT INTO drive_content
(driveId,parentFolderId,contentId,label,creationDate,isDeleted,itemType)
VALUES
('$driveId','$parentId','$itemId','$label',NOW(),'0','$type')
";
$result = $conn->query($sql); 

}

$response_arr = array(
  "success"=>$success
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>