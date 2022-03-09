<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];
$examUserId = array_key_exists("examineeUserId", $jwtArray)
    ? $jwtArray["examineeUserId"]
    : "";
$examDoenetId = array_key_exists("doenetId", $jwtArray)
    ? $jwtArray["doenetId"]
    : "";

$success = true;
$message = "";

$doenetId = mysqli_real_escape_string($conn, $_REQUEST["doenetId"]);

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

if ($success) {
    $cid = null;

    // first check if there is an cidOverride in user_assignment

    $sql = "SELECT cidOverride
		FROM user_assignment
		WHERE userId = '$userId'
		AND doenetId = '$doenetId'
	";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $cid = $row["cidOverride"];
    }

    // get cid from course_content if didn't override
    // as long as it is assigned and globally assigned
    if ($cid == null) {
        $sql = "SELECT cid, isAssigned, isGloballyAssigned
            FROM course_content
            WHERE doenetId = '$doenetId'
            ";

        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if($row["isAssigned"] && $row["isGloballyAssigned"]) {
                $cid = $row["cid"];
            }
        }
    }
}

$response_arr = [
    "success" => $success,
    "message" => $message,
    "cid" => $cid,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
