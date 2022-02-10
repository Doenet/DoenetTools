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


//TODO: Test if user has permission and space to upload files

$uploads_dir = '../media/';

$type = $_FILES['file']['type'];
$tmp_name = $_FILES['file']['tmp_name'];
$error = $_FILES['file']['error'];
$size = $_FILES['file']['size'];
$original_file_name = $_FILES['file']['name'];
$description = substr($original_file_name, 0, strrpos($original_file_name, "."));



$tmp_dest = $uploads_dir . getFileName('tmp_' . $random_id,$type);

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
$newFileName = getFileName($contentId,$type);
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
                $msg = "Found the file in another activity.  Not used against your quota.";
        }
}


if ($success){
        $sql = "
        INSERT INTO support_files 
        (userId,contentId,doenetId,fileType,description,sizeInBytes,timestamp)
        VALUES
        ('$userId','$contentId','$doenetId','$type','$description','$size',NOW())
        ";
        $result = $conn->query($sql);
}

list($userQuotaBytesAvailable,$quotaBytes) = getBytesAvailable($conn,$userId);

// set response code - 200 OK
http_response_code(200);

$response_arr = array("success" => $success,
                       "contentId" => $contentId,
                        "fileName" => $newFileName,
                        "description" => $description,
                        "msg" => $msg,
                        "userQuotaBytesAvailable" => $userQuotaBytesAvailable);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>