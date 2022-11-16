<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include "jwtArray.php";
$requestorUserId = $jwtArray['userId'];

$success = true;
$message = '';

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$searchUserId = mysqli_real_escape_string($conn,$_REQUEST["userId"]);
$newDateString = mysqli_real_escape_string($conn,$_REQUEST["newDateString"]);


if ($doenetId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing doenetId';
}elseif ($searchUserId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing userId';
}elseif ($newDateString == ""){
    $success = FALSE;
    $message = 'Internal Error: missing newDateString';
}

/// get courseId from doenetId
if ($success){
    $sql = "
        SELECT courseId
        FROM assignment
        WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);  
    if ($result->num_rows == 0){
        $success = FALSE;
        $message = 'No assignment matches doenetId';
    } else {
        $row = $result->fetch_assoc();
        $courseId = $row['courseId'];
    }
}

//Check permissions 
if ($success){

    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $requestorUserId,
        $courseId
    );

    if ($requestorPermissions == false) {
        $success = false;
        $message = 'You are not authorized to view or modify grade data';
    } elseif ($requestorPermissions['canViewAndModifyGrades'] != '1') {
        $success = false;
        $message = 'You are not authorized to modify grade data';
    }

}



if ($success){
    //Because sending null wont allow for param testing
    if ($newDateString == 'Cancel Due Date Override'){
        $sql = "
        INSERT INTO user_assignment
        (doenetId,userId,dueDateOverride)
        VALUES
        ('$doenetId','$searchUserId',NULL)
        ON DUPLICATE KEY UPDATE 
        dueDateOverride = VALUES(dueDateOverride)
        ";
    }else{
        $sql = "
        INSERT INTO user_assignment
        (doenetId,userId,dueDateOverride)
        VALUES
        ('$doenetId','$searchUserId','$newDateString')
        ON DUPLICATE KEY UPDATE 
        dueDateOverride = VALUES(dueDateOverride)
        ";
    }
    
    $result = $conn->query($sql);  
}



$response_arr = array(
    'success' => $success,
    'message' => $message,
);

// set response code - 200 OK
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
