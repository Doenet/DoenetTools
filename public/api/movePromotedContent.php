<?php

use function PHPUnit\Framework\isNull;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'checkForCommunityAdminFunctions.php';
include "lexicographicalRankingSort.php";

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);

$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$groupId = mysqli_real_escape_string($conn,$_POST["groupId"]);
$direction = mysqli_real_escape_string($conn,$_POST["direction"]);

$response_arr;
try {
    // throws exception if current user is not an admin
    checkForAdmin($userId, $conn);

    $response_arr = SortOrder\moveItemInSortedList($conn, 'promoted_content', $direction,
        "promotedGroupId = '$groupId'", "doenetId = '$doenetId'" );

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
