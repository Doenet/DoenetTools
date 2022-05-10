<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];
$examUserId = array_key_exists("examineeUserId",$jwtArray) ? $jwtArray['examineeUserId'] : "";
$examDoenetId = array_key_exists("doenetId",$jwtArray) ? $jwtArray['doenetId'] : "";

$device = $jwtArray['deviceName'];

$_POST = json_decode(file_get_contents("php://input"),true);
$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);
$activityCid =  mysqli_real_escape_string($conn,$_POST["activityCid"]);
$pageCid =  mysqli_real_escape_string($conn,$_POST["pageCid"]);
$pageNumber =  mysqli_real_escape_string($conn,$_POST["pageNumber"]);
$attemptNumber =  mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$verb =  mysqli_real_escape_string($conn,$_POST["verb"]);
$object =  mysqli_real_escape_string($conn,$_POST["object"]);
$result =  mysqli_real_escape_string($conn,$_POST["result"]);
$context =  mysqli_real_escape_string($conn,$_POST["context"]);
$version =  mysqli_real_escape_string($conn,$_POST["version"]);
$variantIndex =  mysqli_real_escape_string($conn,$_POST["variantIndex"]);
$timestamp =  mysqli_real_escape_string($conn,$_POST["timestamp"]);

$success = TRUE;
$message = "";

if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
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
}elseif ($variantIndex == ""){
  $success = FALSE;
  $message = 'Internal Error: missing variantIndex';
}elseif ($timestamp == ""){
  $success = FALSE;
  $message = 'Internal Error: missing timestamp';
}elseif ($userId == ""){
  if ($examUserId == ""){
    $success = FALSE;
    $message = "No access - Need to sign in";
  }else if ($examDoenetId != $doenetId){
      $success = FALSE;
      $message = "No access for doenetId: $doenetId";
  }else{
      $userId = $examUserId;
  }
}
//TODO: Handle Anonymous
// elseif ($userId == ""){
//   $success = FALSE;
//   $message = "You need to be signed in to create a $type";
// }

if ($pageCid == ""){
  $pageCid = 'NULL';
} else {
  $pageCid = "'$pageCid'";
}

if ($activityCid == ""){
  $activityCid = 'NULL';
} else {
  $activityCid = "'$activityCid'";
}

if ($pageNumber == ""){
  $pageNumber = 'NULL';
}

if ($success){
  $sql = "INSERT INTO event (userId,deviceName,doenetId,activityCid,pageCid,pageNumber,attemptNumber,variantIndex,verb,object,result,context,version,timestamp,timestored)
  VALUES ('$userId','$device','$doenetId',$activityCid,$pageCid,$pageNumber,$attemptNumber,$variantIndex,'$verb','$object','$result','$context','$version','$timestamp',NOW())";
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

