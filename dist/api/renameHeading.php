<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";

$headingId =  mysqli_real_escape_string($conn,$_REQUEST["headingId"]);
$value =  mysqli_real_escape_string($conn,$_REQUEST["value"]);
echo "\n-----\n";
echo "headingId $headingId \n";
echo "value $value \n";
echo "\n-----\n";

$sql = "UPDATE course_heading 
SET headingText = '$value'
WHERE courseHeadingId = '$headingId'";
$result = $conn->query($sql);

if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
}else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();

?>

