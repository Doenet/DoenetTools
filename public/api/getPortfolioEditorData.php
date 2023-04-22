<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

$response_arr;
try {

    //TODO: Check if they have permission to edit it
    //TODO: Separate error messages for banned and deleted?

    $sql = "
    SELECT 
    type,
    imagePath,
    label,
    CAST(jsonDefinition as CHAR) AS json
    FROM course_content
    WHERE doenetId = '$doenetId'
    AND isDeleted = '0'
    AND isBanned = '0'
    ";
$result = $conn->query($sql);


if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $type = $row['type'];
    $imagePath = $row['imagePath'];
    $label = $row['label'];
    $json = json_decode($row['json'], true);

}else{
    throw new Exception("Activity not found.");
}
    $response_arr = [
        'success' => true,
        "activity"=>[
            "type"=>$type,
            "label"=>$label,
            "imagePath"=>$imagePath,
            "content"=>$json['content'],
            "isSinglePage"=>$json['isSinglePage'],
            "version"=>$json['version'],
        ],
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