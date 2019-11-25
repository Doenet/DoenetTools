<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);

include "exam_security.php";

$authPasscode = "test";

$sql = "
SELECT authPasscode
FROM course
WHERE courseId = '$courseId'
";
$result = $conn->query($sql);
if ($result->num_rows > 0){
  $row = $result->fetch_assoc();
  $authPasscode = $row["authPasscode"];
}

$response_arr = array(
  "authPasscode"=>$authPasscode,
  "legitAccessKey"=>$legitAccessKey
);
   
 // set response code - 200 OK
 http_response_code(200);

 echo json_encode($response_arr);


$conn->close();
?>