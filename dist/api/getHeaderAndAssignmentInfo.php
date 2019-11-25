<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$_GET = json_decode(file_get_contents("php://input"),true);
// $object = (object) ['property' => 'Here we go'];
// $arrayobj->append('fourth');
 $response_arr = array(); // return the entire tree obj
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
SELECT * FROM assignment
";
$result = $conn->query($sql);

while ($row = $result->fetch_assoc()){ 
  //property_exists($ob, 'a')
    $object = [ $row["assignmentId"]=> [
    "name"=>$row["assignmentName"],
    "attr"=>"assignment",
    "pId"=>$row["pId"]]];
    array_push($response_arr,$object);
} 
$sql = "
SELECT * FROM course_heading
";
$result = $conn->query($sql);
while ($row = $result->fetch_assoc()){ 
  //property_exists($ob, 'a')
    $object = [ $row["courseHeadingId"]=> [
    "name"=>$row["headingText"],
    "attr"=>"header",
    "pId"=>$row["pId"],
    "childrenId"=>$row["childrenId"]]];
    array_push($response_arr,$object);
} 

    
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>