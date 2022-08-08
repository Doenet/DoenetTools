<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
// header('Content-Type: application/json');

include "db_connection.php";
include "cidFromSHA.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);

$doenetId =  mysqli_real_escape_string($conn,$_POST["doenetId"]);
$dangerousDoenetML = $_POST["doenetML"];
$timestamp = mysqli_real_escape_string($conn,$_POST["timestamp"]);
$newVersionId = mysqli_real_escape_string($conn,$_POST["versionId"]);

$SHA = hash('sha256', $dangerousDoenetML);
$cid = cidFromSHA($SHA);

$success = TRUE;
$message = "";

if ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}elseif ($newVersionId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing versionId';
}elseif ($timestamp == ""){
  $success = FALSE;
  $message = 'Internal Error: missing timestamp';
}

if ($success){
  $newfile = fopen("../media/$cid.doenet", "w") or die("Unable to open file!");
  $status = fwrite($newfile, $dangerousDoenetML);
  if ($status === false){
    $success = FALSE;
    $message = "Couldn't save. Please try again.";
  }
  fclose($newfile);
}

if ($success){

//Calculate Title
  $sql = "
  SELECT count(isNamed) AS versionCount
  FROM content
  WHERE doenetId = '$doenetId'
  AND isNamed = '1'
  GROUP BY isNamed
  LIMIT 1
  ";

  $savenumber = 1;
  $result = $conn->query($sql); 
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $savenumber  = $row['versionCount'] + 1;
  }
  $title = "Save $savenumber";


//Ensure DoenetId is set to released
  $sql = "
  UPDATE drive_content
  SET isReleased = '1'
  WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql); 

  //Retract All Versions
  $sql = "
  UPDATE content
  SET isReleased = '0'
  WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql);

  $sql = "
  INSERT INTO content
  (doenetId,cid,versionId,title,timestamp,isDraft,isNamed,isReleased)
  VALUES
  ('$doenetId','$cid','$newVersionId','$title','$timestamp','0','1','1')
  ";
  $result = $conn->query($sql);
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "title"=>$title
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>