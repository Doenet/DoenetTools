<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$email = mysqli_real_escape_string($conn,$_REQUEST["email"]);
$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
$type = mysqli_real_escape_string($conn,$_REQUEST["type"]);
$selected_userId = mysqli_real_escape_string($conn,$_REQUEST["userId"]);

$success = TRUE;
$response_arr = array(
  "success"=>FALSE
);

//TODO: Check for permisions first


if ($type === "Remove User"){
    $sql = "
    DELETE FROM drive_user
    WHERE userId = '$selected_userId'
    AND driveId = '$driveId'
    ";
    $result = $conn->query($sql); 
    $response_arr = array(
      "success"=>TRUE
    );
}else{

  $sql = "
  SELECT 
  userId,
  screenName
  FROM user
  WHERE email = '$email'
  ";
  $result = $conn->query($sql); 


  if ($result->num_rows > 0){
    $row = $result->fetch_assoc();

    
      
      $response_arr = array(
      "success"=>TRUE,
      "userId"=>$row['userId'],
      "screenName"=>$row['screenName'],
      "email"=>$row['email']
      );

      $canDeleteDrive = '0';
      if ($type == "Add Owner"){
        $canDeleteDrive = '1';
      }

      $newUserId = $row['userId'];

      $sql = "
      INSERT INTO drive_user
      (userId,driveId,canViewDrive,canDeleteDrive,canShareDrive,canAddItemsAndFolders,
      canMoveItemsAndFolders,canRenameItemsAndFolders,canPublishItemsAndFolders, canChangeAllDriveSettings)
      VALUES
      ('$newUserId','$driveId','1',$canDeleteDrive,'1','1','1','1','1',$canDeleteDrive)
      ";
    
      $result = $conn->query($sql); 
    }
    
  }








// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>