<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$success = TRUE;
$message = '';

$doenetId =  mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);  
$code =  mysqli_real_escape_string($conn,$_REQUEST["code"]);  

if ($doenetId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing doenetId';
}elseif ($code == ""){
    $success = FALSE;
    $message = 'Internal Error: missing code';
}

//Find driveId
if ($success){
    $sql = "
    SELECT driveId,
    isReleased
    FROM drive_content
    WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $driveId = $row['driveId'];
        $isReleased = $row['isReleased'];

        if ($isReleased == 0){
            $success = FALSE;
            $message = "Exam is not released"; 
        }
    }else{
        $success = FALSE;
        $message = "There is a problem with the doenetId";
    }
    
}


//Test Code
if ($success){
    $sql = "
    SELECT examPasscode
    FROM drive
    WHERE driveId='$driveId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $correctPasscode = $row['examPasscode'];
        if ($correctPasscode != $code){
            $success = FALSE;
            $message = "Wrong Passcode. Try Again.";
        }
    }else{
        $success = FALSE;
        $message = "There is a problem with the driveId";
    }
}

//Get Enrollment data
if ($success){
    $sql = "
    SELECT 
    firstName,
    lastName,
    empId,
    userId
    FROM enrollment
    WHERE driveId='$driveId'
    ";
    $result = $conn->query($sql);
    $learners = array();
    while($row = $result->fetch_assoc()) {
        $learner = array(
            "firstName"=>$row['firstName'],
            "lastName"=>$row['lastName'],
            "studentId"=>$row['empId'],
            "userId"=>$row['userId'],

        );
        array_push($learners,$learner);
    }

}


$response_arr = array(
    "success" => $success,
    "message" => $message,
    "learners" => $learners,
    );

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

