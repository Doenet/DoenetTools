<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include '../api/db_connection.php';

$message = "";
$success = TRUE;
$doenetId = $_REQUEST['doenetId'];

if (!$doenetId) {
  $success = false;
  $message = 'Missing doenetId';
} 

if ($success){

  $sql = "
  DELETE FROM event
  WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql); 

  
}

$response_arr = array(
  "message" => $message,
  "success" => $success
  );

http_response_code(200);
echo json_encode($response_arr);

 $conn->close();
?>