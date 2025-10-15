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

$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$groupId = mysqli_real_escape_string($conn,$_POST["groupId"]);

$response_arr;
try {
    // throws exception if current user is not an admin
    checkForAdmin($userId, $conn);

    $sql = 
        "delete from promoted_content where doenetId = '$doenetId' and promotedGroupId = '$groupId'";

    $result = $conn->query($sql);
    if ($result) {
        $response_arr = [
            'success' => true,
            'message' => $sql
        ];
    } else {
        throw new Exception("Error removing promoted content from this group. - " . $conn->error);
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
