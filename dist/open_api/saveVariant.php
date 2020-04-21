<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";


$assignmentId = mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);
$assignedVariant = mysqli_real_escape_string($conn,$_REQUEST["assignedVariant"]);
$attemptNumber = mysqli_real_escape_string($conn,$_REQUEST["attemptNumber"]);
$contentId = mysqli_real_escape_string($conn,$_REQUEST["contentId"]);
$conditionalUser =  mysqli_real_escape_string($conn,$_REQUEST["learnerUsername"]);
if ($conditionalUser != "") {
  $remoteuser = $conditionalUser;
}
echo "assignmentId $assignmentId\n";
echo "assignedVariant $assignedVariant\n";
echo "attemptNumber $attemptNumber\n";
echo "remoteuser $remoteuser\n";
echo "contentId $contentId\n";

$sql = "INSERT INTO  user_assignment_attempt
(username,assignmentId,attemptNumber,assignedVariant,contentId,began) 
VALUES 
('$remoteuser','$assignmentId','$attemptNumber','$assignedVariant','$contentId',NOW());";
$response = $conn->query($sql); 

if ($response === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
}else {
    echo "Error: " . $sql . "<br>" . $conn->error;
    }


$conn->close();


?>

