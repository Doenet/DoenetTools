<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];
$examUserId = array_key_exists("examineeUserId", $jwtArray)
    ? $jwtArray["examineeUserId"]
    : "";
$examDoenetId = array_key_exists("doenetId", $jwtArray)
    ? $jwtArray["doenetId"]
    : "";

$doenetId = mysqli_real_escape_string($conn, $_REQUEST["doenetId"]);

$success = true;
$message = "";

if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($userId == "") {
    if ($examUserId == "") {
        $success = false;
        $message = "No access - Need to sign in";
    } elseif ($examDoenetId != $doenetId) {
        $success = false;
        $message = "No access for doenetId: $doenetId";
    } else {
        $userId = $examUserId;
    }
}

$variants = [];
$attemptNumbers = [];

if ($success) {
    $sql = "SELECT uaa.attemptNumber as attemptNumber,
        a.variantIndex as variantIndex
        FROM user_assignment_attempt as uaa
        LEFT JOIN activity_state as a
        ON uaa.doenetId = a.doenetId AND uaa.userId=a.userId AND uaa.attemptNumber=a.attemptNumber
        WHERE uaa.userId='$userId'
        AND uaa.doenetId='$doenetId'
        ORDER BY uaa.attemptNumber ASC";

    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        array_push($variants, $row["variantIndex"]);
        array_push($attemptNumbers, $row["attemptNumber"]);
    }
}

$response_arr = [
    "success" => $success,
    "attemptNumbers" => $attemptNumbers,
    "variants" => $variants,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
