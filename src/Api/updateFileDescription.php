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


//Test if user has permission to upload files

$sql = "
SELECT du.canUpload as canUpload
FROM drive_user AS du
LEFT JOIN drive_content AS dc
ON dc.driveId = du.driveId
WHERE du.userId = '$userId'
AND dc.doenetId = '$doenetId'
AND du.canEditContent = '1'
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
if ($row['canUpload'] == '0'){
  $success = false;
  $msg = "You don't have permission to update files.";
}

if ($success){
  $sql = "
  UPDATE support_files
  SET description = '$description'
  WHERE userId = '$userId'
  AND doenetId = '$doenetId'
  AND contentId = '$contentId'
  ";
  $result = $conn->query($sql);
}




// set response code - 200 OK
http_response_code(200);

$response_arr = array(
  "success" => $success,
  "msg" => $msg,
);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>