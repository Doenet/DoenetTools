<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "userQuotaBytesAvailable.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];


$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);


$success = true;
$supportingFiles = [];
$canUpload = FALSE;

//TODO: Test if user has permission and space to see file info

list($userQuotaBytesAvailable,$quotaBytes) = getBytesAvailable($conn,$userId);

$sql = "
SELECT du.canUpload 
FROM drive_user AS du
LEFT JOIN drive_content AS dc
ON dc.driveId = du.driveId
WHERE du.userId = '$userId'
AND dc.doenetId = '$doenetId'
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
if ($row['canUpload'] == '1'){$canUpload = TRUE;}

$sql = "
SELECT contentId, fileName, fileType, description
FROM support_files
WHERE doenetId='$doenetId'
ORDER BY timestamp
";

$result = $conn->query($sql);
  while ($row = $result->fetch_assoc()) {
    array_push($supportingFiles,
        array(
            "contentId" => $row['contentId'],
            "fileName" => $row['fileName'],
            "fileType" => $row['fileType'],
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

