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

$message = "";
$cid = null;

try {
    if ($pageId == "") {
        throw new Exception("Internal Error: missing pageId");
    } elseif ($courseId == "") {
        throw new Exception("Internal Error: missing courseId");
    } elseif ($userId == "") {
        throw new Exception("You need to be signed in to edit a page");
    }

    //Test Permission to edit content
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );
    if ($permissions["canEditContent"] != "1") {
        throw new Exception("You need edit permission to edit a page");
        // http_response_code(403);
    }

    // check if pageId belongs to courseId
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
            throw new Exception("Invalid page");
        }
    }

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
                throw new Exception("YOUR CHANGES TO THE DOCUMENT HAVE NOT BEEN SAVED. This document has been modified since you last saved. " .
                "Reload the page to view the new version, or open it in a new tab to compare them yourself.");
            }
            if ($backup == "1") {
                $status = rename($path, "../media/$filename.bak");
                if (!$status) {
                    throw new Exception("Failed to save backup file, aborting save entirely, please retry.");
                }
            }
        }
    }

    //TODO: Config file needed for server
    $newfile = fopen("../media/$filename.doenet", "w");
    if ($newfile === false) {
        throw new Exception("Unable to open file!");
        // http_response_code(500);
    } else {
        $status = fwrite($newfile, $dangerousDoenetML);
        if ($status === false) {
            throw new Exception("Didn't save to file");
            // http_response_code(500);
        } else {
            fclose($newfile);
        }
    }

    $response_arr = [
        "success" => true,
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
    http_response_code(200);

} catch (Exception $e) {
    $response_arr = [
        'success' => false,
        'message' => $e->getMessage(),
    ];
    http_response_code(200);
    // TODO - enable error codes when all callers are confirmed to handle them correctly
    // several of the exceptions in this file should be 500 level exceptions for internal server errors
    //http_response_code(400);

} finally {
    // make it json format
    echo json_encode($response_arr);
    $conn->close();
}
?>
