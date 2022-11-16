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
$cid =  mysqli_real_escape_string($conn,$_POST["cid"]);
$versionId =  mysqli_real_escape_string($conn,$_POST["versionId"]);
$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);
$label =  mysqli_real_escape_string($conn,$_POST["label"]);

$success = TRUE;
$message = "";

if ($cid == ""){
  $success = FALSE;
  $message = "Internal Error: missing cid";
}else if($versionId == ""){
  $success = FALSE;
  $message = "Internal Error: missing versionId";
}

if ($success){

$sql = "UPDATE drive_content SET
isAssigned = '0'
WHERE doenetId = '$doenetId'
";

$result = $conn->query($sql);

$sql = "UPDATE content SET
isAssigned = '0'
WHERE cid = '$cid' AND versionId = '$versionId'
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
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);

  
  $conn->close();
?>
