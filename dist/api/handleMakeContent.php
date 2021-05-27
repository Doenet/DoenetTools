<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);


$itemId =  mysqli_real_escape_string($conn,$_POST["itemId"]);
$contentId =  mysqli_real_escape_string($conn,$_POST["contentId"]);
$versionId =  mysqli_real_escape_string($conn,$_POST["versionId"]);
$branchId =  mysqli_real_escape_string($conn,$_POST["branchId"]);
$label =  mysqli_real_escape_string($conn,$_POST["label"]);

$success = TRUE;
$message = "";

if ($contentId == ""){
  $success = FALSE;
  $message = "Internal Error: missing contentId";
}else if($versionId == ""){
  $success = FALSE;
  $message = "Internal Error: missing versionId";
}

if ($success){

$sql = "UPDATE drive_content SET
isAssigned = '0'
WHERE branchId = '$branchId'
";

$result = $conn->query($sql);

$sql = "UPDATE content SET
isAssigned = '0'
WHERE contentId = '$contentId' AND versionId = '$versionId'
";

$result = $conn->query($sql);
}
// echo $sql;
// set response code - 200 OK
$response_arr = array(
  "success"=>$success,
  "message"=>$message
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

  
  $conn->close();
?>
