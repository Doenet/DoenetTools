<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$branchId = mysqli_real_escape_string($conn,$_REQUEST["branchId"]);

$sql = "UPDATE content
SET removedFlag=1
WHERE branchId='$branchId';";

$result = $conn->query($sql);
$numberOfRowsDeleted = $conn->affected_rows;

$sql = "UPDATE content_branch
SET removedFlag=1
WHERE branchId='$branchId';";
$result = $conn->query($sql);
$numberOfRowsDeleted = $numberOfRowsDeleted + $conn->affected_rows;


$response_arr = array(
    "success" => $numberOfRowsDeleted,
);

 // set response code - 200 OK
 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);
$conn->close();

?>