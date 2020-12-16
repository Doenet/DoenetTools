<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true); 

$sourceDriveId = mysqli_real_escape_string($conn,$_POST["selectedNodes"]["driveId"]); 
$destinationDriveId = mysqli_real_escape_string($conn,$_POST["destinationObj"]["driveId"]); 
$destinationParentId = mysqli_real_escape_string($conn,$_POST["destinationObj"]["parentId"]); 



$number_items = count($_POST["selectedNodes"]["selectedArr"]);
$new_values = "";
for ($i = 0; $i < $number_items; $i++) {
  $parentId =  mysqli_real_escape_string($conn,$_POST["selectedNodes"]["selectedArr"][$i]["parentId"]);
  $itemId =  mysqli_real_escape_string($conn,$_POST["selectedNodes"]["selectedArr"][$i]["nodeId"]);
  $type =  mysqli_real_escape_string($conn,$_POST["selectedNodes"]["selectedArr"][$i]["type"]);
  $new_values = $new_values . "('$destinationParentId','$itemId'),";
}
$new_values = rtrim($new_values,",");

//If moving between drives 1st move source drive rows to destination drive
if ($sourceDriveId != $destinationDriveId ){
  $itemIds = "";

  for ($i = 0; $i < $number_items; $i++) {
    $itemId =  mysqli_real_escape_string($conn,$_POST["selectedNodes"]["selectedArr"][$i]["nodeId"]);
    $itemIds = $itemIds . "'$itemId',";
  }
  $itemIds = rtrim($itemIds,",");

  $sql = "
  INSERT INTO drive_$destinationDriveId (itemId,parentId,label,creationDate,isDeleted,itemType)
          SELECT itemId,parentId,label,creationDate,isDeleted,itemType
          FROM drive_$sourceDriveId
          WHERE itemId IN ($itemIds);
  ";
$result = $conn->query($sql); 

$sql = "
DELETE FROM drive_$sourceDriveId
WHERE itemId IN ($itemIds);
";
$result = $conn->query($sql); 

}




$sql = "INSERT INTO drive_$destinationDriveId (parentId, itemId)
        VALUES ";
$sql = $sql . $new_values;
$sql = $sql . " ON DUPLICATE KEY UPDATE 
parentId = VALUES(parentId) ";
$result = $conn->query($sql); 


$response_arr = array( 
    "success" => TRUE,
   );
 // set response code - 200 OK
 http_response_code(200);
     

 // make it json format
//  echo json_encode($response_arr);



$conn->close();


?>
           
