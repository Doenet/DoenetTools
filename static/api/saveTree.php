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
$assignmentId_parentID_array = array();
$headerID_array_to_payload = array();
$headerID_parentId_array_to_payload = array();
$headerID_childrenId_array_to_payload = array();
$headerID_name = array();

foreach ($_POST["assignmentId_array"] as $post_element) {
    $assignmentId_array_element = mysqli_real_escape_string($conn,$post_element);
    array_push($assignmentId_array,$assignmentId_array_element);
}
foreach ($_POST["assignmentId_parentID_array"] as $post_element) {
  $assignmentId_parentID_element= mysqli_real_escape_string($conn,$post_element);
  array_push($assignmentId_parentID_array,$assignmentId_parentID_element);
}
foreach ($_POST["headerID_array_to_payload"] as $post_element) {
  $headerID_array_to_payload_element = mysqli_real_escape_string($conn,$post_element);
  array_push($headerID_array_to_payload,$headerID_array_to_payload_element);
}
foreach ($_POST["headerID_parentId_array_to_payload"] as $post_element) {
  $headerID_parentId_array_to_payload_element = mysqli_real_escape_string($conn,$post_element);
  array_push($headerID_parentId_array_to_payload,$headerID_parentId_array_to_payload_element);
}
foreach ($_POST["headerID_childrenId_array_to_payload"] as $post_element) {
  $headerID_childrenId_array_to_payload_element = mysqli_real_escape_string($conn,$post_element);
  array_push($headerID_childrenId_array_to_payload,$headerID_childrenId_array_to_payload_element);
}
foreach ($_POST["headerID_name"] as $post_element) {
  $headerID_name_element = mysqli_real_escape_string($conn,$post_element);
  // echo $headerID_name_element;
  array_push($headerID_name,$headerID_name_element);
}
$AssignmentSize = sizeof($assignmentId_array);
$iterator = 0;
$string="";
while ($iterator < $AssignmentSize) {
  $string = $string."(\"".$assignmentId_array[$iterator]."\",\"".$assignmentId_parentID_array[$iterator]."\")";
  if ($iterator<$AssignmentSize-1){
    $string = $string.",";
  }
  $iterator+=1;
}
$sql = "INSERT INTO assignment (assignmentId,parentId) VALUES ".$string."ON DUPLICATE KEY UPDATE assignmentId=VALUES(assignmentId),parentId=VALUES(parentId)";
echo "\n";
$conn->query($sql);



$HeadingSize = sizeof($headerID_array_to_payload);
$iterator = 0;
$string="";
while ($iterator < $HeadingSize) {
  if ($headerID_name[$iterator]=="NULL"){
    $headerID_name[$iterator]=NULL;
  }
  if ($headerID_parentId_array_to_payload[$iterator]=="NULL"){
    $headerID_parentId_array_to_payload[$iterator]=NULL;
  }
  if ($headerID_childrenId_array_to_payload[$iterator]=="NULL"){
    $headerID_childrenId_array_to_payload[$iterator] = NULL;
  }
  $string = $string."(\"".$headerID_array_to_payload[$iterator]."\",\"".$headerID_name[$iterator]."\",\"".$headerID_parentId_array_to_payload[$iterator]."\",\"".$headerID_childrenId_array_to_payload[$iterator]."\")";
  if ($iterator<$HeadingSize-1){
    $string = $string.",";
  }
  $iterator+=1;
}
$sql = "DELETE FROM course_heading WHERE courseid='aI8sK4vmEhC5sdeSP3vNW'"; // these have to be 2 separate sql run otherwise nothing will ever change !
$result = $conn->query($sql);
$sql = "INSERT INTO course_heading (courseHeadingId,headingText,parentId,childrenId) VALUES ".$string;
echo $sql;
// TODO: bug, cannot save tree when adding new header under Ultimate Header
// save automatically whenever u modify tree, no more Save tree button
// remove assignment, add assignment and modify basic info assignment are 3 separate PHP files
$result = $conn->query($sql);
// TODO: ask Kevin why php never run $sql
http_response_code(200);

 $conn->close();

?>

