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
$cid = mysqli_real_escape_string($conn,$_REQUEST["cid"]);

$success = TRUE;
$message = "";
$uploads_dir = '../media/';

if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}elseif ($cid == ""){
  $success = FALSE;
  $message = 'Internal Error: missing cid';
}
//TODO: Do we need canEdit permission to delete?

//Test if user has permission to delete files
$canUpload = FALSE;
$sql = "
SELECT canUpload 
FROM user 
WHERE userId = '$userId'
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
if ($row['canUpload'] == '1'){$canUpload = TRUE;}

if (!$canUpload){
  $success = false;
  $message = "You don't have permission to delete files.";
}

if ($success){

  //Is anyone using this cid file?
  //AKA can we delete the file?
  $sql = "
  SELECT cid
  FROM support_files
  WHERE cid = '$cid'
  AND doenetId != '$doenetId'
  ";
  $result = $conn->query($sql);

  if ($result->num_rows == 0){
    //Delete from media folder
    $sql = "
    SELECT cid,fileType
    FROM support_files
    WHERE cid = '$cid'
    AND doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $fileLocation = $uploads_dir . getFileName($row['cid'],$row['fileType']);
    unlink($fileLocation);
  }

  //Delete row of doenetId and cid for this user
  $sql = "
  DELETE FROM support_files
  WHERE userId = '$userId'
  AND cid = '$cid'
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