<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";


$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$direction =  mysqli_real_escape_string($conn,$_REQUEST["direction"]);
$courseHeadingId =  mysqli_real_escape_string($conn,$_REQUEST["courseHeadingId"]);
$prevHeadingId =  mysqli_real_escape_string($conn,$_REQUEST["prevHeadingId"]);
$nextHeadingId =  mysqli_real_escape_string($conn,$_REQUEST["nextHeadingId"]);
echo "\n-----<br />\n";
echo "courseId $courseId <br />\n";
echo "courseHeadingId $courseHeadingId <br />\n";
echo "direction $direction <br />\n";
echo "prev $prevHeadingId<br />\n";
echo "next $nextHeadingId<br />\n";
echo "\n-----<br />\n";

//$find the sortOrder when nextHeadingId  is blank
//Need this for up, down, left and right
if ($nextHeadingId === ""){
$sql = "
SELECT MAX(sortOrder) AS max_sort_order 
FROM course_heading
WHERE courseId = '$courseId'
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$nextSortOrder = $row['max_sort_order'] + 100;
}


if ($direction == "up" || $direction == "down"){
echo "UP or DOWN <br />\n";
$sql = "
SELECT * FROM course_heading
WHERE courseHeadingId = '$prevHeadingId' 
OR courseHeadingId = '$courseHeadingId'
OR courseHeadingId = '$nextHeadingId'
ORDER BY sortOrder
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$prevSortOrder = $row['sortOrder'];
$row = $result->fetch_assoc();
$courseHeadingSortOrder = $row['sortOrder'];

if ($nextHeadingId !== ""){
$row = $result->fetch_assoc();
$nextSortOrder = $row['sortOrder'];
} 


$headingSubtraction = $courseHeadingSortOrder - $prevSortOrder;
$headingAddition = $nextSortOrder - $courseHeadingSortOrder;

echo "prevSortOrder $prevSortOrder<br/>";
echo "courseHeadingSortOrder $courseHeadingSortOrder<br/>";
echo "nextSortOrder $nextSortOrder<br/>";
echo "headingSubtraction $headingSubtraction <br/>";
echo "headingAddition $headingAddition <br/>";

//Need to copy all as left overs could cause trouble otherwise
$sql = "UPDATE course_heading 
SET tempSortOrder = sortOrder
WHERE courseId = '$courseId'
";
$result = $conn->query($sql);

//adjust 
$sql = "UPDATE course_heading 
SET sortOrder = sortOrder - $headingSubtraction
WHERE courseId = '$courseId'
AND sortOrder < $nextSortOrder
AND sortOrder >= $courseHeadingSortOrder
";
$result = $conn->query($sql);

$sql = "UPDATE course_heading 
SET sortOrder = tempSortOrder + $headingAddition
WHERE courseId = '$courseId'
AND tempSortOrder >= $prevSortOrder
AND tempSortOrder < $courseHeadingSortOrder
";
$result = $conn->query($sql);
}

if ($direction == "left" || $direction == "right"){
$sql = "
SELECT * FROM course_heading
WHERE courseHeadingId = '$courseHeadingId'
OR courseHeadingId = '$nextHeadingId'
ORDER BY sortOrder
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$courseHeadingSortOrder = $row['sortOrder'];

if ($nextHeadingId !== ""){
$row = $result->fetch_assoc();
$nextSortOrder = $row['sortOrder'];
}
echo "nextSortOrder $nextSortOrder<br/>\n";
}

if ($direction == "left"){
$sql = "UPDATE course_heading 
SET headingLevel = headingLevel - 1
WHERE courseId = '$courseId'
AND sortOrder < $nextSortOrder
AND sortOrder >= $courseHeadingSortOrder
";
echo $sql;
$result = $conn->query($sql);
}

if ($direction == "right"){
$sql = "UPDATE course_heading 
SET headingLevel = headingLevel + 1
WHERE courseId = '$courseId'
AND sortOrder < $nextSortOrder
AND sortOrder >= $courseHeadingSortOrder
";
echo $sql;
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

