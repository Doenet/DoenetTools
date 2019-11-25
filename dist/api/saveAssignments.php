<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";


$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$number_assignments = count($_REQUEST["documentName"]);
$headingIdArrayLength = count($_REQUEST["headingIdArray"]);
$headingId =  mysqli_real_escape_string($conn,$_REQUEST["headingIdArray"][($headingIdArrayLength - 1)]);
//Find maxSortOrder
$sql = "SELECT MAX(sortOrder) AS maxSortOrder FROM assignment WHERE courseHeadingId = '".$headingId."';";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$maxSortOrder = mysqli_real_escape_string($conn,$row['maxSortOrder']);
$sortOrder = $maxSortOrder + 100;

$gradeCategory =  mysqli_real_escape_string($conn,$_REQUEST["gradeCategory"]);
$totalPointsOrPercent =  mysqli_real_escape_string($conn,$_REQUEST["totalPointsOrPercent"]);

for ($i = 0; $i < $number_assignments; $i++){
$documentName =  mysqli_real_escape_string($conn,$_REQUEST["documentName"][$i]);
$contentId =  mysqli_real_escape_string($conn,$_REQUEST["contentId"][$i]);
$assignmentId =  mysqli_real_escape_string($conn,$_REQUEST["assignmentId"][$i]);

//Get code using contentId
$sql = "SELECT code,latestVersion 
FROM content 
WHERE contentId='$contentId';";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$code = mysqli_real_escape_string($conn,$row['code']);
$latestVersion = mysqli_real_escape_string($conn,$row['latestVersion']);

$sql = "INSERT INTO assignment 
SET assignmentId='$assignmentId',
courseHeadingId='$headingId',
assignmentName='$documentName',
sourceContentId='$contentId', 
courseId='$courseId',
contentRevisionNumber='$latestVersion',
sortOrder='$sortOrder',
gradeCategory='$gradeCategory',
totalPointsOrPercent='$totalPointsOrPercent',
creationDate=NOW()
";

$result = $conn->query($sql);
$sortOrder = $sortOrder + 100;
}


if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
}else {
    echo "Error: " . $sql . "<br>" . $conn->error;
    }


$conn->close();

?>

