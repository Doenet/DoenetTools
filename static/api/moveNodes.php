<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$_POST = json_decode(file_get_contents("php://input"),true); 

$destinationObj = mysqli_real_escape_string($conn,$_POST["destinationObj"]); 
var_dump($_POST);
// $number_items = count($_POST["sourceArr"]);

// for ($i = 0; $i < $number_items; $i++) {
//   $stuff =  mysqli_real_escape_string($conn,$_POST["sourceArr"][$i]);
//   var_dump($stuff);
//   // $itemType =  mysqli_real_escape_string($conn,$_POST["sourceArr"][$i]);
// }
$response_arr = array( 
    "success" => TRUE,
   );

 // set response code - 200 OK
 http_response_code(200);
     

 // make it json format
 echo json_encode($response_arr);



$conn->close();


?>
           
