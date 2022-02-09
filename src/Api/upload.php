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


$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);


$success = true;
$msg = "";
$count_against_quota = true;

//TODO: Test if user has permission and space to upload files

$uploads_dir = '../media/';

$type = $_FILES['file']['type'];
$tmp_name = $_FILES['file']['tmp_name'];
$error = $_FILES['file']['error'];
$size = $_FILES['file']['size'];
$original_file_name = $_FILES['file']['name'];
$description = substr($original_file_name, 0, strrpos($original_file_name, "."));

$extension = '';
if ($type == 'image/jpeg'){
  $extension = '.jpg';
}else if ($type == 'text/csv'){
  $extension = '.csv';
}

$tmp_dest = $uploads_dir . 'tmp_' . $random_id . $extension;

move_uploaded_file($tmp_name, $tmp_dest);

$SHA = hash_file("sha256",$tmp_dest);

$hashLen = '20'; //32 bit
$algorithm = '12'; //18 in decimal
// (eventually we want dag-pb)
$multiHash =  $algorithm . $hashLen . $SHA; 
$multiCodec = '00'; //raw binary
$CIDversion = '01'; //2nd version of Multiformat (starts at 0) 
$base = 'f'; //code https://github.com/multiformats/multibase/blob/master/multibase.csv

$CID = $base . $CIDversion . $multiCodec . $multiHash; //hexadecimal string

// $to_base32 = Base32::encode(hex2bin($CIDversion . $multiCodec . $multiHash)); 
// $base = 'b';
// $CID = $base . $to_base32;


$contentId = $CID;
$newFileName = $contentId . $extension;
$destination = $uploads_dir . $newFileName;

rename($tmp_dest,$destination);

//Test if user already has this file in this activity
$sql = "
SELECT contentId
FROM support_files 
WHERE userId = '$userId'
AND contentId = '$contentId'
AND doenetId = '$doenetId'
";
$result = $conn->query($sql);

if ($result->num_rows > 0){
        $success = false;
        $msg = "Already have the file '$original_file_name' in this activity. Not used against your quota.";
}
if ($success){
        //Test if user has file in another activity
        $sql = "
        SELECT contentId
        FROM support_files 
        WHERE userId = '$userId'
        AND contentId = '$contentId'
        AND doenetId != '$doenetId'
        ";
        $result = $conn->query($sql);

        if ($result->num_rows > 0){
                $count_against_quota = false;
                $msg = "Found the file in another activity.  Not used against your quota.";
        }
}


if ($success){
        $sql = "
        INSERT INTO support_files 
        (userId,fileName,contentId,doenetId,fileType,description,sizeInBytes,timestamp)
        VALUES
        ('$userId','$newFileName','$contentId','$doenetId','$type','$description','$size',NOW())
        ";
        $result = $conn->query($sql);
}

// set response code - 200 OK
http_response_code(200);

$response_arr = array("success" => $success,
                       "contentId" => $contentId,
                        "fileName" => $newFileName,
                        "description" => $description,
                        "msg" => $msg,
                        "count_against_quota" => $count_against_quota);

// make it json format
echo json_encode($response_arr);

$conn->close();
