<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
$cid = mysqli_real_escape_string($conn,$_REQUEST["cid"]);

$success = true;
$msg = "";

$sql = "
SELECT fileType
FROM support_files
WHERE contentId = '$cid'
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

$type = $row['fileType'];

// set response code - 200 OK
http_response_code(200);

$response_arr = array("success" => $success,
                       "mime-type" => $type,
                        "msg" => $msg);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>