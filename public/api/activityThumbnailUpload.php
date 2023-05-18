<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

// include "randomId.php";
include 'userQuotaBytesAvailable.php';
include 'getFilename.php';
include 'cidFromSHA.php';

$doenetId = mysqli_real_escape_string($conn, $_POST['doenetId']);

$success = true;
$msg = '';

$uploads_dir = '../media/';

$type = $_FILES['file']['type'];
$tmp_name = $_FILES['file']['tmp_name'];
$error = $_FILES['file']['error'];
$size = $_FILES['file']['size'];
$original_file_name = $_FILES['file']['name'];

$tmp_dest = $uploads_dir . getFileName('tmp_' . $random_id, $type);

if ($type != "image/png" && $type != "image/jpeg"){
    $success = false;
    $msg = "Only .png or .jpg files. '$original_file_name' can not be uploaded.";
}
//Test if user has space to upload files
if ($success) {
    list($userQuotaBytesAvailable, $quotaBytes) = getBytesAvailable(
        $conn,
        $userId
    );

    if ($userQuotaBytesAvailable - $size <= 0) {
        $success = false;
        $msg = "You don't have enough space in your quota to upload files.";
    }
}

if ($success) {
    if ($size > 1000000) {
        $success = false;
        $msg = 'File is larger than 1MB limit.';
    }
}

$activity_had_a_thumbnail_already = false;

if ($success) {
    move_uploaded_file($tmp_name, $tmp_dest);
    $SHA = hash_file('sha256', $tmp_dest);
    $cid = cidFromSHA($SHA);

    $newFileName = getFileName($cid, $type);
    $destination = $uploads_dir . $newFileName;

    rename($tmp_dest, $destination);

    $mime_type = mime_content_type($destination);

    $width = 0;
    $height = 0;
    if ($mime_type == 'image/jpeg' || $mime_type == 'image/png') {
        list($width, $height) = getimagesize($destination);
    }

}

if ($success) {
    //Test if user has a thumbnail row for this activity
    $sql = "
        SELECT cid
        FROM support_files 
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND isActivityThumbnail = '1'
        ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $activity_had_a_thumbnail_already = true;
    }
}

$escapedType = str_replace('\/', '/', $type);


if ($success) {
    if ($activity_had_a_thumbnail_already){
        //Update for activity thumbnails once one is already stored
        $sql = "
        UPDATE support_files 
        SET cid = '$cid',
        fileType = '$escapedType',
        asFileName = '$original_file_name',
        sizeInBytes = '$size',
        widthPixels = '$width',
        heightPixels = '$height',
        timestamp = CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
        WHERE doenetId = '$doenetId'
        and userId = '$userId'
        ";
        $conn->query($sql);
        
    }else{
        //Insert all support files and first activity thumbnail
        $sql = "
        INSERT INTO support_files 
        (userId,cid,doenetId,fileType,description,asFileName,sizeInBytes,widthPixels,heightPixels,timestamp,isActivityThumbnail)
        VALUES
        ('$userId','$cid','$doenetId','$escapedType','','$original_file_name','$size','$width','$height',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'),'1')
        ";
        $conn->query($sql);

    }
}
//Update activity to have the thumbnail path
//Note: the browser converts images to jpg before they are sent here
if ($success) {
    $sql = "
    UPDATE course_content 
    SET imagePath = '/media/$cid.jpg'
    WHERE doenetId = '$doenetId'
    ";
    $conn->query($sql);
}

    if ($success) {
    list($userQuotaBytesAvailable, $quotaBytes) = getBytesAvailable(
        $conn,
        $userId
    );
}

// set response code - 200 OK
http_response_code(200);

$response_arr = [
    'success' => $success,
    'cid' => $cid,
    'fileName' => $newFileName,
    'asFileName' => $original_file_name,
    'width' => $width,
    'height' => $height,
    'msg' => $msg,
    'userQuotaBytesAvailable' => $userQuotaBytesAvailable,
    'type' => $type,
];

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
