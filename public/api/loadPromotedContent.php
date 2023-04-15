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

    $sql = 
        "select groupName, currentlyFeatured, homepage,
                pc.sortOrder, doenetId, cc.label, cc.imagePath,
                screenName, email, lastName, firstName, 
                profilePicture, trackingConsent, canUpload
        from promoted_content_group pcg
        join promoted_content pc using(promotedGroupId)
        join course_content cc using(doenetId)
        join course c on cc.courseId = c.courseId
        join user on c.portfolioCourseForUserId = user.userId
        AND cc.isPublic = 1
        AND cc.isDeleted = 0
        AND cc.isBanned = 0
        AND c.portfolioCourseForUserId IS NOT NULL
        ";

    $result = $conn->query($sql);
    if ($result->num_rows <= 0) {
        throw new Exception("No promoted content groups were found.");
    } else {
        $promotedGroups = [];
        while ($row = $result->fetch_assoc()) {
            if ($promotedGroups[$row['groupName']]) {
                // add to existing list for this group if it was found in the list of rows so far
                array_push($promotedGroups[$row['groupName']], $row);
            } else {
                // otherwise add a new nested array for the group and add this first row to it
                $promotedGroups[$row['groupName']] = [$row];
            }
        }
    }
    $response_arr = [
        'success' => true,
        'carouselData' => $promotedGroups
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