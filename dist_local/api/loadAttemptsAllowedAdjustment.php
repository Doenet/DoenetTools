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

$numberOfAttemptsAllowedAdjustment = 0;

if ($success) {
    $sql = "SELECT numberOfAttemptsAllowedAdjustment
        FROM user_assignment
        WHERE userId='$userId'
        AND doenetId='$doenetId'
        ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($row["numberOfAttemptsAllowedAdjustment"] > 0) {
            $numberOfAttemptsAllowedAdjustment =
                $row["numberOfAttemptsAllowedAdjustment"];
        }
    }
}

$response_arr = [
    "success" => $success,
    "numberOfAttemptsAllowedAdjustment" => $numberOfAttemptsAllowedAdjustment,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
