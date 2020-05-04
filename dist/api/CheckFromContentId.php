<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
//this works !
include "db_connection.php";

$_POST = json_decode(file_get_contents("php://input"),true); //newly added
//$contentId =  mysqli_real_escape_string($conn,$_REQUEST["contentId"]);
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]); //new

$sql = "SELECT doenetML 
FROM content
WHERE contentId = '$contentId'
AND public = '1'

";
//echo "-------contentid is-----";
//echo $contentId;
$result = $conn->query($sql); 
//echo $result;
//echo $result->num_rows;
$response_arr = array( 
    "doenetML" => "No Match",
   );
         
if ($result->num_rows > 0){
  $row = $result->fetch_assoc();
  $response_arr = array( 
            "doenetML" => "Match",
           );
}
    
 // set response code - 200 OK
 http_response_code(200);
     

 // make it json format
 echo json_encode($response_arr);



$conn->close();


?>
           
