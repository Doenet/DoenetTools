<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];

$success = true;
$message = "";
$cidChanged = false;

$doenetId = mysqli_real_escape_string($conn, $_REQUEST["doenetId"]);

if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
}

if ($success) {
    $firstPageId = null;
    $sql = "SELECT CAST(jsonDefinition as CHAR) AS json
        FROM course_content
        WHERE doenetId = '$doenetId'
        AND isAssigned = 1
        AND isPublic = 1
        AND userCanViewSource = 1
        ";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        $json = json_decode($row['json'],true);

    } else {
        $success = false;
        $message = "No public activity found";
    }
}

$response_arr = [
    "success" => $success,
    "message" => $message,
    "json" => $json,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
