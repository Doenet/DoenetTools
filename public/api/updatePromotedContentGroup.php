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

$currentlyFeatured = $_POST["currentlyFeatured"];
if ($currentlyFeatured) $currentlyFeatured = 1;
else $currentlyFeatured = 0;

$homepage = $_POST["homepage"];
if ($homepage) $homepage = 1;
else $homepage = 0;

$response_arr;
try {
    // throws exception if current user is not an admin
    checkForAdmin($userId, $conn);
    if (!$groupName || trim($groupName) == '') {
        throw new Exception("Group name cannot be blank");
    }

    $sql = 
        "update promoted_content_group set currentlyFeatured = '$currentlyFeatured', homepage = '$homepage'
         where groupName = '$groupName'";

    $result = $conn->query($sql);
    if ($result && $conn->affected_rows == 1) {
        $response_arr = [
            'success' => true,
            'message' => $sql
        ];
    } else {
        throw new Exception("Failed to update the group. " . $conn->error);
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
