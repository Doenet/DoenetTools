<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

// $type = mysqli_real_escape_string($conn,$_REQUEST["type"]);

$success = TRUE;
$message = "";
$driveIdsAndLabels = array();

if ($userId == ""){
  $success = FALSE;
  $message = "You need to be signed in to view drives";
}

if ($success){
  //Gather matching drive ids for author
  
  $sql = "
  SELECT
  d.driveId AS driveId,
  d.label AS label,
  d.driveType AS driveType,
  d.isShared AS isShared,
  d.isPublic AS isPublic,
  d.image AS image,
  d.color AS color
  FROM drive AS d
  LEFT JOIN drive_user AS du
  ON d.driveId = du.driveId
  WHERE du.userId='$userId'
  AND d.isDeleted = '0'
  ";

  $result = $conn->query($sql);
  while($row = $result->fetch_assoc()){
    $driveAndLabel = array(
      "driveId"=>$row['driveId'],
      "label"=>$row['label'],
      "type"=>$row['driveType'],
      "subType"=>"Administrator",
      "isShared"=>$row['isShared'],
      "isPublic"=>$row['isPublic'],
      "image"=>$row['image'],
      "color"=>$row['color'],

    );
    array_push($driveIdsAndLabels,$driveAndLabel);
  }

  $sql = "
  SELECT 
  d.driveId AS driveId,
  d.label AS label,
  d.driveType AS driveType,
  d.isShared AS isShared,
  d.isPublic AS isPublic,
  d.image AS image,
  d.color AS color
  FROM enrollment AS e
  LEFT JOIN drive AS d
  ON d.driveId = e.driveId
  WHERE e.userId='$userId'
  AND d.isDeleted = '0'
  ";

  $result = $conn->query($sql);
  while($row = $result->fetch_assoc()){
    $driveAndLabel = array(
      "driveId"=>$row['driveId'],
      "label"=>$row['label'],
      "type"=>$row['driveType'],
      "subType"=>"Student",
      "isShared"=>$row['isShared'],
      "isPublic"=>$row['isPublic'],
      "image"=>$row['image'],
      "color"=>$row['color'],

    );
    array_push($driveIdsAndLabels,$driveAndLabel);
  }

}
$response_arr = array(
  "success"=>$success,
  "driveIdsAndLabels"=>$driveIdsAndLabels,
  "message"=>$message
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>