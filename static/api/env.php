<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$sql = "SELECT username FROM user WHERE username='$remoteuser' AND accessAllowed='1';";

$result = $conn->query($sql); 
$access = $result->num_rows;

$response_arr = array(
    "user" => $remoteuser,
    "access" => $access,
);

 // set response code - 200 OK
 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);
$conn->close();

?>