<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "userQuotaBytesAvailable.php";
include "getFilename.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$contentId = mysqli_real_escape_string($conn,$_REQUEST["contentId"]);

$success = TRUE;
$message = "";
$uploads_dir = '../media/';

if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}elseif ($contentId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing contentId';
}

//TODO: Check if they have permission to delete files

//Is anyone using this contentId file?
//AKA can we delete the file?
$sql = "
SELECT contentId
FROM support_files
WHERE contentId = '$contentId'
AND doenetId != '$doenetId'
";
$result = $conn->query($sql);

if ($result->num_rows == 0){
  //Delete from media folder
  $sql = "
  SELECT contentId,fileType
  FROM support_files
  WHERE contentId = '$contentId'
  AND doenetId = '$doenetId'
  ";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  $fileLocation = $uploads_dir . getFileName($row['contentId'],$row['fileType']);
  unlink($fileLocation);
}

//Delete row of doenetId and contentId for this user
$sql = "
DELETE FROM support_files
WHERE userId = '$userId'
AND contentId = '$contentId'
AND doenetId = '$doenetId'
";
$result = $conn->query($sql);


list($userQuotaBytesAvailable,$quotaBytes) = getBytesAvailable($conn,$userId);


$response_arr = array(
  "success"=> $success,
  "message"=>$message,
  "userQuotaBytesAvailable" => $userQuotaBytesAvailable,
);

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>