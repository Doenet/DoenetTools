<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";


$_POST = json_decode(file_get_contents("php://input"),true);
$serializedDocument = mysqli_real_escape_string($conn,$_POST["serializedDocument"]);
$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$conditionalUser =  mysqli_real_escape_string($conn,$_POST["learnerUsername"]);
if ($conditionalUser != "") {
  $remoteuser = $conditionalUser;
}

/*
    $sql = "
    SELECT
    id 
    FROM user_assignment_attempt 
    WHERE assignmentId ='$assignmentId' AND
    attemptNumber = '$attemptNumber' AND
    username = '$remoteUser'
    ";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();    
    $rowid = $row['id'];
*/

    $sql = "
    UPDATE user_assignment_attempt
    SET latestDocumentState = '$serializedDocument'
    WHERE assignmentId ='$assignmentId' AND
    attemptNumber = '$attemptNumber' AND
    username = '$remoteuser' 
    "; 
echo $sql;
    $result = $conn->query($sql);


// set response code - 200 OK
http_response_code(200);


$conn->close();


?>

