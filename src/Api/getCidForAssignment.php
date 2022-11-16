<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";

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
$publicOnly = mysqli_real_escape_string($conn, $_REQUEST["publicOnly"]);
$userCanViewSourceOnly = mysqli_real_escape_string(
    $conn,
    $_REQUEST["userCanViewSourceOnly"]
);

if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($userId == "" && $publicOnly != "true") {
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

    // get cid from course_content
    // unless draft, use it only as long as it is assigned
    // and either
    // - activity is globally assigned
    // - activity is assigned to user via user_assignment
    // - we are getting publicOnly information, or
    // - user has edit access to course
    $sql = "SELECT isGloballyAssigned, courseId,
        CAST(jsonDefinition as CHAR) AS json
        FROM course_content
        WHERE doenetId = '$doenetId'
        ";

    if ($publicOnly == "true") {
        $sql = "SELECT isGloballyAssigned, courseId, label,
        CAST(jsonDefinition as CHAR) AS json
        FROM course_content
        WHERE doenetId = '$doenetId' AND isPublic = 1
        ";
    }

    if ($getDraft != "true") {
        $sql = "$sql AND isAssigned = 1";
    }
    if ($userCanViewSourceOnly == "true") {
        $sql = "$sql AND userCanViewSource = 1";
    }

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $json = json_decode($row["json"], true);
        if ($getDraft == "true") {
            $cid = $json["draftCid"];
        } elseif ($publicOnly == "true") {
            $cid = $json["assignedCid"];
            $label = $row["label"];
        } elseif ($row["isGloballyAssigned"]) {
            $cid = $json["assignedCid"];
        } else {
            // not globally assigned and not publicOnly.  See if assigned to user.
            $sql = "SELECT doenetId
                    FROM user_assignment
                    WHERE doenetId = '$doenetId' AND userId='$userId' AND isUnassigned='0'
                    ";
            $result2 = $conn->query($sql);
            if ($result2->num_rows > 0) {
                $cid = $json["assignedCid"];
            } else {
                $courseId = $row["courseId"]; // Note: row is still from previous query
                $permissions = permissionsAndSettingsForOneCourseFunction(
                    $conn,
                    $userId,
                    $courseId
                );
                if ($permissions["canEditContent"] == "1") {
                    $cid = $json["assignedCid"];
                }
            }
        }
    }

    if ($cid && $latestAttemptOverrides == "true" && $publicOnly != "true") {
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

            if ($newCid != $cid) {
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
    "label" => $label,
];

http_response_code($response_arr['success'] ? 200 : 400);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
