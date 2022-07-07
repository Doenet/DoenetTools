<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');


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
$verbs =  mysqli_real_escape_string($conn,$_POST["verbs"]);
$objects =  mysqli_real_escape_string($conn,$_POST["objects"]);
$results =  mysqli_real_escape_string($conn,$_POST["results"]);
$contexts =  mysqli_real_escape_string($conn,$_POST["contexts"]);
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
}elseif ($verbs == ""){
  $success = FALSE;
  $message = 'Internal Error: missing verbs';
}elseif ($objects == ""){
  $success = FALSE;
  $message = 'Internal Error: missing objects';
}elseif ($results == ""){
  $success = FALSE;
  $message = 'Internal Error: missing results';
}elseif ($contexts == ""){
  $success = FALSE;
  $message = 'Internal Error: missing contexts';
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
  VALUES ";
  $iterator = new MultipleIterator;
  $iterator->attachIterator(new ArrayIterator(json_decode($_POST["verbs"])));
  $iterator->attachIterator(new ArrayIterator(json_decode($_POST["objects"])));
  $iterator->attachIterator(new ArrayIterator(json_decode($_POST["results"])));
  $iterator->attachIterator(new ArrayIterator(json_decode($_POST["contexts"])));

  $repeated = FALSE;
  foreach ($iterator as $values) {
    if($repeated) {
      $sql = "$sql,";
    }
    $repeated= TRUE;
    $verb = $values[0];
    $object = $values[1];
    $result = $values[2];
    $context = $values[3];
    $sql = "$sql('$userId','$device','$doenetId',$activityCid,$pageCid,$pageNumber,$attemptNumber,$variantIndex,'$verb','$object','$result','$context','$version','$timestamp',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))";
  }

  // foreach (array_map(null, $verbs, $objects, $results, $contexts) as list($verb, $object, $result, $context)) {
  //   $sql = $sql + "('$userId','$device','$doenetId',$activityCid,$pageCid,$pageNumber,$attemptNumber,$variantIndex,'$verb','$object','$result','$context','$version','$timestamp',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))";
  // }

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

