<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$username = mysqli_real_escape_string($conn,$_REQUEST["username"]);
$repoId = mysqli_real_escape_string($conn,$_REQUEST["repoId"]);


$sql = "
SELECT id
FROM repo_access
WHERE username = '$remoteuser' AND repoId = '$repoId'
";

$result = $conn->query($sql); 
$permisionToRemove = $result->num_rows;



$response_arr = array(
  "success"=>"0",
);

if ($permisionToRemove > 0 ){
//  User has permission to remove the user, so remove them
  $sql = "
  DELETE FROM repo_access
  WHERE repoId='$repoId' AND username='$username'
  ";
  $result = $conn->query($sql); 

  //Collect users who can access repos
    $sql = "
    SELECT 
  u.firstName AS firstName,
  u.lastName AS lastName,
  u.username AS username,
  u.email AS email,
  ra.owner AS owner
  FROM repo_access AS ra
  LEFT JOIN user AS u
  ON u.username = ra.username
  WHERE ra.repoId = '$repoId'
  ";
  $result = $conn->query($sql); 
  $users = array();
  while($row = $result->fetch_assoc()){ 
    $user_info = array(
      firstName=>$row["firstName"],
      lastName=>$row["lastName"],
      username=>$row["username"],
      email=>$row["email"],
      owner=>$row["owner"]
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

