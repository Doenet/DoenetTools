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
    $isAdmin = false;
    if ($userId != '') {
        $sql = 
            "select userId from community_admins
            where userId = '$userId'
            ";

        $result = $conn->query($sql);
        if ($result->num_rows == 1) {
            $isAdmin = true;
        }
    }
    $response_arr = [
        'success' => true,
        'isAdmin' => $isAdmin
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