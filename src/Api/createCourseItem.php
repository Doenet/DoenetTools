<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";

$previousDoenetId = mysqli_real_escape_string($conn,$_REQUEST["previousDoenetId"]);
$itemType = mysqli_real_escape_string($conn,$_REQUEST["itemType"]);
$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$placeInFolderFlag = mysqli_real_escape_string($conn,$_REQUEST["placeInFolderFlag"]);

if ($userId == ''){
  $success = FALSE;
  $message = "You need to be signed in to make a course";
}

if ($success){
  $doenetId = include "randomId.php";
  $label = 'Untitled';

$doenetId = include "randomId.php";
$jsonDefinition = null;
$sortOrder = 'a'; //replace with position function

//Defaults for each item type
if ($itemType == 'Section'){
  $jsonDefinition = '{"type":"Section","isIncludedInStudentNavigation":true}';
}else if($itemType == 'Activity'){
  $jsonDefinition = '{"type":"Activity"}';
}else if($itemType == 'Bank'){
  $jsonDefinition = '{"type":"Bank"}';
}else{
  $success = FALSE;
  $message = "Not able to make type $itemType";
}

if ($success){


$sql = "
INSERT INTO course_content 
(contentType,
courseId,
doenetId,
parentDoenetId,
label,
creationDate,
sortOrder,
jsonDefinition)
VALUES
('$itemType','$courseId','$doenetId','$previousDoenetId','$label',NOW(),'$sortOrder','$jsonDefinition')
";

$result = $conn->query($sql); 


}


$sql = "
SELECT 
doenetId,
parentDoenetId,
label,
creationDate,
isDeleted,
isAssigned,
isPublic,
CAST(jsonDefinition as CHAR) AS json
FROM course_content
WHERE doenetId = '$doenetId'
";
$result = $conn->query($sql); 
$row = $result->fetch_assoc();


$itemEntered = array(
  "doenetId"=>$row['doenetId'],
  "parentDoenetId"=>$row['parentDoenetId'],
  "label"=>$row['label'],
  "creationDate"=>$row['creationDate'],
  "isDeleted"=>$row['isDeleted'],
  "isAssigned"=>$row['isAssigned'],
  "isPublic"=>$row['isPublic'],
);

$json = json_decode($row['json'],true);
// var_dump($json);
$itemEntered = array_merge($json,$itemEntered);

if ($itemType == 'Section'){
  $itemEntered['isOpen'] = false;
}

//Get new order
$sql = "
SELECT doenetId
FROM course_content
WHERE courseId='$courseId'
ORDER BY sortOrder
";

$result = $conn->query($sql); 
$order = [];
while($row = $result->fetch_assoc()){
  array_push($order,$row['doenetId']);
}
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "doenetId"=>$doenetId,
  "itemEntered"=>$itemEntered,
  "order"=>$order,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>