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
$driveId =  mysqli_real_escape_string($conn,$_REQUEST["driveId"]);  
$code =  mysqli_real_escape_string($conn,$_REQUEST["code"]);  

if ($doenetId == "" && $driveId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing doenetId or driveId';
}elseif ($code == ""){
    $success = FALSE;
    $message = 'Internal Error: missing code';
}

//Find driveId
if ($success && $driveId == ''){
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

    foreach ($learners AS &$learner){
        $userId = $learner['userId'];
        $sql = "
        SELECT MAX(began) AS began,
        doenetId
        FROM user_assignment_attempt
        WHERE userId = '$userId'
        GROUP BY doenetId
        ";

        $result = $conn->query($sql);
        $exam_to_date = array();
        while($row = $result->fetch_assoc()){
            $exam_to_date[$row['doenetId']] = $row['began'];
        }
        $learner['exam_to_date'] = $exam_to_date;
    }

}

//Get Exam data
if ($success){
    $sql = "
    SELECT dc.label AS label,
    dc.doenetId AS doenetId
    FROM drive_content AS dc
    LEFT JOIN assignment AS a
    ON a.doenetId = dc.doenetId
    WHERE dc.driveId = '$driveId'
    AND dc.isReleased = '1'
    AND a.proctorMakesAvailable = '1'
    AND a.assignedDate <= NOW()
    AND a.dueDate >= NOW()
    ORDER BY dc.label
    ";
    $result = $conn->query($sql);
    $exams = array();
    while($row = $result->fetch_assoc()) {
        $exam = array(
            "label"=>$row['label'],
            "doenetId"=>$row['doenetId'],
        );
        array_push($exams,$exam);
    }

}


$response_arr = array(
    "success" => $success,
    "message" => $message,
    "learners" => $learners,
    "exams" => $exams,
    );

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

