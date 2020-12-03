<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$_POST = json_decode(file_get_contents("php://input"),true); 

$sourceDriveId = mysqli_real_escape_string($conn,$_POST["selectedNodes"]["driveId"]); 
$destinationDriveId = mysqli_real_escape_string($conn,$_POST["destinationObj"]["driveId"]); 
$destinationParentId = mysqli_real_escape_string($conn,$_POST["destinationObj"]["parentId"]); 

$number_items = count($_POST["selectedNodes"]["selectedArr"]);
$source_items = array();
for ($i = 0; $i < $number_items; $i++) {
  $parentId =  mysqli_real_escape_string($conn,$_POST["selectedNodes"]["selectedArr"][$i]["parentId"]);
  $nodeId =  mysqli_real_escape_string($conn,$_POST["selectedNodes"]["selectedArr"][$i]["nodeId"]);
  $type =  mysqli_real_escape_string($conn,$_POST["selectedNodes"]["selectedArr"][$i]["type"]);
  array_push($source_items,array(
    "parentId"=>$parentId,
    "nodeId"=>$nodeId,
    "type"=>$type
  ));
}
// var_dump($source_items);
$response_arr = array( 
    "success" => TRUE,
   );

 // set response code - 200 OK
 http_response_code(200);
     

 // make it json format
 echo json_encode($response_arr);



$conn->close();


?>
           
