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
$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);

$success = TRUE;
$message = "";

if ($itemId == ""){
  $success = FALSE;
  $message = "Internal Error: missing itemId";
}

if ($success){

$sql = "UPDATE drive_content SET
isAssigned = '1'
WHERE itemId = '$itemId'
AND doenetId = '$doenetId'
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