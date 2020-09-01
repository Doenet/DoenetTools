<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$email = mysqli_real_escape_string($conn,$_REQUEST["email"]);
$repoId = mysqli_real_escape_string($conn,$_REQUEST["repoId"]);
$owner = mysqli_real_escape_string($conn,$_REQUEST["owner"]);

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = "0";
$response_message = "";

// Test if current user has grant permission
$sql = "
SELECT id
FROM repo_access
WHERE userId = '$userId' AND repoId = '$repoId'
";
$result = $conn->query($sql); 
$hasPermissionToInsert = $result->num_rows > 0;
if (!$hasPermissionToInsert) {
  $response_message = "No permission to grant access to this repo";
}

// Test if new repo
$sql = "
SELECT repoId
FROM folder
WHERE folderId = '$repoId'
";
$result = $conn->query($sql); 
$newRepo = $result->num_rows == 0;

// Test if user exists
$sql = "
SELECT userId
FROM user
WHERE email = '$email' 
";
$result = $conn->query($sql); 
$targetUserExists = $result->num_rows > 0;
if (!$targetUserExists) {
  $response_message = "User with email $email not found";
}
$row = $result->fetch_assoc();
$targetUserId = $row["userId"];


// check if target user already has access to repo
$sql = "
SELECT id
FROM repo_access
WHERE email='$email' AND repoId='$repoId'
";
$result = $conn->query($sql); 
$targetUserNotAlreadyHasAccess = $result->num_rows == 0;
if (!$targetUserNotAlreadyHasAccess) {
  $response_message = "User with email $email already has access";
}

$response_arr = array(
  "success"=>"0",
  "message"=>$response_message
);

if (($hasPermisionToInsert || $newRepo) && $targetUserExists && $targetUserNotAlreadyHasAccess){
//  User has permission to insert the new user, so insert it
  $sql = "
  INSERT INTO repo_access
  (repoId, userId, email, timestamp, removedFlag, owner)
  VALUES
  ('$repoId','$targetUserId','$email', NOW(), '0', $owner)
  ";
  $result = $conn->query($sql); 
  //Collect users who can access repos

    $sql = "
    SELECT 
  u.firstName AS firstName,
  u.lastName AS lastName,
  u.userId AS userId,
  u.email AS email,
  ra.owner AS owner
  FROM repo_access AS ra
  LEFT JOIN user AS u
  ON u.email = ra.email
  WHERE ra.repoId = '$repoId'
  ";
  $result = $conn->query($sql); 
  $users = array();
  while($row = $result->fetch_assoc()){ 
    $user_info = array(
      "firstName"=>$row["firstName"],
      "lastName"=>$row["lastName"],
      "username"=>$row["username"],
      "email"=>$row["email"],
      "owner"=>$row["owner"]
    );
    array_push($users,$user_info);
  }
  $response_arr = array(
    "success"=>"1",
    "users"=>$users,
    "message"=>"User $email granted access"
  );
} 


http_response_code(200);
echo json_encode($response_arr);


$conn->close();
?>

