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

// if (array_key_exists('driveId', get_defined_vars())) {
$doenetId = mysqli_real_escape_string($conn, $_REQUEST["doenetId"]);

if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
}

if ($success) {
    $sql = "
SELECT courseId
FROM course_content
WHERE doenetId='$doenetId'
";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $courseId = $row["courseId"];
    } else {
        $success = false;
        $message = "Content not found";
    }
}

$response_arr = [
    "success" => $success,
    "message" => $message,
    "courseId" => $courseId,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
