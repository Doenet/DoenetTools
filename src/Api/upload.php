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

// echo "\n\nuserId $userId \n\n";

// $_POST = json_decode(file_get_contents("php://input"),true);
// $size =  mysqli_real_escape_string($conn,$_POST["size"]);
$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);
// echo "\n\ndoenetId $doenetId\n";
// $type =  mysqli_real_escape_string($conn,$_POST["type"]);
// $trackingConsent =  mysqli_real_escape_string($conn,$_POST["trackingConsent"]);
// $dangerousContent = $_POST["content"];
// echo "\n\npost\n";
// var_dump($_POST);
// echo "\n file_get_contents\n";
// var_dump(file_get_contents("php://input"));
// echo "\n_FILES\n";
// var_dump($_FILES);
// $doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);

$success = true;

//TODO: Test if user has permission and space to upload files


$uploads_dir = '../media/';

$type = $_FILES['file']['type'];
$tmp_name = $_FILES['file']['tmp_name'];
$error = $_FILES['file']['error'];
$size = $_FILES['file']['size'];

$extension = '';
if ($type == 'image/jpeg'){
  $extension = '.jpg';
}else if ($type == 'text/csv'){
  $extension = '.csv';
}
// $contentId = hash('sha256', $dangerousContent);

$tmp_dest = $uploads_dir . 'tmp_' . $random_id . $extension;
// $newfile = fopen($destination, "w") or die("Unable to open file!");
//     $status = fwrite($newfile, $dangerousContent);
//     if ($status === false){
//       return "Didn't save to file";
//     }
//     fclose($newfile);

move_uploaded_file($tmp_name, $tmp_dest);

$SHA = hash_file("sha256",$tmp_dest);
echo "\n SHA $SHA \n";

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



$sql = "
INSERT INTO support_files 
(userId,fileName,contentId,doenetId,fileType,sizeInBytes,timestamp)
VALUES
('$userId','$newFileName','$contentId','$doenetId','$type','$size',NOW())
";
$result = $conn->query($sql);

// set response code - 200 OK
http_response_code(200);

$response_arr = array("success" => $success,
                       "contentId" => $contentId,
                        "fileName" => $newFileName);

// make it json format
echo json_encode($response_arr);

$conn->close();
