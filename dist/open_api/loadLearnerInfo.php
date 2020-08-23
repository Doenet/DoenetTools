<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
include "exam_security.php";

if ($legitAccessKey == 1){
  //Have access
  $learners_arr = array();

  $sql = "
  SELECT ce.firstName AS firstName,
  ce.lastName AS lastName,
  ce.empId AS learnerID,
  ce.username AS username
  FROM course_enrollment AS ce
  WHERE ce.courseId = '$courseId'
  AND ce.withdrew != 1
  ";

  $result = $conn->query($sql);

  if ($result->num_rows > 0){
    while($row = $result->fetch_assoc()){ 
      if ($row["completed"] != "1"){
        $learner_arr = array(
          "username" => $row["username"],
          "learnerID" => $row["learnerID"],
          "firstName" => $row["firstName"],
          "lastName" => $row["lastName"],
        );
        array_push($learners_arr, $learner_arr);
      }
    }
  }

  $response_arr = array( 
    "legitAccessKey" => 1,
    "learnersInfo" => $learners_arr,
  );
}else{
  //Don't have access
  $response_arr = array( 
    "legitAccessKey" => 0,
    "configHelp" => $configHelp,

  );

}
   
 // set response code - 200 OK
 http_response_code(200);
     
 // make it json format
 echo json_encode($response_arr);



$conn->close();
?>