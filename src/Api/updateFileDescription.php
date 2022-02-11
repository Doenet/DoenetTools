<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];


$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$contentId = mysqli_real_escape_string($conn,$_REQUEST["contentId"]);
$description = mysqli_real_escape_string($conn,$_REQUEST["description"]);

$success = true;


//TODO: Test if user has permission to update file info

$sql = "
UPDATE support_files
SET description = '$description'
WHERE userId = '$userId'
AND doenetId = '$doenetId'
AND contentId = '$contentId'
";
$result = $conn->query($sql);


// set response code - 200 OK
http_response_code(200);

$response_arr = array(
  "success" => $success,
);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>