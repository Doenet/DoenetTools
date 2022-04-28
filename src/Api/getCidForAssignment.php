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
$latestAttemptOverrides = mysqli_real_escape_string(
    $conn,
    $_REQUEST["latestAttemptOverrides"]
);
$getDraft = mysqli_real_escape_string($conn, $_REQUEST["getDraft"]);

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
    $doenetIdForCid = $doenetId;
    $isDoenetIdOverridden = false;

    // first check if there is an doenetIdOverride in user_assignment

    $sql = "SELECT doenetIdOverride
        FROM user_assignment
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $doenetIdOverride = $row["doenetIdOverride"];
        if ($doenetIdOverride != null) {
            $doenetIdForCid = $doenetIdOverride;
            $isDoenetIdOverridden = true;
        }
    }

    // get cid from course_content
    // if didn't override doenetId, then use it only as long as it is assigned and globally assigned
    $sql = "SELECT isAssigned, isGloballyAssigned,
        CAST(jsonDefinition as CHAR) AS json
        FROM course_content
        WHERE doenetId = '$doenetIdForCid'
        ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($getDraft === "true") {
            $json = json_decode($row["json"], true);
            $cid = $json["draftCid"];
        } elseif (
            $isDoenetIdOverridden ||
            ($row["isAssigned"] && $row["isGloballyAssigned"])
        ) {
            $json = json_decode($row["json"], true);
            $cid = $json["assignedCid"];
        }
    }

    if ($latestAttemptOverrides == "true") {
        // the cid from the latest attempt overrides the instructor-provided cid
        // from the assignment/content tables
        $sql = "SELECT cid
            FROM activity_state
            WHERE userId = '$userId'
            AND doenetId = '$doenetId'
            AND attemptNumber = (SELECT MAX(attemptNumber) FROM user_assignment_attempt WHERE userId='$userId' AND doenetId='$doenetId')
            ";

        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $newCid = $cid;
            $cid = $row["cid"];

            if ($newCid && $newCid != $cid) {
                // the instructor must have changed the cid since this attempt was started
                $cidChanged = true;
            }
        }
    }
}

$response_arr = [
    "success" => $success,
    "message" => $message,
    "cid" => $cid,
    "cidChanged" => $cidChanged,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
