<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$_GET = json_decode(file_get_contents("php://input"),true);
$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
// $object = (object) ['property' => 'Here we go'];
// $arrayobj->append('fourth');
 $response_arr = new stdClass(); // return the entire tree obj
// $List_header_name = array();
// $id_arr = array();
// $sql1 = "
// SELECT distinct id FROM header_name
// ";
// $result1 = $conn->query($sql1);
// while ($row = $result1->fetch_assoc()){
//   array_push($List_header_name,$row["id"]);
// } // done getting all ids of headers


$sql = "
SELECT 
  assignmentId, 
  title, 
  contentId, 
  parentId, 
  sourceBranchId, 
  assignedDate, 
  dueDate, 
  timeLimit, 
  numberOfAttemptsAllowed
FROM assignment
WHERE courseId = '$courseId'
ORDER BY sortOrder
";
$result = $conn->query($sql);

while ($row = $result->fetch_assoc()){ 
    $id = $row["assignmentId"];
    $response_arr->$id = new stdClass();
    $response_arr->$id->title=$row["title"];
    $response_arr->$id->type="content";
    $response_arr->$id->contentId=$row["contentId"];
    $response_arr->$id->branchId=$row["sourceBranchId"];
    $response_arr->$id->assignedDate=$row["assignedDate"];
    $response_arr->$id->dueDate=$row["dueDate"];
    $response_arr->$id->numberOfAttemptsAllowed=$row["numberOfAttemptsAllowed"];
    $response_arr->$id->parentId=$row["parentId"];
    // $object = [ $row["assignmentId"]=> [
    // "name"=>$row["assignmentName"],
    // "attr"=>"assignment",
    // "pId"=>$row["pId"]]];
    // array_push($response_arr,$object);
} 
$sql = "
SELECT 
  courseHeadingId,
  title,
  parentId,
  childrenId
FROM course_heading
WHERE courseId = '$courseId'
ORDER BY sortOrder
";
$result = $conn->query($sql);
while ($row = $result->fetch_assoc()){ 
  //property_exists($ob, 'a')
  $id = $row["courseHeadingId"];
  if (!property_exists($response_arr,$id)){

    $response_arr->$id = new stdClass();
    $response_arr->$id->title=$row["title"];
    $response_arr->$id->type="folder";
    $response_arr->$id->childrenId=[$row["childrenId"]];
    $response_arr->$id->childFolders=array();
    $response_arr->$id->childContent=array();
    $response_arr->$id->childUrls=array();
    $response_arr->$id->parentId=$row["parentId"];
  }else {
    array_push($response_arr->$id->childrenId,$row["childrenId"]);    
  } 

} 

    
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>