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

$versionId =  mysqli_real_escape_string($conn,$_POST["versionId"]);

$success = TRUE;
$message = "";

if ($versionId == ""){
  $success = FALSE;
  $message = "Internal Error: missing versionId";
}

if ($success){

$sql = "UPDATE content SET
isAssigned = '0'
WHERE versionId = '$versionId'
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