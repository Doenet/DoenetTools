<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";


$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";


//Test Permission to edit content
if ($success){
  $courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
  $doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);


$permissions = permissionsAndSettingsForOneCourseFunction($conn,$userId,$courseId);
  if ($permissions["canViewActivitySettings"] != '1'){
    $success = FALSE;
    $message = "You need permission to view the activity's settings.";
  }
}

$restrictedTo = [];


if ($success){

  $sql = "SELECT u.email
    FROM user_assignment AS ua
    LEFT JOIN course_user AS cu
    ON ua.userId = cu.userId
    LEFT JOIN user AS u
    ON cu.userId = u.userId
    WHERE ua.doenetId = '$doenetId'
    AND ua.isUnassigned = '0'
    AND cu.courseId = '$courseId'
    ";
  $result = $conn->query($sql); 
  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
      array_push($restrictedTo,$row['email']);
    }
  }

}



$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "restrictedTo" => $restrictedTo
);


// set response code - 200 OK
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>