<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$success = true;
$message = '';


$email = mysqli_real_escape_string($conn,$_REQUEST["email"]);
$firstName = mysqli_real_escape_string($conn,$_REQUEST["firstName"]);
$lastName = mysqli_real_escape_string($conn,$_REQUEST["lastName"]);

$sql = "
UPDATE user
SET firstName='$firstName',
lastName='$lastName'
WHERE email='$email'
";
$conn->query($sql);

$response_arr = array(
    'success' => $success,
    'message' => $message,
);

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
