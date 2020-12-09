<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$email = mysqli_real_escape_string($conn,$_REQUEST["email"]);
$repoId = mysqli_real_escape_string($conn,$_REQUEST["repoId"]);

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$sql = "
SELECT id
FROM repo_access
WHERE userId = '$userId' AND repoId = '$repoId'
";

$result = $conn->query($sql); 
$permisionToInsert = $result->num_rows;

//Test if user exists
$sql = "
SELECT userId
FROM user
WHERE email = '$email' 
";

$result = $conn->query($sql); 
$targetUserExists = $result->num_rows;
$row = $result->fetch_assoc();
$targetUserId = $row["userId"];

//TODO: TEST IF USERNAME ALREADY HAS ACCESS

$response_arr = array(
  "success"=>"0",
);

if ($permisionToInsert > 0 && $targetUserExists > 0){
//  User has permission to insert the new user, so insert it
  $sql = "
  INSERT INTO repo_access
  (repoId, userId, email, timestamp, removedFlag, owner)
  VALUES
  ('$repoId','$targetUserId','$email', NOW(), '0', '0')
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
    "users"=>$users
  );
} 


  http_response_code(200);
  echo json_encode($response_arr);


$conn->close();
?>

