<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);

$success = TRUE;
$message = "";

if ($driveId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing driveId';
}elseif ($userId == ""){
  $success = FALSE;
  $message = "You need to be signed in to learn of drive users";
}

//Check for permisions
if ($success){
  $sql = "
  SELECT canViewDrive
  FROM drive_user
  WHERE userId = '$userId'
  AND driveId = '$driveId'
  ";
  $result = $conn->query($sql); 
  $row = $result->fetch_assoc();
  if ($row['canViewDrive'] == '0'){
    $success = FALSE;
    $message = "You need need permission to learn of drive users";
  }
}

if ($success){

  $sql = "
  SELECT 
  du.canDeleteDrive AS owner,
  du.role As role,
  u.screenName AS screenName,
  u.email AS email,
  u.userId AS userId
  FROM drive_user AS du
  LEFT OUTER JOIN user AS u
  ON du.userId = u.userId
  WHERE du.driveId = '$driveId' AND du.canDeleteDrive = '1';
  ";
  // AND du.userId != '$userId'
$result = $conn->query($sql); 

$admins = array();
$owners = array();
$usersRole = "Admin";

if ($result->num_rows > 0){
  while($row = $result->fetch_assoc()){ 
    
    $email = $row['email'];
  
    $isUser = FALSE;
    if ($row['userId'] == $userId){
      $isUser = TRUE;
      if ($row['owner'] == '1'){
        $usersRole = "Owner";
      }
    }
    $user = array(
      "email"=>$email,
      "screenName"=>$row['screenName'],
      "userId"=>$row['userId'],
      "isUser"=>$isUser,
      "role"=>$row['role']
    );

    if ($row['owner'] == '1'){
      array_push($owners,$user);
    }else{
      array_push($admins,$user);
    }
  }
}
}

$response_arr = array(
  "success"=>$success,
  "admins"=>$admins,
  "owners"=>$owners,
  "usersRole"=>$usersRole,
  "message"=>$message
);

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>