<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";


$headingText =  mysqli_real_escape_string($conn,$_REQUEST["headingText"]);
$courseHeadingId =  mysqli_real_escape_string($conn,$_REQUEST["courseHeadingId"]);
$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$headingLevel = mysqli_real_escape_string($conn,$_REQUEST["headingLevel"]);
$parentHeadingId =  mysqli_real_escape_string($conn,$_REQUEST["parentHeadingId"]);
echo "\n-----\n";
echo "headingText $headingText \n";
echo "courseHeadingId $courseHeadingId \n";
echo "courseId $courseId \n";
echo "headingLevel $headingLevel \n";
echo "parentHeadingId $parentHeadingId \n";
echo "\n-----\n";

if ($parentHeadingId == ""){
//Base level so just find the last sortOrder and increment by 100
$sql = "SELECT MIN(sortOrder) AS minSortOrder
FROM course_heading 
WHERE courseId = '$courseId';";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
//$minSortOrder = mysqli_real_escape_string($conn,$row['minSortOrder']);
//echo "minSortOrder $minSortOrder\n";

$sql = "UPDATE course_heading 
SET sortOrder = sortOrder + 100
WHERE courseId = '$courseId'";
$result = $conn->query($sql);

$sql = "INSERT INTO course_heading SET
courseHeadingId = '$courseHeadingId',
headingText = '$headingText',
courseId = '$courseId',
headingLevel = '$headingLevel',
sortOrder = '100'
";
$result = $conn->query($sql);
}else{
//has a parent
$sql = "SELECT sortOrder AS parentSortOrder
FROM course_heading 
WHERE courseHeadingId = '$parentHeadingId';";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$parentSortOrder = $row['parentSortOrder'];

$sql = "UPDATE course_heading 
SET sortOrder = sortOrder + 100
WHERE courseId = '$courseId'
AND sortOrder > '$parentSortOrder'";
$result = $conn->query($sql);

$insertSortOrder = $parentSortOrder + 100;
$sql = "INSERT INTO course_heading SET
courseHeadingId = '$courseHeadingId',
headingText = '$headingText',
courseId = '$courseId',
headingLevel = '$headingLevel',
sortOrder = '$insertSortOrder'
";
$result = $conn->query($sql);
}


if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
}else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();

?>

