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

    $positionalFunction;
    if ($direction == "left") {
        $positionalFunction = "lag";
    } else if ($direction == "right") {
        $positionalFunction = "lead";
    } else {
        throw new Exception("Invalid input for direction '$direction',
        'left' and 'right' are the only accepted values.");
    }
    $sql = 
        "select * from (
            select doenetId,
            $positionalFunction(sortOrder) over (order by sortOrder) neighbor,
            $positionalFunction(sortOrder, 2) over (order by sortOrder) secondNeighbor
            from promoted_content where promotedGroupId = '$groupId'
        ) tempTable
        where doenetId = '$doenetId'"; 
    $result = $conn->query($sql);
    if ($result && $result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $neighbor = $row['neighbor'];
        $secondNeighbor = $row['secondNeighbor'];
        if (is_null($neighbor)) {
            // this item is already furthest to the left, don't fail the request but don't
            // update anything either
            $response_arr = [
                'success' => true,
                'message' => 'nothing changed, this item is already the farthest to the left'
            ];
        } else {
            if ($direction == "left") {
                $sortOrder = SortOrder\getSortOrder($secondNeighbor, $neighbor);
            } else if ($direction == "right") {
                $sortOrder = SortOrder\getSortOrder($neighbor, $secondNeighbor);
            }

            $sql = 
                "update promoted_content
                set sortOrder = '$sortOrder'
                where doenetId = '$doenetId' and promotedGroupId = '$groupId'
                ";


            $result = $conn->query($sql);
            if ($result && $conn->affected_rows == 1) {
                $response_arr = [
                    'success' => true,
                    'toLeft' => $toLeft,
                    'secondToLeft' => $secondToLeft,
                    'direction' => $direction
                ];
            } else {
                throw new Exception("Failed to add move this activity in the promoted material group. " . $conn->error);
            }
            // set response code - 200 OK
            http_response_code(200);
        }
    } else {
        throw new Exception("Error finding sort order of previous items in promoted group." . $conn->error);
    }
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
