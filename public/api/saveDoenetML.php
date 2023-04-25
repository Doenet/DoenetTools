<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db_connection.php";
include "cidFromSHA.php";
include "permissionsAndSettingsForOneCourseFunction.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];

$_POST = json_decode(file_get_contents("php://input"), true);

$dangerousDoenetML = $_POST["doenetML"];
$pageId = mysqli_real_escape_string($conn, $_POST["pageId"]);
$courseId = mysqli_real_escape_string($conn, $_POST["courseId"]);
$saveAsCid = mysqli_real_escape_string($conn, $_POST["saveAsCid"]);
$lastKnownCid = mysqli_real_escape_string($conn, $_POST["lastKnownCid"]);
$backup = mysqli_real_escape_string($conn, $_POST["backup"]);

$success = true;
$message = "";
$cid = null;

// set default response code - 200 OK
http_response_code(200);

if ($pageId == "") {
    $success = false;
    $message = "Internal Error: missing pageId";
} elseif ($courseId == "") {
    $success = false;
    $message = "Internal Error: missing courseId";
} elseif ($userId == "") {
    $success = false;
    $message = "You need to be signed in to edit a page";
}

//Test Permission to edit content
if ($success) {
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );
    if ($permissions["canEditContent"] != "1") {
        $success = false;
        $message = "You need edit permission to edit a page";
        // http_response_code(403);
    }
}

// check if pageId belongs to courseId
if ($success) {
    $sql = "SELECT doenetId, label
        FROM pages
        WHERE courseId='$courseId' AND doenetId='$pageId'
        ";

    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $label = $row["label"];
    } else {
        //Try link pages
        $sql = "SELECT doenetId, label
        FROM link_pages
        WHERE courseId='$courseId' AND doenetId='$pageId'
        ";

        $result = $conn->query($sql);
        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $label = $row["label"];
        } else {

            $success = false;
            $message = "Invalid page";
        }
    }
}

if ($success) {
    if ($saveAsCid == "1") {
        $SHA = hash("sha256", $dangerousDoenetML);
        $cid = cidFromSHA($SHA);
        $filename = $cid;
    } else {
        $filename = "byPageId/$pageId";
        $path = "../media/$filename.doenet";
        if (file_exists($path)) {

            $SHA = hash_file('sha256', $path);
            $oldCid = cidFromSHA($SHA);
            
            if ($lastKnownCid != $oldCid) {
                $success = false;
                $message = "YOUR CHANGES TO THE DOCUMENT HAVE NOT BEEN SAVED. This document has been modified since you last saved. " .
                "Reload the page to view the new version, or open it in a new tab to compare them yourself.";
            }
            if ($backup == "1") {
                rename($path, "../media/$filename.bak");
            }
        }
    }

    if ($success) {
        //TODO: Config file needed for server
        $newfile = fopen("../media/$filename.doenet", "w");
        if ($newfile === false) {
            $success = false;
            $message = "Unable to open file!";
            // http_response_code(500);
        } else {
            $status = fwrite($newfile, $dangerousDoenetML);
            if ($status === false) {
                $success = false;
                $message = "Didn't save to file";
                // http_response_code(500);
            } else {
                fclose($newfile);
            }
        }
    }
}

$response_arr = [
    "success" => $success,
    "message" => $message,
    // This cid is only defined in the case where you requested saveAsCid.
    // In the case where we are saving by page id the client is expected to
    // hash the content after a successful save to know what to send in the next
    // request as the lastKnownCid.
    "cid" => $cid,
    "label" => $label,
    "saveAsCid" => $saveAsCid,
    "filename" => $filename
];

echo json_encode($response_arr);

$conn->close();
?>
