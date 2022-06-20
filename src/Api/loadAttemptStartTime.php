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
$attemptNumber = mysqli_real_escape_string($conn, $_REQUEST["attemptNumber"]);

$success = true;
$message = "";

if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($attemptNumber == "") {
    $success = false;
    $message = "Internal Error: missing attemptNumber";
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


if ($success) {
    $sql = "
        SELECT cu.timeLimitMultiplier AS timeLimitMultiplier
        FROM course_user AS cu
        LEFT JOIN course_content AS cc
        ON cu.courseId = cc.courseId
        WHERE cc.doenetId='$doenetId'
        AND cu.userId = '$userId'";

    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $timeLimitMultiplier = $row["timeLimitMultiplier"];
    if (!$timeLimitMultiplier) {
        $timeLimitMultiplier = "1";
    }

    $sql = "SELECT began
        FROM user_assignment_attempt
        WHERE userId='$userId'
        AND doenetId='$doenetId'
        AND attemptNUmber='$attemptNumber'
        ";

    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $attemptStart = $row["began"];
}

$response_arr = [
    "success" => $success,
    "attemptStart" => $attemptStart,
    "timeLimitMultiplier" => $timeLimitMultiplier,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
