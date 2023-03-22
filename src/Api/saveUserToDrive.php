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
$selected_userId = $_REQUEST["userId"];

$success = TRUE;
$response_arr = array(
  "success"=>FALSE
);

//TODO: Need a permission related to see grades (not du.canEditContent)
$sql = "
SELECT du.canChangeAllDriveSettings 
FROM drive_user AS du
WHERE du.userId = '$userId'
AND du.driveId = '$driveId'
AND du.canChangeAllDriveSettings = '1'
";
 
$result = $conn->query($sql);
if ($result->num_rows < 1) {
	$success = FALSE;
	$message = "No access granted for to add or remove users.";
}

if ($success){
if ($type === "Remove User"){
  for($k = 0; $k < count($selected_userId); $k++){

    $userData = $selected_userId[$k];
    $userDataDecode = json_decode($userData,true);
    $userUserId =  $userDataDecode['userId'];
    $sql = "
    DELETE FROM drive_user
    WHERE userId = '$userUserId'
    AND driveId = '$driveId'
    ";
    $result = $conn->query($sql); 
    $response_arr = array(
      "success"=>TRUE
    );
  }
  }else if ($type === "To Owner"){
    for($k = 0; $k < count($selected_userId); $k++){

      $userData = $selected_userId[$k];
      $userDataDecode = json_decode($userData,true);
      $ownerUserId =  $userDataDecode['userId'];
      $sql = "
      UPDATE drive_user
      SET canDeleteDrive='1', canChangeAllDriveSettings= '1', role='Owner'
      WHERE userId = '$ownerUserId'
      AND driveId = '$driveId'
      ";
      $result = $conn->query($sql); 
      $response_arr = array(
        "success"=>TRUE
      );
    }
  
  }else if ($type === "To Admin"){
    for($k = 0; $k < count($selected_userId); $k++){
      $userData = $selected_userId[$k];
      $userDataDecode = json_decode($userData,true);
      $adminUserId =  $userDataDecode['userId'];
      $sql = "
      UPDATE drive_user
      SET canDeleteDrive='0', canChangeAllDriveSettings= '0', role='Administrator'
      WHERE userId = '$adminUserId'
      AND driveId = '$driveId'
      ";
      $result = $conn->query($sql); 
      $response_arr = array(
        "success"=>TRUE
      );
    }
   
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
            $userRole = '';
            if ($type == 'Add Owner') {
               $userRole = 'Owner';
                $canDeleteDrive = '1';
            }else{
              $userRole = 'Administrator';
            }

            $sql = "
      INSERT INTO drive_user
      (userId,driveId,canEditContent,canViewDrive,canDeleteDrive,canShareDrive,canAddItemsAndFolders,canDeleteItemsAndFolders,
      canMoveItemsAndFolders,canRenameItemsAndFolders,canPublishItemsAndFolders,canViewUnreleasedItemsAndFolders,canViewUnassignedItemsAndFolders,canChangeAllDriveSettings,role)
      VALUES
      ('$newUserId','$driveId','1','1',$canDeleteDrive,'1','1','1','1','1','1','1','1',$canDeleteDrive,'$userRole')
      ";
      $result = $conn->query($sql); 
    }
  }
    
  }

}
// set response code - 200 OK
http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>