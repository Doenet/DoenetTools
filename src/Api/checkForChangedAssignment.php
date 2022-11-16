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
$cidChanged = false;

$doenetId = mysqli_real_escape_string($conn, $_REQUEST["doenetId"]);
$currentCid = mysqli_real_escape_string($conn, $_REQUEST["currentCid"]);

if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($currentCid == "") {
    $success = false;
    $message = "Internal Error: missing currentCid";
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

    // get assigned cid from course_content
    // use it only as long as it is assigned (either globally assigned or assigned via user_assignment)
    $sql = "SELECT isAssigned, isGloballyAssigned, JSONdefinition->>'$.assignedCid' as assignedCid
        FROM course_content
        WHERE doenetId = '$doenetId' AND isAssigned='1'
        ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $assignedCid = $row["assignedCid"];
        if ($row["isGloballyAssigned"]) {
            $cid = $assignedCid;
        } else {
            // not globally assigned.  See if assigned to user.
            $sql = "SELECT doenetId
                FROM user_assignment
                WHERE doenetId = '$doenetId' AND userId='$userId' AND isUnassigned='0'
                ";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $cid = $assignedCid;
            }
        }
    }

    if ($cid && $cid != $currentCid) {
        // the instructor must have changed the cid since this attempt was started
        $cidChanged = true;
    }
}

$response_arr = [
    "success" => $success,
    "message" => $message,
    "cidChanged" => $cidChanged,
];

http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
