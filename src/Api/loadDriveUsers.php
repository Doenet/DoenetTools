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
$results_arr = array();

//TODO: Check for permisions first


  $sql = "
  SELECT 
  du.canDeleteDrive AS owner,
  u.screenName AS screenName,
  u.email AS email,
  u.userId AS userId
  FROM drive_user AS du
  LEFT OUTER JOIN user AS u
  ON du.userId = u.userId
  WHERE du.driveId = '$driveId'
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
      "isUser"=>$isUser
    );

    if ($row['owner'] == '1'){
      array_push($owners,$user);
    }else{
      array_push($admins,$user);
    }
  }
}


$response_arr = array(
  "success"=>$success,
  "admins"=>$admins,
  "owners"=>$owners,
  "usersRole"=>$usersRole
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>