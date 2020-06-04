<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$sql = "SELECT username,accessAllowed,adminAccessAllowed FROM user WHERE username='$remoteuser' AND accessAllowed='1';";

$result = $conn->query($sql); 
$row = $result->fetch_assoc();
$access = $result->num_rows;

$response_arr = array(
    "user" => $remoteuser,
    "access" => $access,
    "accessAllowed"=>$row["accessAllowed"],
    "adminAccess"=>$row["adminAccessAllowed"]
);

 // set response code - 200 OK
 http_response_code(200);

 // make it json format
 echo json_encode($response_arr);
$conn->close();

?>