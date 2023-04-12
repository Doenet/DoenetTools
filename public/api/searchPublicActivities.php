<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require 'defineDBAndUserAndCourseInfo.php';

$success = TRUE;
$message = "";

$q = mysqli_real_escape_string($conn,$_REQUEST["q"]);

if ($q == ""){
  $success = FALSE;
  $message = 'Internal Error: missing search query';
}

$matchingUsers = [];
$matchingActivities = [];
//Get Matching Activities 
if ($success) {

  // Doesn't show public from courses only portfolios
  $sql = "
  SELECT cc.doenetId,
  CAST(cc.jsonDefinition as CHAR) AS json,
  cc.imagePath,
  cc.label,
  cc.courseId,
  p.doenetId AS 'pageDoenetId'
  FROM course_content AS cc
  LEFT JOIN pages AS p
    ON p.containingDoenetId = cc.doenetId
  LEFT JOIN course AS c
    ON c.courseId = cc.courseId
  WHERE cc.label LIKE '%$q%'
  AND cc.isPublic = 1
  AND cc.isDeleted = 0
  AND c.portfolioCourseForUserId IS NOT NULL
  LIMIT 100
  ";
  
  $result = $conn->query($sql); 
  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
      $json = json_decode($row['json'], true);
      array_push($matchingActivities,[
        'type' => 'activity',
        'doenetId' => $row['doenetId'],
        'courseId' => $row['courseId'],
        'version' => $json['version'],
        'content' => $json['content'],
        'imagePath' => $row['imagePath'],
        'label' => $row['label'],
        'public' => '1',
        'pageDoenetId' => $row['pageDoenetId'],
      ]);
    }
    // $courseToOwnerFullName = [];
    foreach($matchingActivities as &$activity){
      $courseId = $activity['courseId'];
      $sql = "
      SELECT u.firstName,
      u.lastName
      FROM course_role AS cr
      LEFT JOIN course_user AS cu
      ON cu.roleId = cr.roleId
      LEFT JOIN user AS u
      ON u.userId = cu.userId
      WHERE cr.courseId = '$courseId'
      AND cr.isOwner = 1
      LIMIT 1 
      ";
      $result = $conn->query($sql); 

      if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $activity['fullName'] = $row['firstName'] . ' ' . $row['lastName'];
      }
    }
  }


  $sql = "
  SELECT c.courseId,
  u.firstName,
  u.lastName
  FROM user AS u
  LEFT JOIN course AS c
  ON c.portfolioCourseForUserId = u.userId
  WHERE c.portfolioCourseForUserId IS NOT NULL
  AND CONCAT(u.firstName, ' ', u.lastName) LIKE '%$q%'
  LIMIT 100
  ";
  
  $result = $conn->query($sql); 
  if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
      $json = json_decode($row['json'], true);
      array_push($matchingUsers,[
        'type' => 'author',
        'courseId' => $row['courseId'],
        'firstName' => $row['firstName'],
        'lastName' => $row['lastName'],
      ]);
    }
  }

  

}



$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "searchResults"=>["users"=>$matchingUsers,"activities"=>$matchingActivities],
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>