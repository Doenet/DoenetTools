<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$success = TRUE;
$message = '';

// $doenetId =  mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);  
$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);  
$code =  mysqli_real_escape_string($conn,$_REQUEST["code"]);  

if ($courseId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing courseId';
}elseif ($code == ""){
    $success = FALSE;
    $message = 'Internal Error: missing code';
}


//TODO: Check browser key

//Test Code
if ($success){
    $sql = "
    SELECT examPasscode
    FROM course
    WHERE courseId='$courseId'
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
        $message = "There is a problem with the courseId";
    }
}

//Get Enrollment data
if ($success){
    $sql = "
    SELECT 
    u.firstName,
    u.lastName,
    cu.externalId,
    cu.timeLimitMultiplier,
    cu.userId
    FROM course_user AS cu
    INNER JOIN course_role AS cr
    ON cr.roleId = cu.roleId AND cr.courseId = cu.courseId
    INNER JOIN user AS u
    ON cu.userId = u.userId
    WHERE cu.courseId='$courseId'
    AND cu.withdrew = '0'
    AND cr.isIncludedInGradebook = '1'
    ";
    $result = $conn->query($sql);
    $learners = [];
    while($row = $result->fetch_assoc()) {
        $learner = array(
            "firstName"=>$row['firstName'],
            "lastName"=>$row['lastName'],
            "studentId"=>$row['externalId'],
            "userId"=>$row['userId'],
            "timeLimitMultiplier"=>$row['timeLimitMultiplier'],

        );
        array_push($learners,$learner);
    }

    foreach ($learners AS &$learner){
        $userId = $learner['userId'];

        $sql = "
        SELECT uaa.doenetId,
		MAX(uaa.began) AS began
        FROM user_assignment_attempt AS uaa
        LEFT JOIN assignment AS a
        ON a.doenetId = uaa.doenetId
        WHERE uaa.userId = '$userId'
        AND a.proctorMakesAvailable = '1'
        GROUP BY doenetId
        ";

        $result = $conn->query($sql);
        $exam_to_date = array();
        $doenetIds = array();

        while($row = $result->fetch_assoc()){
            $exam_to_date[$row['doenetId']] = $row['began'];
            array_push($doenetIds,$row['doenetId']);
        }
        $learner['exam_to_date'] = $exam_to_date;


        
    }

}

//Get Exam data
if ($success){
    $sql = "
    SELECT cc.label,
    cc.doenetId,
    a.timeLimit
    FROM course_content AS cc
    INNER JOIN assignment AS a
    ON a.doenetId = cc.doenetId
    WHERE cc.courseId = '$courseId'
    AND cc.isAssigned = '1'
    AND cc.isGloballyAssigned = '1'
    AND a.proctorMakesAvailable = '1'
    AND cc.isDeleted = '0'
    ORDER BY cc.label
    ";
    // AND (a.assignedDate <= CONVERT_TZ(NOW(), @@session.time_zone, '+00:00') OR a.assignedDate IS NULL)
    // AND (a.dueDate >= CONVERT_TZ(NOW(), @@session.time_zone, '+00:00') OR a.dueDate IS NULL)
    $result = $conn->query($sql);
    $exams = array();
    while($row = $result->fetch_assoc()) {
        $exam = array(
            "label"=>$row['label'],
            "doenetId"=>$row['doenetId'],
            "timeLimit"=>$row['timeLimit']
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

