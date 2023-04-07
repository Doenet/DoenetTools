<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$response_arr;
try {
    if ($userId == '') {
        throw new Exception('You need to be logged in to see the promoted materials groups.');
    } else {
        $sql = 
            "select userId from community_admins
            where userId = '$userId'
            ";

        $result = $conn->query($sql);
        if ($result->num_rows == 0) {
            throw new Exception('You do not have permissions to modify the promoted materials.');
        }
    }

    $sql = 
        "select groupName, currentlyFeatured, homepage, id
        from promoted_content_groups pcg";

    $result = $conn->query($sql);
    if ($result->num_rows <= 0) {
        throw new Exception("No promoted content groups were found.");
    } else {
        $promotedGroups = [];
        while ($row = $result->fetch_assoc()) {
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
