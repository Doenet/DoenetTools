<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = true;
$message = '';
$dueDateInfo = [];

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$searchUserId = mysqli_real_escape_string($conn,$_REQUEST["userId"]);


if ($doenetId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing doenetId';
}elseif ($searchUserId == ""){
$success = FALSE;
$message = 'Internal Error: missing searchUserId';
}

//Check permissions 
if ($success){

    $sql = "
    SELECT du.canEditContent AS canEditContent
    FROM drive_user AS du
    LEFT JOIN drive_content AS dc
    ON dc.driveId = du.driveId
    WHERE dc.doenetId = '$doenetId'
    and du.userId = '$userId'
    ";
    $result = $conn->query($sql);  
    if ($result->num_rows > 0){
        $row = $result->fetch_assoc();
        if ($row['canEditContent'] == '0'){
            $success = FALSE;
            $message = 'No permisson to view dueDate';
        }
    }else{
        $success = FALSE;
        $message = 'No permisson to view dueDate';
    }
}

// check to make sure assignment exists
// if ($success){
//     $sql = "
//         SELECT doenetId
//         FROM assignment
//         WHERE assignment.doenetId = '$doenetId'
//     ";
//     $result = $conn->query($sql);  
//     if ($result->num_rows == 0){
//         $success = FALSE;
//         $message = 'No assignment matches doenetId';
//     }
// }

if ($success){
    $sql = "
    SELECT dueDateOverride
    FROM user_assignment
    WHERE userId = '$searchUserId'
    AND doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);  
    $dueDateInfo['dueDateOverride'] = NULL;
    if ($result->num_rows > 0){
        $row = $result->fetch_assoc();
        $dueDateInfo['dueDateOverride'] = $row['dueDateOverride'];
    }

    $sql = "
    SELECT dueDate
    FROM assignment
    WHERE doenetId = '$doenetId'
    ";

    $result = $conn->query($sql);  
    $dueDateInfo['dueDate'] = NULL;
    if ($result->num_rows > 0){
        $row = $result->fetch_assoc();
        $dueDateInfo['dueDate'] = $row['dueDate'];
    }
}



$response_arr = array(
    'success' => $success,
    'dueDateInfo' => $dueDateInfo,
    'message' => $message,
);

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
