<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);

$success = TRUE;
$message = "";

if ($driveId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing driveId';
}

//Check if they have view rights
if ($success){
  $sql = "
  SELECT role
  FROM drive_user
  WHERE driveId = '$driveId'
  and userId = '$userId'
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

//Get Assignment data
if ($success){
  $sql = "
  SELECT dc.label, dc.doenetId
  FROM drive_content AS dc
  INNER JOIN assignment AS a
  ON dc.doenetId = a.doenetId
  WHERE
  dc.driveId = '$driveId'
  AND a.gradeCategory = ''
  AND a.totalPointsOrPercent = 0
  AND dc.isDeleted = '0'
  AND dc.isReleased = '1'
  ";


$result = $conn->query($sql); 
$surveys = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
      array_push($surveys,array(
                "label"=>$row['label'],
                "doenetId"=>$row['doenetId'],
      ));
    }
}
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "surveys"=>$surveys,
  );


// set response code - 200 OK
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>