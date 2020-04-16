<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";


$swap1 =  mysqli_real_escape_string($conn,$_REQUEST["swap1"]);
$swap2 =  mysqli_real_escape_string($conn,$_REQUEST["swap2"]);

$sql = "SELECT sortOrder
FROM assignment
WHERE assignmentId = '$swap1'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$swap1_order = $row['sortOrder'];

$sql = "SELECT sortOrder
FROM assignment
WHERE assignmentId = '$swap2'";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$swap2_order = $row['sortOrder'];

$sql = "UPDATE assignment 
SET sortOrder = '$swap1_order'
WHERE assignmentId = '$swap2'";
$result = $conn->query($sql);

$sql = "UPDATE assignment 
SET sortOrder = '$swap2_order'
WHERE assignmentId = '$swap1'";
$result = $conn->query($sql);

if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
}else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>

