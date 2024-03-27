<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];
if ($userId == ""){
    $userId = $jwtArray['examineeUserId'];
}

$result = $conn->query(
    "SELECT 
        screenName, 
        email, 
        lastName, 
        firstName, 
        profilePicture, 
        trackingConsent,
        canUpload
    FROM user
    WHERE userId = '$userId'"
);
$response_arr = ['success' => '0'];

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $profile = [
        'userId' => $userId,
        'screenName' => $row['screenName'],
        'email' => $row['email'],
        'firstName' => $row['firstName'],
        'lastName' => $row['lastName'],
        'profilePicture' => $row['profilePicture'],
        'trackingConsent' => $row['trackingConsent'],
        'signedIn' => '1',
        'device' => $jwtArray['deviceName'],
        'canUpload' => $row['canUpload']
    ];

    $response_arr = [
        'success' => '1',
        'profile' => $profile,
    ];
} else {
    //Send back not signed in profile
    $profile = [
        'screenName' => 'anonymous',
        'email' => '',
        'firstName' => '',
        'lastName' => '',
        'profilePicture' => 'anonymous',
        'trackingConsent' => true,
        'signedIn' => '0',
        'userId' => $userId,
        'canUpload' => '0'
    ];
    $profile['device'] = 'N/A';

    $response_arr = ['success' => '1', 'profile' => $profile];
}

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
