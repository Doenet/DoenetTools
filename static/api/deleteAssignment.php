<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
// TODO in the future: check permission

$_POST = json_decode(file_get_contents("php://input"),true);
// var_dump($_POST);
// INSERT INTO assignment (assignmentId,parentId) VALUES (1,1,1),(2,2,3),(3,9,3),(4,10,12)
// ON DUPLICATE KEY UPDATE assignmentId=VALUES(assignmentId),parentId=VALUES(parentId);
$assignmentId_array = array();


foreach ($_POST["list"] as $post_element) {
    $assignmentId_array_element = mysqli_real_escape_string($conn,$post_element);
    array_push($assignmentId_array,$assignmentId_array_element);
}

$AssignmentSize = sizeof($assignmentId_array);
$iterator = 0;
$string="";
while ($iterator < $AssignmentSize) {
  if ($iterator!=$AssignmentSize-1){
  $string = $string."assignmentId=\"".$assignmentId_array[$iterator]."\" or ";
  } else {
    $string = $string."assignmentId=\"".$assignmentId_array[$iterator]."\"";
  }
  $iterator+=1;
}
$sql = "DELETE FROM assignment WHERE ".$string;
echo $sql;
$conn->query($sql);

http_response_code(200);

 $conn->close();

?>

