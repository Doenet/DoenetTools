<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];
$examUserId = $jwtArray["examineeUserId"];
$examDoenetId = $jwtArray["doenetId"];

// $device = $jwtArray['deviceName'];

$CID = mysqli_real_escape_string($conn, $_REQUEST["CID"]);
$pageId = mysqli_real_escape_string($conn, $_REQUEST["pageId"]);
$attemptNumber = mysqli_real_escape_string($conn, $_REQUEST["attemptNumber"]);
$doenetId = mysqli_real_escape_string($conn, $_REQUEST["doenetId"]);
$requestedVariantIndex = mysqli_real_escape_string(
    $conn,
    $_REQUEST["requestedVariantIndex"]
);
$allowLoadState = mysqli_real_escape_string(
    $conn,
    $_REQUEST["allowLoadState"]
);

$paramUserId = mysqli_real_escape_string($conn, $_REQUEST["userId"]);

$success = true;
$message = "";
if ($CID == "") {
    $success = false;
    $message = "Internal Error: missing CID";
} elseif ($pageId == "") {
    $success = false;
    $message = "Internal Error: missing pageId";
} elseif ($attemptNumber == "") {
    $success = false;
    $message = "Internal Error: missing attemptNumber";
} elseif ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($requestedVariantIndex == "") {
    $success = false;
    $message = "Internal Error: missing requestedVariantIndex";
} elseif ($allowLoadState == "") {
    $success = false;
    $message = "Internal Error: missing allowLoadState";
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
    $effectiveUserId = $userId;
    if ($paramUserId !== "") {
        //TODO: Need a permission related to see grades (not du.canEditContent)
        $sql = "
            SELECT du.canEditContent 
            FROM drive_user AS du
            LEFT JOIN drive_content AS dc
            ON dc.driveId = du.driveId
            WHERE du.userId = '$userId'
            AND dc.doenetId = '$doenetId'
            AND du.canEditContent = '1'
    ";

        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $effectiveUserId = $paramUserId;
        }
    }

    $loadedState = false;

    if ($allowLoadState == "true") {
        $sql = "SELECT saveId, coreInfo, coreState, rendererState
            FROM page_state
            WHERE userId = '$effectiveUserId'
            AND doenetId = '$doenetId'
            AND CID = '$CID'
            AND pageId='$pageId'
            AND attemptNumber='$attemptNumber'
            ";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $coreState = $row["coreState"];
            $rendererState = $row["rendererState"];
            $coreInfo = $row["coreInfo"];
            $saveId = $row["saveId"];
            $loadedState = true;

            // TODO: check if instructor changed CID
        }
    }

    if ($success && !$loadedState) {
        // no saved page state (or flag set to now allow loading page state),
        // look up initial renderer state

        $sql = "SELECT rendererState, coreInfo
            FROM initial_renderer_state
            WHERE CID = '$CID'
            AND variantIndex = '$requestedVariantIndex'
            ";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $coreState = null;
            $rendererState = $row["rendererState"];
            $coreInfo = $row["coreInfo"];
            $loadedState = true;
        } else {
            // value missing from initial_renderer_state
            // will need to initialize core to determine rendererState
            $coreState = null;
            $rendererState = null;
            $coreInfo = null;
        }
    }
}

$response_arr = [
    "success" => $success,
    "loadedState" => $loadedState,
    "coreState" => $coreState,
    "rendererState" => $rendererState,
    "coreInfo" => $coreInfo,
    "saveId" => $saveId,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
