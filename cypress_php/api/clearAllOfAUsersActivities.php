<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include '../api/db_connection.php';

$message = "";
$success = TRUE;

$userId = $_REQUEST['userId'];
if ($userId == ''){
    $userId = 'cyuserid';
}


$sql = "
DELETE FROM user_assignment
WHERE userId='$userId'
";
$result = $conn->query($sql);

$sql = "
DELETE FROM user_assignment_attempt
WHERE userId='$userId'
";
$result = $conn->query($sql);

$sql = "
DELETE FROM user_assignment_attempt_item
WHERE userId='$userId'
";
$result = $conn->query($sql);

$sql = "
SELECT courseId
FROM course_user
WHERE userId='$userId'
";
$result = $conn->query($sql); 
$courseIds = [];
while($row = $result->fetch_assoc()) {
  array_push($courseIds,$row['courseId']); 
}
foreach($courseIds AS $courseId){

  //Pages automatically are deleted
  $sql = "
  DELETE FROM course_content
  WHERE courseId='$courseId'
  ";
  $result = $conn->query($sql);
  
  $sql = "
  DELETE FROM assignment
  WHERE courseId='$courseId'
  ";
  $result = $conn->query($sql);

  $sql = "
  DELETE FROM activity_state
  WHERE userId='$userId'
  ";
  $result = $conn->query($sql);

  $sql = "
  DELETE FROM page_state
  WHERE userId='$userId'
  ";
  $result = $conn->query($sql);

}

$response_arr = array(
  "message" => $message,
  "success" => $success
  );

http_response_code(200);
echo json_encode($response_arr);

 $conn->close();
?>