<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$sql = "
    SELECT *
    FROM user
    WHERE username = '$remoteuser'
";

$result = $conn->query($sql); 
$response_arr = array();


if ($result->num_rows > 0){
    // set response code - 200 OK
    http_response_code(200);

    // make it json format
    echo json_encode($result->fetch_assoc());
} else {
    http_response_code(500);
    echo "Internal Server Error";
}


$conn->close();
?>
