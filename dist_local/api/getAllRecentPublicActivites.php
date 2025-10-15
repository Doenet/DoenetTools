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
        "select doenetId, cc.label, cc.imagePath,
                screenName, email, concat(firstName, concat(' ', lastName)) as fullName,
                profilePicture, trackingConsent, canUpload
        from course_content cc
        join course c on cc.courseId = c.courseId
        join user on c.portfolioCourseForUserId = user.userId
        AND cc.isPublic = 1
        AND cc.isDeleted = 0
        AND cc.isBanned = 0
        AND c.portfolioCourseForUserId IS NOT NULL
        order by cc.creationDate desc
        limit 100
        ";

    $result = $conn->query($sql);
    $matchingActivities = [];
    while ($row = $result->fetch_assoc()) {
        $row['type'] = 'activity';
        $matchingActivities[] = $row;
    }
    $response_arr = [
        'success' => true,
        "searchResults"=>["users"=>[],"activities"=>$matchingActivities],
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