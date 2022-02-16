<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
// header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
// use Base32\Base32;

include "db_connection.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

include "randomId.php";
include "userQuotaBytesAvailable.php";
include "getFilename.php";


$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);


$success = true;
$msg = "";


$uploads_dir = '../media/';

$type = $_FILES['file']['type'];
$tmp_name = $_FILES['file']['tmp_name'];
$error = $_FILES['file']['error'];
$size = $_FILES['file']['size'];
$original_file_name = $_FILES['file']['name'];
$description = substr($original_file_name, 0, strrpos($original_file_name, "."));

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
    // $msg = "You don't have enough space in your quota to upload files.";
  }
}

if ($success){
  move_uploaded_file($tmp_name, $tmp_dest);

  $thefileHandle = fopen($tmp_dest, 'r');
  $thefile = fread($thefileHandle,filesize($tmp_dest));
  fclose($thefileHandle);

  $token = $ini_array['web3storagetoken'];
  $url = "https://api.web3.storage/upload";
  $postField = array();
  $tmpfile = $_FILES['file']['tmp_name'];
  $filename = basename($_FILES['file']['name']);

  $headers = array(
          "Authorization: Bearer $token",
          // "Content-Type: multipart/form-data"
  );

  $curl_handle = curl_init();
  curl_setopt($curl_handle, CURLOPT_URL, $url);
  curl_setopt($curl_handle, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($curl_handle, CURLOPT_POST, TRUE);
  curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $thefile);

  curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, TRUE);
  $cid_info_raw = curl_exec($curl_handle);
  curl_close($curl_handle);

  $cid_info = json_decode($cid_info_raw,true);
}

if ($success && array_key_exists("code",$cid_info)){
  //We have an error
  //TODO: make user friendly messages
  $success = false;
  $msg = $cid_info['message'];
  
}

if ($success && !array_key_exists("cid",$cid_info)){
  //We have an error
    $success = false;
    $msg = "Unknown error: #1";
  }


  //TODO: on no success then delete the temp file on errors (unlink)

if ($success){
  $cid = $cid_info['cid'];
  $newFileName = getFileName($cid,$type);
  $destination = $uploads_dir . $newFileName;

  rename($tmp_dest,$destination);
}


if ($success){

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
                $msg = "Found the file in another activity.  Not used against your quota.";
        }
}


if ($success){
        $sql = "
        INSERT INTO support_files 
        (userId,contentId,doenetId,fileType,description,asFileName,sizeInBytes,timestamp)
        VALUES
        ('$userId','$cid','$doenetId','$type','$description','$original_file_name','$size',NOW())
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
                        "msg" => $msg,
                        "userQuotaBytesAvailable" => $userQuotaBytesAvailable);

// // make it json format
echo json_encode($response_arr);

$conn->close();

// $curl = curl_init($url);
// curl_setopt($curl, CURLOPT_URL, $url);
// curl_setopt($curl, CURLOPT_POST, true);
// curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

// $headers = array(
//    "Authorization: Bearer $token"
// );
// curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

// // $data = "ABC";
// $tmpfile = $_FILES['file']['tmp_name'];
// $filename = basename($_FILES['file']['name']);
// $data = array(
//         'uploaded_file' => curl_file_create($tmpfile, $type, $filename)
//     );
// // $fp = fopen($tmp_dest, 'r');

// curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
// // curl_setopt($ch, CURLOPT_INFILE, $fp);

// //for debug only!
// curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
// curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

// $resp = curl_exec($curl);
// curl_close($curl);
// var_dump($resp);



// $SHA = hash_file("sha256",$tmp_dest);

// $hashLen = '20'; //32 bit
// $algorithm = '12'; //18 in decimal
// // (eventually we want dag-pb)
// $multiHash =  $algorithm . $hashLen . $SHA; 
// $multiCodec = '00'; //raw binary
// $CIDversion = '01'; //2nd version of Multiformat (starts at 0) 
// $base = 'f'; //code https://github.com/multiformats/multibase/blob/master/multibase.csv

// // $CID = $base . $CIDversion . $multiCodec . $multiHash; //hexadecimal string

// $to_base32 = Base32::encode(hex2bin($CIDversion . $multiCodec . $multiHash)); 
// $base = 'b';
// $CID = $base . $to_base32;
// echo $CID;

// $contentId = $CID;
// $newFileName = getFileName($contentId,$type);
// $destination = $uploads_dir . $newFileName;

// rename($tmp_dest,$destination);
?>