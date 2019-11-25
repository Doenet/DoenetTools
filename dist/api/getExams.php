<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
// $courseId = "aI8sK4vmEhC5sdeSP3vNW"; 
include "exam_security.php";


if ($legitAccessKey == 1){
  //Have access
  $exams_arr = array();

  $sql = "
  SELECT a.assignmentName AS assignmentName,
  a.contentId AS contentId,
  a.assignmentId AS assignmentId,
  ua.completed AS completed
  FROM course_enrollment AS ce
  LEFT JOIN assignment AS a
  ON a.courseId = ce.courseId
  LEFT JOIN user_assignment AS ua
  ON a.assignmentId = ua.assignmentId 
  AND ua.username = ce.username
  WHERE ce.courseId = '$courseId'
  AND ce.username = '$remoteuser'
  AND ce.withdrew != 1
  AND proctorMakesAvailable = '1'
  ";

  $result = $conn->query($sql);

  if ($result->num_rows > 0){
    while($row = $result->fetch_assoc()){ 
      if ($row["completed"] != "1"){
        $exam_arr = array(
          "title" => $row["assignmentName"],
          "contentId" => $row["contentId"],
          "assignmentId" => $row["assignmentId"],
        );
        array_push($exams_arr, $exam_arr);
      }
    }
  }


  $response_arr = array( 
    "exams" => $exams_arr,
    "username" => $remoteuser,
  );
}else{
  //Don't have access
  $response_arr = array( 
    "configHelp" => $configHelp,
  );

}
   
 // set response code - 200 OK
 http_response_code(200);
     
 // make it json format
 echo json_encode($response_arr);



$conn->close();
?>