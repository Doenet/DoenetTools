<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

include "randomId.php";
include "userQuotaBytesAvailable.php";
include "getFilename.php";
include "cidFromSHA.php";



$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);


$success = true;
$msg = "";


$uploads_dir = '../media/';

$type = $_FILES['file']['type'];
$tmp_name = $_FILES['file']['tmp_name'];
$error = $_FILES['file']['error'];
$size = $_FILES['file']['size'];
$original_file_name = $_FILES['file']['name'];
$description = ""; //Don't automatically fill with file name
// $description = substr($original_file_name, 0, strrpos($original_file_name, "."));

$tmp_dest = $uploads_dir . getFileName('tmp_' . $random_id,$type);

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
  $msg = "You don't have permission to upload files.";
}

//Test if user has space to upload files
if ($success){
  list($userQuotaBytesAvailable,$quotaBytes) = getBytesAvailable($conn,$userId);

  if ($userQuotaBytesAvailable - $size <= 0){
    $success = false;
    $msg = "You don't have enough space in your quota to upload files.";
  }
}

if ($success){
  if ($size > 1000000){
    $success = false;
    $msg = "File is larger than 1MB limit.";
  }
}


$already_have_file = false;

if ($success){
  move_uploaded_file($tmp_name, $tmp_dest);
  $SHA = hash_file("sha256",$tmp_dest);
  $cid = cidFromSHA($SHA);
  
  $newFileName = getFileName($cid,$type);
  $destination = $uploads_dir . $newFileName;

  rename($tmp_dest,$destination);

  $mime_type = mime_content_type($destination);

  $width = 0;
  $height = 0;
  if ($mime_type == 'image/jpeg' || $mime_type == 'image/png'){
    [$width,$height] = getimagesize($destination);
  }

  //Test if user already has this file in this activity
  $sql = "
  SELECT contentId
  FROM support_files 
  WHERE userId = '$userId'
  AND contentId = '$cid'
  AND doenetId = '$doenetId'
  ";
  $result = $conn->query($sql);

  if ($result->num_rows > 0){
        $already_have_file = true;
          $success = false;
          $msg = "Already have the file '$original_file_name' in this activity. Not used against your quota.";
  }
}


if ($success){
        //Test if user has file in another activity
        $sql = "
        SELECT contentId
        FROM support_files 
        WHERE userId = '$userId'
        AND contentId = '$cid'
        AND doenetId != '$doenetId'
        ";
        $result = $conn->query($sql);

        if ($result->num_rows > 0){
                $already_have_file = true;
                $msg = "Found the file in another activity.  Not used against your quota.";
        }
}

if ($success && !$already_have_file){
  //track upload for IPFS upload nanny to upload later
  $sql = "
  INSERT INTO ipfs_to_upload 
  (contentId,fileType,sizeInBytes,timestamp)
  VALUES
  ('$cid','$type','$size',NOW())
  ";
  $result = $conn->query($sql);
}

if ($success){
        $sql = "
        INSERT INTO support_files 
        (userId,contentId,doenetId,fileType,description,asFileName,sizeInBytes,widthPixels,heightPixels,timestamp)
        VALUES
        ('$userId','$cid','$doenetId','$type','$description','$original_file_name','$size','$width','$height',NOW())
        ";
        $result = $conn->query($sql);
}
if ($success){
  //TODO: test at the top as well for over quota
  list($userQuotaBytesAvailable,$quotaBytes) = getBytesAvailable($conn,$userId);
}

// set response code - 200 OK
http_response_code(200);

$response_arr = array("success" => $success,
                       "contentId" => $cid,
                        "fileName" => $newFileName,
                        "description" => $description,
                        "asFileName" => $original_file_name,
                        "width" => $width,
                        "height" => $height,
                        "msg" => $msg,
                        "userQuotaBytesAvailable" => $userQuotaBytesAvailable);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>