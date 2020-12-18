<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$parentId = mysqli_real_escape_string($conn,$_REQUEST["parentId"]);
$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
$init = mysqli_real_escape_string($conn,$_REQUEST["init"]);

//TODO: make sure the user is supposed to have drive read access
$success = TRUE;


$sql = "SELECT driveId
FROM drive
WHERE driveId = '$driveId'";
$result = $conn->query($sql); 

if ($result->num_rows == 0){
  $success = FALSE;
}
$results_arr = array();

if ($init == 'true'){
  $sql="
  SELECT 
    d.itemId as itemId,
    d.label as label,
    d.parentId as parentId,
    d.creationDate as creationDate,
    d.itemType as itemType
  FROM drive AS d
  WHERE driveId = '$driveId'
  AND isDeleted = 0
  ";

  $result = $conn->query($sql); 
  //TODO if number of entries is larger than 50,000 then only give the drive's root and root children 
  while($row = $result->fetch_assoc()){ 

  $item = array(
    "id"=>$row['itemId'],
    "label"=>$row['label'],
    "parentId"=>$row['parentId'],
    "creationDate"=>$row['creationDate'],
    "type"=>$row['itemType']
  );
  array_push($results_arr,$item);
  }
}else{

  $results_arr[$parentId] = selectChildren($parentId,$userId,$driveId,$conn);
  $children_arr = array_keys($results_arr[$parentId]);
  foreach ($children_arr as &$childId){
    $results_arr[$childId] = selectChildren($childId,$userId,$driveId,$conn);
  }

}


$response_arr = array(
  "results"=>$results_arr,
  "success"=>$success
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

function selectChildren($parentId,$userId,$driveId,$conn){
  $return_arr = array();
  //ADD FOLDERS AND REPOS
  $sql="
  SELECT 
    d.itemId as itemId,
    d.label as label,
    d.parentId as parentId,
    d.creationDate as creationDate,
    d.itemType as itemType
  FROM drive AS d
  WHERE driveId = '$driveId'
  AND parentId = '$parentId'
  AND isDeleted = 0
  ";

  $result = $conn->query($sql); 
  while($row = $result->fetch_assoc()){ 

  $item = array(
    "id"=>$row['itemId'],
    "label"=>$row['label'],
    "parentId"=>$parentId,
    "creationDate"=>$row['creationDate'],
    "type"=>$row['itemType']
  );
  $return_arr[$row['itemId']] = $item;
  // array_push($return_arr, $item);
  }
  return $return_arr;
}


?>