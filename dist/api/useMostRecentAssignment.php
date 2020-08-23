<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";


$assignmentId =  mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);

$sql = "
SELECT c.contentId AS contentId
FROM assignment AS a
LEFT JOIN content AS c
ON a.sourceBranchId = c.branchId
WHERE a.assignmentId = '$assignmentId' AND c.draft = 0
ORDER BY c.timestamp DESC
";

$result = $conn->query($sql); 
         
$row = $result->fetch_assoc();
$contentId = $row['contentId'];
echo $contentId;

$sql = "
UPDATE assignment
SET contentId = '$contentId'
WHERE assignmentId = '$assignmentId'
;";
$result = $conn->query($sql); 
    
if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
}else {
    echo "Error: " . $sql . "<br>" . $conn->error;
    }

$conn->close();

?>
           
