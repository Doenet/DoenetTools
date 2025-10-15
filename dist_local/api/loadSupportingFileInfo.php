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


$success = true;
$supportingFiles = [];

//TODO: Test if user has permission and space to see file info

list($userQuotaBytesAvailable,$quotaBytes) = getBytesAvailable($conn,$userId);

$canUpload = FALSE;
$sql = "
SELECT canUpload 
FROM user 
WHERE userId = '$userId'
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
if ($row['canUpload'] == '1'){$canUpload = TRUE;}

$sql = "
SELECT cid, fileType, description, asFileName, widthPixels, heightPixels, columnTypes
FROM support_files
WHERE doenetId='$doenetId'
AND isActivityThumbnail='0'
ORDER BY timestamp DESC
";

$result = $conn->query($sql);
  while ($row = $result->fetch_assoc()) {
    
    array_push($supportingFiles,
        array(
            "cid" => $row['cid'],
            "fileName" => getFileName($row['cid'],$row['fileType']),
            "fileType" => $row['fileType'],
            "width" => $row['widthPixels'],
            "height" => $row['heightPixels'],
            "columnTypes" => $row['columnTypes'],
            "asFileName" => $row['asFileName'],
            "description" => $row['description'],
        )
    );
}


// set response code - 200 OK
http_response_code(200);

$response_arr = array(
  "success" => $success,
  "supportingFiles" => $supportingFiles,
  "canUpload" => $canUpload,
  "userQuotaBytesAvailable" => $userQuotaBytesAvailable,
  "quotaBytes" => $quotaBytes,
);

// make it json format
echo json_encode($response_arr);

$conn->close();

