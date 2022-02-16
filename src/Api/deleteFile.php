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

//Test if user has permission to delete files

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
  $msg = "You don't have permission to delete files.";
}

if ($success){

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



}




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