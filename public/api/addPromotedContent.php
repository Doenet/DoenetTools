<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

/*
if ($userId == '') {
    $success = false;
    $message = 'You need to be signed in to create a portfolio activity.';
}
*/

$_POST = json_decode(file_get_contents("php://input"),true);

$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$groupId = mysqli_real_escape_string($conn,$_POST["groupId"]);

$response_arr;
try {
    if ($userId == '') {
        throw new Exception('You need to be logged in to modify the promoted material groups.');
    } else {
        $sql = 
            "select userId from community_admins
            where userId = '$userId'
            ";

        $result = $conn->query($sql);
        if ($result->num_rows == 0) {
            throw new Exception('You do not have permissions to modify the promoted material groups.');
        }
    }
    $sql = 
        "select doenetId from promoted_content where doenetId = '$doenetId' and promoted_content_groups_id = '$groupId'";
    $result = $conn->query($sql);
    if ($result && $result->num_rows == 1) {
        throw new Exception("This activity is already in that group.");
    }

    $sql = 
        "insert into promoted_content (doenetId, promoted_content_groups_id,sortOrder) values ('$doenetId','$groupId', 1)";

    $result = $conn->query($sql);
    if ($result && $conn->affected_rows == 1) {
        $response_arr = [
            'success' => true,
        ];
    } else {
        throw new Exception(print_r($_POST, true) . $sql . "Failed to add this activity to promoted material group. " . $conn->error . $conn->affected_rows );
    }
    // set response code - 200 OK
    http_response_code(200);

} catch (Exception $e) {
    $response_arr = [
        'success' => false,
        'message' => $e->getMessage(),
    ];
    http_response_code(400);

} finally {
    // make it json format
    echo json_encode($response_arr);
    $conn->close();
}
?>
