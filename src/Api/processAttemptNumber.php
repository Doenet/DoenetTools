<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');
include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$response_arr = array(
    "access"=> TRUE
);


$_POST = json_decode(file_get_contents("php://input"),true);
$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$newAttempt = mysqli_real_escape_string($conn,$_POST["newAttempt"]);

$sql = "SELECT MAX(attemptNumber) AS maxAttemptNumber
        FROM user_assignment_attempt
        WHERE assignmentId='$assignmentId'
        AND userId = '$userId'
";

$result = $conn->query($sql);
$row = $result->fetch_assoc();
// var_dump($row);

if ($row['maxAttemptNumber'] == NULL){
    $newAttempt = TRUE;
    $attemptNumber = 0;
}else{
    $attemptNumber = $row['maxAttemptNumber'];
}

if ($newAttempt){
    $attemptNumber++;
    $sql = "
    INSERT INTO user_assignment_attempt 
    (userId,assignmentId,attemptNumber)
    VALUES
    ('$userId','$assignmentId','$attemptNumber')
    ";
    $result = $conn->query($sql);
}



    // set response code - 200 OK
    http_response_code(200);

    echo $attemptNumber;
//  echo json_encode($response_arr);

$conn->close();
?>