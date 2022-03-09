<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];

$_POST = json_decode(file_get_contents("php://input"), true);
$doenetId = mysqli_real_escape_string($conn, $_POST["doenetId"]);
$cid = mysqli_real_escape_string($conn, $_POST["cid"]);
$coreInfo = mysqli_real_escape_string($conn, $_POST["coreInfo"]);
$rendererState = mysqli_real_escape_string($conn, $_POST["rendererState"]);
$variantIndex = mysqli_real_escape_string($conn, $_POST["variantIndex"]);

$success = true;
$message = "";
if ($doenetId == "") {
    $success = false;
    $message = "Internal Error: missing doenetId";
} elseif ($cid == "") {
    $success = false;
    $message = "Internal Error: missing cid";
} elseif ($coreInfo == "") {
    $success = false;
    $message = "Internal Error: missing coreInfo";
} elseif ($rendererState == "") {
    $success = false;
    $message = "Internal Error: missing rendererState";
} elseif ($variantIndex == "") {
    $success = false;
    $message = "Internal Error: missing variantIndex";
} elseif ($userId == "") {
    $success = false;
    $message = "No access - Need to sign in";
}



// TODO: Determine how to check for permissions
// (Currently have check turned off so that it works from test)

// //Check permissions
// if ($success) {
//     $sql = "
//     SELECT du.canEditContent AS canEditContent
//     FROM drive_user AS du
//     LEFT JOIN drive_content AS dc
//     ON dc.driveId = du.driveId
//     WHERE dc.doenetId = '$doenetId'
//     and du.userId = '$userId'
//     ";
//     $result = $conn->query($sql);
//     if ($result->num_rows > 0) {
//         $row = $result->fetch_assoc();
//         if ($row["canEditContent"] == "0") {
//             $success = false;
//             $message = "No permisson to save renderer state";
//         }
//     } else {
//         $success = false;
//         $message = "No permisson to save renderer state";
//     }
// }

if ($success) {
    $sql = "INSERT INTO initial_renderer_state
        (cid, variantIndex, rendererState, coreInfo) 
        VALUES ('$cid', '$variantIndex', '$rendererState', '$coreInfo')
        ";

    $conn->query($sql);
    if ($conn->affected_rows == -1) {
        $message = "Row already exists";
    }
}

$response_arr = [
    "success" => $success,
    "message" => $message,
];

http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
