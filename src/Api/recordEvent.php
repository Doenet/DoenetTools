<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$device = $jwtArray['deviceName'];

$_POST = json_decode(file_get_contents("php://input"),true);
$branchId =  mysqli_real_escape_string($conn,$_POST["branchId"]);
$contentId =  mysqli_real_escape_string($conn,$_POST["contentId"]);
$attemptNumber =  mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$verb =  mysqli_real_escape_string($conn,$_POST["verb"]);
$object =  mysqli_real_escape_string($conn,$_POST["object"]);
$result =  mysqli_real_escape_string($conn,$_POST["result"]);
$context =  mysqli_real_escape_string($conn,$_POST["context"]);
$version =  mysqli_real_escape_string($conn,$_POST["version"]);
$variant =  mysqli_real_escape_string($conn,$_POST["variant"]);
$timestamp =  mysqli_real_escape_string($conn,$_POST["timestamp"]);

$success = TRUE;
$message = "";

if ($branchId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing branchId';
}elseif ($contentId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing contentId';
}elseif ($attemptNumber == ""){
  $success = FALSE;
  $message = 'Internal Error: missing attemptNumber';
}elseif ($verb == ""){
  $success = FALSE;
  $message = 'Internal Error: missing verb';
}elseif ($object == ""){
  $success = FALSE;
  $message = 'Internal Error: missing object';
}elseif ($result == ""){
  $success = FALSE;
  $message = 'Internal Error: missing result';
}elseif ($context == ""){
  $success = FALSE;
  $message = 'Internal Error: missing context';
}elseif ($version == ""){
  $success = FALSE;
  $message = 'Internal Error: missing version';
}elseif ($variant == ""){
  $success = FALSE;
  $message = 'Internal Error: missing variant';
}elseif ($timestamp == ""){
  $success = FALSE;
  $message = 'Internal Error: missing timestamp';
}
//TODO: Handle Anonymous
// elseif ($userId == ""){
//   $success = FALSE;
//   $message = "You need to be signed in to create a $type";
// }


if ($success){
  $sql = "INSERT INTO event (userId,deviceName,branchId,contentId,attemptNumber,variant,verb,object,result,context,version,timestamp,timestored)
  VALUES ('$userId','$device','$branchId','$contentId','$attemptNumber','$variant','$verb','$object','$result','$context','$version','$timestamp',NOW())";

  $result = $conn->query($sql);
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message
  );

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>

