<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: access');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Credentials: true');
  header('Content-Type: application/json');

  include '../api/db_connection.php';

  $message = "";
  $success = TRUE;
  $courseId = "courseid1";

  if (!$courseId) {
    $success = false;
    $message = 'Missing courseId';
  } 

  if ($success){
    $sql = "SELECT userId FROM course_user WHERE courseId = '$courseId'";
    $result = $conn->query($sql); 

    $userIds = [];
    while ($row = $result->fetch_assoc()) {
      array_push($userIds, $row["userId"]);
    }
    $userIds = implode("','", $userIds);

    $sql = "DELETE FROM user WHERE userId in ('$userIds')";
    $result = $conn->query($sql); 

    $sql = "DELETE FROM course_user WHERE courseId = '$courseId'";
    $result = $conn->query($sql); 
  }

  $response_arr = array(
    "message" => $message,
    "success" => $success,
  );

  http_response_code(200);
  echo json_encode($response_arr);

 $conn->close();
?>