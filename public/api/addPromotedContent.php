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

    
    // check for any legacy promoted content without proper sort orders assigned, and fix them up
    $sql = 
        "select promotedGroupId from promoted_content_group
         where sortOrder in (
            select sortOrder from promoted_content_group group by sortOrder having count(*) > 1)";
    $result = $conn->query($sql);
    if (!$result) {
        throw new Exception("Error identifying if we need to fix up previous promoted group sort orders - " . $conn->error);
    } else if ($result && $result->num_rows > 0) {
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        // get the last sortOrder in the list of promoted content groups
        $sql = "SELECT sortOrder
        FROM promoted_content_group
        ORDER BY sortOrder desc
        LIMIT 1";
        $result = $conn->query($sql); 
        $row = $result->fetch_assoc() ;
        $prev = $row['sortOrder'] ?: "";

        foreach ($rows as $row) {
            $promotedGroupId = $row['promotedGroupId'];
            $sortOrder = SortOrder\getSortOrder($prev, null);
            $sql = "update promoted_content_group set sortOrder = '$sortOrder'
                    where promotedGroupId = '$promotedGroupId'";
            $result = $conn->query($sql);
            if (!$result) {
                throw new Exception("Error fixing up previous promoted group sort orders - " . $conn->error);
            }
            $prev = $sortOrder;
        }
    }

    // also check that all of the individual elements in the promoted groups have a sortOrder as well
    $sql = 
    "select doenetId, promotedGroupId from promoted_content
     where sortOrder in (
        select sortOrder from promoted_content group by sortOrder, promotedGroupId having count(*) > 1)";

    $result = $conn->query($sql);
    if (!$result) {
        throw new Exception("Error identifying if we need to fix up previous promoted content sort orders - " . $conn->error);
    } else if ($result && $result->num_rows > 0) {
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        // NOTE - this code does just use the highest sort order found in any promoted
        // group and appends elements after that sort order regardless of the group
        // that the promoted material is assigned to. This won't break anything but
        // it does mean we will be lengthening the sortOrder strings a little more than
        // we need to, but doing it this way saves writing a more complex query and another php loop.
        // We don't expect these lists to get very long, and after this cleanup code runs once it should
        // never be run again (hopefully).

        // get the last sortOrder in the list of promoted content groups
        $sql = "SELECT sortOrder
        FROM promoted_content
        ORDER BY sortOrder desc
        LIMIT 1";
        $result = $conn->query($sql); 
        $row = $result->fetch_assoc() ;
        $prev = $row['sortOrder'] ?: "";

        foreach ($rows as $row) {
            $doenetId = $row['doenetId'];
            $promotedGroupId = $row['promotedGroupId'];
            $sortOrder = SortOrder\getSortOrder($prev, null);
            $sql = "update promoted_content set sortOrder = '$sortOrder'
                    where promotedGroupId = '$promotedGroupId' and doenetId = '$doenetId'";
            $result = $conn->query($sql);
            if (!$result) {
                throw new Exception("Error fixing up previous promoted content sort orders - " . $conn->error);
            }
            $prev = $sortOrder;
        }
    }


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
            'success' => true
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
