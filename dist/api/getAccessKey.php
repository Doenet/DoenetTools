<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
// header('Content-Type: application/json');

include "db_connection.php";

$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$remoteuser = $_SERVER[ 'REMOTE_USER' ];

$sql = "
SELECT id
FROM user
WHERE adminAccessAllowed = '1'
AND username = '$remoteuser'
";
$result = $conn->query($sql);
if ($result->num_rows > 0){
  //Have access

  $sql = "
  SELECT secureAssignmentAccessKey
  FROM course
  WHERE courseId = '$courseId'
  ";
  $result = $conn->query($sql);

  if ($result->num_rows > 0){
    $row = $result->fetch_assoc();
    echo $row['secureAssignmentAccessKey'];
  }


}
   
 // set response code - 200 OK
 http_response_code(200);



$conn->close();
?>