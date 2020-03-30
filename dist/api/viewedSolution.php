<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";


$assignmentId = mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_REQUEST["attemptNumber"]);
$itemNumber = mysqli_real_escape_string($conn,$_REQUEST["itemNumber"]);
$conditionalUser =  mysqli_real_escape_string($conn,$_REQUEST["learnerUsername"]);
if ($conditionalUser != "") {
  $remoteuser = $conditionalUser;
}
/*
echo "assignmentId $assignmentId\n";
echo "attemptNumber $attemptNumber\n";
echo "remoteuser $remoteuser\n";
echo "itemNumber $itemNumber\n";
*/


//user_assignment insert if no info stored
$sql = "
SELECT id
FROM user_assignment
WHERE assignmentId = '$assignmentId' AND
username = '$remoteuser'
";
$result = $conn->query($sql); 

if ($result->num_rows == 0){
    $sql = "
    INSERT INTO user_assignment
    (assignmentId,username)
    VALUES
    ('$assignmentId','$remoteuser')
    ";
}

//user_assignment_attempt insert if no info stored
$sql = "
SELECT id
FROM user_assignment_attempt
WHERE assignmentId = '$assignmentId' AND
attemptNumber = '$attemptNumber' AND
username = '$remoteuser'
";
$result = $conn->query($sql); 

if ($result->num_rows == 0){
    $sql = "
    INSERT INTO user_assignment_attempt
    (assignmentId,attemptNumber,username)
    VALUES
    ('$assignmentId','$attemptNumber','$remoteuser')
    ";
}


$sql = "SELECT id FROM user_assignment_attempt_item 
WHERE 
assignmentId = '$assignmentId' AND
attemptNumber = '$attemptNumber' AND
username = '$remoteuser' AND
itemNumber = '$itemNumber'";
$result = $conn->query($sql); 


if ($result->num_rows > 0){
$row = $result->fetch_assoc();
//Update
$sql = "
UPDATE user_assignment_attempt_item
SET viewedSolution = '1',
viewedSolutionDate = NOW()
WHERE 
assignmentId = '$assignmentId' AND
attemptNumber = '$attemptNumber' AND
username = '$remoteuser' AND
itemNumber = '$itemNumber'";
$result = $conn->query($sql); 

}else{
//Insert
$sql = "
INSERT INTO user_assignment_attempt_item 
(username,assignmentId,attemptNumber,itemNumber,viewedSolution,viewedSolutionDate) 
VALUES 
('$remoteuser','$assignmentId','$attemptNumber','$itemNumber',1,NOW())
";
$result = $conn->query($sql); 
}

/*
$sql = "INSERT INTO  user_assignment_attempt
(username,assignmentId,attemptNumber,assignedVersion,contentRevisionNumber,began) 
VALUES 
('$remoteuser','$assignmentId','$attemptNumber','$assignedVersion','$revisionNumber',NOW());";
$response = $conn->query($sql); 


if ($response === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
}else {
    echo "Error: " . $sql . "<br>" . $conn->error;
    }

*/

http_response_code(200);

$conn->close();


?>

