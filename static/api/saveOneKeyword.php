<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$branchId = mysqli_real_escape_string($conn,$_REQUEST["branchId"]);
$keyword = mysqli_real_escape_string($conn,$_REQUEST["keyword"]);
// echo $documentName;
// echo $code;
//echo "keyword";
//echo $keyword;
//echo $contentId;
$sql = "INSERT INTO keyword (keyword,branchId) VALUES ('$keyword','$branchId');";

if ($conn->query($sql) === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
}else {
    echo "Error: " . $sql . "<br>" . $conn->error;
    }


$conn->close();


?>

