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
  }else if ($type === "To Owner"){
    $sql = "
    UPDATE drive_user
    SET canDeleteDrive='1', canChangeAllDriveSettings= '1'
    WHERE userId = '$selected_userId'
    AND driveId = '$driveId'
    ";
    $result = $conn->query($sql); 
    $response_arr = array(
      "success"=>TRUE
    );
  }else if ($type === "To Admin"){
    $sql = "
    UPDATE drive_user
    SET canDeleteDrive='0', canChangeAllDriveSettings= '0'
    WHERE userId = '$selected_userId'
    AND driveId = '$driveId'
    ";
    $result = $conn->query($sql); 
    $response_arr = array(
      "success"=>TRUE
    );
}else{
  //Attempt to add user

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

    $newUserId = $row['userId'];
    $newScreenName = $row['screenName'];

  //Test if they have already been added
  $sql = "
  SELECT userId
  FROM drive_user
  WHERE userId = '$newUserId'
  AND driveId = '$driveId'
  ";
  $result = $conn->query($sql); 

  if ($result->num_rows > 0){
    //Already have this user
    $response_arr = array(
    "success"=>FALSE,
    "message"=>"Already have user $newScreenName $email"
    );
  }else{

      $response_arr = array(
      "success"=>TRUE,
      "userId"=>$newUserId,
      "screenName"=>$newScreenName,
      "email"=>$email
      );

      $canDeleteDrive = '0';
      if ($type == "Add Owner"){
        $canDeleteDrive = '1';
      }

      $sql = "
      INSERT INTO drive_user
      (userId,driveId,canViewDrive,canDeleteDrive,canShareDrive,canAddItemsAndFolders,canDeleteItemsAndFolders,
      canMoveItemsAndFolders,canRenameItemsAndFolders,canPublishItemsAndFolders,canViewUnreleasedItemsAndFolders,canViewUnassignedItemsAndFolders,canChangeAllDriveSettings)
      VALUES
      ('$newUserId','$driveId','1',$canDeleteDrive,'1','1','1','1','1','1','1','1',$canDeleteDrive)
      ";
      $result = $conn->query($sql); 
    }
  }
    
  }


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>