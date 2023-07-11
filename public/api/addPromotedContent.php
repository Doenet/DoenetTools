<?php
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

$response_arr;
try {
    // throws exception if current user is not an admin
    checkForAdmin($userId, $conn);

    $sql = 
        "select doenetId from promoted_content where doenetId = '$doenetId' and promotedGroupId = '$groupId'";
    $result = $conn->query($sql);
    if ($result && $result->num_rows == 1) {
        throw new Exception("This activity is already in that group.");
    }

    $sql = "SELECT sortOrder
    FROM promoted_content
    WHERE promotedGroupId = '$groupId'
    ORDER BY sortOrder desc
    LIMIT 1";
    $result = $conn->query($sql); 
    $row = $result->fetch_assoc() ;
    $prev = $row['sortOrder'] ?: "";
    $sortOrder = SortOrder\getSortOrder($prev, null);

    $sql = 
        "insert into promoted_content (doenetId, promotedGroupId,sortOrder) values ('$doenetId','$groupId', '$sortOrder')";

    $result = $conn->query($sql);
    if ($result && $conn->affected_rows == 1) {
        $response_arr = [
            'success' => true,
            'prev' => $prev
        ];
    } else {
        throw new Exception("Failed to add this activity to promoted material group. " . $conn->error);
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
