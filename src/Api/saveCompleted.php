<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$isCompleted = mysqli_real_escape_string($conn,$_REQUEST["isCompleted"]);

$success = TRUE;
$message = "";

if ($doenetId == ""){
$success = FALSE;
$message = 'Internal Error: missing doenetId';
}
if ($success){
        $sql = "
        SELECT completed
        FROM user_assignment
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        ";
        $result = $conn->query($sql);
        if ($result->num_rows == 0) {
         //Insert completed
         $sql = "INSERT INTO user_assignment (doenetId,userId,completed,completedDate)
         VALUES
         ('$doenetId','$userId',1,CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))
         ";
        $result = $conn->query($sql);
        
        }else{
          $row = $result->fetch_assoc();
          $prevcompleted = $row['completed'];
          
          if ($prevcompleted != '1' || $isCompleted){
          $sql = "UPDATE user_assignment 
                SET completed=1,completedDate=CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
                WHERE userId = '$userId'
                AND doenetId = '$doenetId'
          ";
          }else{
                $sql = "UPDATE user_assignment 
                SET completed=0,completedDate=NULL
                WHERE userId = '$userId'
                AND doenetId = '$doenetId'
                ";
          }
          $result = $conn->query($sql);

        }
}



$response_arr = array(
        "success"=>$success,
        "message"=>$message
        );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>