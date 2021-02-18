<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$timestamp =  mysqli_real_escape_string($conn,$_REQUEST["timestamp"]);
$newTitle =  mysqli_real_escape_string($conn,$_REQUEST["newTitle"]);
$branchId =  mysqli_real_escape_string($conn,$_REQUEST["branchId"]);
$isNamed =  mysqli_real_escape_string($conn,$_REQUEST["isNamed"]);


$sql="
UPDATE content
SET title='$newTitle',isNamed='$isNamed'
WHERE timestamp = '$timestamp'
AND branchId = '$branchId'
";

$result = $conn->query($sql); 

$response_arr = array(
        "success"=>true
);
    
 // set response code - 200 OK
 http_response_code(200);
     

 // make it json format
 echo json_encode($response_arr);
$conn->close();


?>
           
