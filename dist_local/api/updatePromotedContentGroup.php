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
$newGroupName = mysqli_real_escape_string($conn, $_POST["newGroupName"]);
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

    if ($currentlyFeatured) {
        // if we are trying to feature a group, make sure it has at least 4 items in it
        $sql = 
            "select groupName from promoted_content_group
            join promoted_content using (promotedGroupId)
            join course_content cc using (doenetId)
            where groupName = '$groupName'
            AND cc.isPublic = 1
            AND cc.isDeleted = 0
            AND cc.isBanned = 0
            ";
        $result = $conn->query($sql);
        if ($result && $result->num_rows < 4) {
            throw new Exception("Promoted groups must have at least 4 items in them before being shared.");
        }
    }

    $sql = 
        "update promoted_content_group set 
        currentlyFeatured = '$currentlyFeatured',
        homepage = '$homepage' ";

    if ($newGroupName) {
        $sql .= ", groupName = '$newGroupName' ";
    }
    $sql .= 
        " where groupName = '$groupName'";

    $result = $conn->query($sql);
    if ($result && $conn->affected_rows == 1) {
        $response_arr = [
            'success' => true,
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
