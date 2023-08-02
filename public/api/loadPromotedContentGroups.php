<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'checkForCommunityAdminFunctions.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$response_arr;
try {
    // throws exception if current user is not an admin
    checkForAdmin($userId, $conn);

    $sql = 
        "select groupName, currentlyFeatured, homepage, promotedGroupId, itemCount
        from promoted_content_group pcg
        left join (
            select count(*) itemCount, promotedGroupId
            from promoted_content
            join course_content cc using (doenetId)
            where cc.isPublic = 1
            AND cc.isDeleted = 0
            AND cc.isBanned = 0
            group by promotedGroupId
        ) t using(promotedGroupId)
        order by pcg.currentlyFeatured desc, pcg.sortOrder
        ";

    $result = $conn->query($sql);
    if ($result->num_rows <= 0) {
        throw new Exception("No promoted content groups were found." . $conn->error);
    } else {
        $promotedGroups = [];
        while ($row = $result->fetch_assoc()) {
            $row['currentlyFeatured'] = $row['currentlyFeatured'] == '1' ? true : false;
            $row['homepage'] = $row['homepage'] == '1' ? true : false;
            $promotedGroups[] = $row;
        }
    }
    $response_arr = [
        'success' => true,
        'carouselGroups' => $promotedGroups 
    ];
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
