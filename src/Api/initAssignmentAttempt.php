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

$_POST = json_decode(file_get_contents("php://input"),true);
$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$requestedVariant = mysqli_real_escape_string($conn,$_POST["requestedVariant"]);
$generatedVariant = mysqli_real_escape_string($conn,$_POST["generatedVariant"]);

$weights = array_map(function($item) use($conn) {
    return mysqli_real_escape_string($conn, $item);
  }, $_POST['weights']);

$itemVariants = array_map(function($item) use($conn) {
    return mysqli_real_escape_string($conn, $item);
  }, $_POST['itemVariantInfo']);

$success = TRUE;
$message = "";

if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}elseif ($contentId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing contentId';
}elseif ($attemptNumber == ""){
    $success = FALSE;
    $message = 'Internal Error: missing attemptNumber';
}elseif ($requestedVariant == ""){
    $success = FALSE;
    $message = 'Internal Error: missing requestedVariant';
}elseif ($generatedVariant == ""){
    $success = FALSE;
    $message = 'Internal Error: missing generatedVariant';
}else if ($userId == ""){
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
//TODO: make sure we have the right weights


if ($success){

$sql = "SELECT doenetId
    FROM user_assignment
    WHERE userId = '$userId'
    AND doenetId = '$doenetId'
    ";
$result = $conn->query($sql);

if ($result->num_rows < 1){
    $sql = "INSERT INTO user_assignment
    (doenetId,contentId,userId)
    VALUES
    ('$doenetId','$contentId','$userId')
    ";

    $result = $conn->query($sql);
}

$sql = "SELECT contentId
    FROM user_assignment_attempt
    WHERE userId = '$userId'
    AND doenetId = '$doenetId'
    AND attemptNumber = '$attemptNumber'
    ";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$db_contentId = $row['contentId'];

if ($db_contentId == 'NA'){

  $sql = "UPDATE user_assignment_attempt
  SET contentId = '$contentId', 
  assignedVariant = '$requestedVariant',
  generatedVariant = '$generatedVariant',
  began = CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
  WHERE userId = '$userId'
    AND doenetId = '$doenetId'
    AND attemptNumber = '$attemptNumber'
  ";
$result = $conn->query($sql);

}else{
  $sql = "SELECT 
  began,
  assignedVariant,
  generatedVariant
  FROM user_assignment_attempt
  WHERE userId = '$userId'
  AND doenetId = '$doenetId'
  AND attemptNumber = '$attemptNumber'
  ";
  $result = $conn->query($sql);

  if ($result->num_rows < 1){
  $sql = "INSERT INTO user_assignment_attempt
  (doenetId,contentId,userId,attemptNumber,assignedVariant,generatedVariant,began)
  VALUES
  ('$doenetId','$contentId','$userId','$attemptNumber','$requestedVariant','$generatedVariant',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'))
  ";

  $result = $conn->query($sql);
  }else{


  $row = $result->fetch_assoc();
  $began = $row['began'];
// $row['assignedVariant'];
// $row['generatedVariant'];

  if ($began == NULL){
    if ($row['assignedVariant'] == NULL ||
    $row['generatedVariant'] == NULL){
      $sql = "
      UPDATE user_assignment_attempt
      SET began=CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'),
      assignedVariant='$requestedVariant',
      generatedVariant='$generatedVariant'
      WHERE userId = '$userId'
      AND doenetId = '$doenetId'
      AND attemptNumber = '$attemptNumber'
      ";
    }else{
      $sql = "
      UPDATE user_assignment_attempt
      SET began=CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
      WHERE userId = '$userId'
      AND doenetId = '$doenetId'
      AND attemptNumber = '$attemptNumber'
      ";
    }
  $result = $conn->query($sql);
  }
  }

}


$sql = "SELECT userId
        FROM  user_assignment_attempt_item
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
";

$result = $conn->query($sql);

//Only insert if not stored
if ($result->num_rows < 1){

  //Insert weights
  for ($itemNumber = 1; $itemNumber < count($weights) + 1; $itemNumber++){
    //Store Item  weights
    $weight = $weights[($itemNumber -1)];
    $itemVariant = $itemVariants[($itemNumber -1)];
    if ($itemVariant == 'null'){
      $itemVariant = '';  //TODO: Make Null work
    }
 
    $sql = "INSERT INTO user_assignment_attempt_item 
    (userId,doenetId,contentId,attemptNumber,itemNumber,weight,generatedVariant)
    values
    ('$userId','$doenetId','$contentId','$attemptNumber','$itemNumber','$weight','$itemVariant')
    ";
  $result = $conn->query($sql);

  }

}
}


$response_arr = array(
    "access"=> TRUE,
    "success"=>$success,
    "message"=>$message,
);


// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>