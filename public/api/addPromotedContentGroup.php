<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'checkForCommunityAdminFunctions.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);

$groupName = mysqli_real_escape_string($conn,$_POST["groupName"]);

$response_arr;
try {
    // throws exception if current user is not an admin
    checkForAdmin($userId, $conn);
    if (!$groupName || trim($groupName) == '') {
        throw new Exception("Group name cannot be blank");
    }

    $sql = 
        "select groupName from promoted_content_group where groupName = '$groupName'";
    $result = $conn->query($sql);
    if ($result && $result->num_rows == 1) {
        throw new Exception("A group with that name already exists.");
    }

    $sql = 
        "insert into promoted_content_group (groupName) values ('$groupName')";

    $result = $conn->query($sql);
    if ($result && $conn->affected_rows == 1) {
        $response_arr = [
            'success' => true,
        ];
    } else {
        throw new Exception("Failed to add a new group. " . $conn->error);
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
