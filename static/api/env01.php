<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$sql = "
SELECT username,accessAllowed,adminAccessAllowed,courseId FROM `user_permissions_on_courses` 
WHERE username='devuser' AND accessAllowed='1';
";
$courseId_info_arr = array();
$result = $conn->query($sql); 
$access = $result->num_rows;
if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){
    $courseId_info_arr[$row["courseId"]] = array(
      "user" => $remoteuser,
      "access" => $access,
      "courseId"=>$row["courseId"],
      "accessAllowed"=>$row["accessAllowed"],
      "adminAccess"=>$row["adminAccessAllowed"]);
  }
} 
// $row = $result->fetch_assoc();

$response_arr = array(
  "courseInfo"=>$courseId_info_arr,
    // "user" => $remoteuser,
    // "access" => $access,
    // "accessAllowed"=>$row["accessAllowed"],
    // "adminAccess"=>$row["adminAccessAllowed"]
);

 // set response code - 200 OK
 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);
$conn->close();

?>