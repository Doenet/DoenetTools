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

$success = TRUE;
$message = "";

if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}

// //Check if they have view rights
if ($success){

  $sql = "
  SELECT du.role 
  FROM drive_user AS du
  LEFT JOIN drive_content AS dc
  ON dc.driveId = du.driveId
  WHERE du.userId = '$userId'
  AND dc.doenetId = '$doenetId'
  ";

  $result = $conn->query($sql);  
  $row = $result->fetch_assoc();
  $role = $row['role'];

  //Students should only see their own data
  if ($role != 'Instructor' && 
      $role != 'Owner'
  ){
    $success = FALSE;
    $message = "No access to view survey.";
  }

}

//Get Survey data
if ($success){
  $sql = "
  SELECT e.firstName,
  e.lastName,
  e.email,
  e.empId,
  ci.stateVariables
  FROM content_interactions AS ci
  LEFT JOIN assignment AS a
  ON a.doenetId = ci.doenetId
  LEFT JOIN enrollment AS e
  ON e.userId = ci.userId AND a.driveId = e.driveId
  WHERE ci.doenetId = '$doenetId'
  ";

$result = $conn->query($sql); 
$responses = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
      array_push($responses,array(
                "firstName"=>$row['firstName'],
                "lastName"=>$row['lastName'],
                "studentId"=>$row['empId'],
                "email"=>$row['email'],
                "stateVariables"=>$row['stateVariables'],
      ));
    }
}
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "responses"=>$responses,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>