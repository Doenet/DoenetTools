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

$sql = "
SELECT 
type,
courseId,
label,
isBanned,
isAssigned,
isGloballyAssigned,
isPublic,
userCanViewSource,
CAST(jsonDefinition as CHAR) AS json,
imagePath,
CAST(learningOutcomes as CHAR) AS learningOutcomes
FROM course_content
WHERE doenetId = '$doenetId'
AND isDeleted = '0'
";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
$row = $result->fetch_assoc();
$type = $row['type'];
$courseId = $row['courseId'];
$label = $row['label'];
$isBanned = $row['isBanned'];
$isAssigned = $row['isAssigned'];
$userCanViewSource = $row['userCanViewSource'];
$isGloballyAssigned = $row['isGloballyAssigned'];
$isPublic = $row['isPublic'];
$userCanViewSource = $row['userCanViewSource'];
$json = json_decode($row['json'], true);
$imagePath = $row['imagePath'];
$learningOutcomes = json_decode($row['learningOutcomes'], true);
if ($isBanned == '1'){
    throw new Exception("Activity has been banned.");
}

}else{
throw new Exception("Activity not found.");
}
    $response_arr = [
        'success' => true,
        "activity"=>[
            "type"=>$type,
            "label"=>$label,
            "isBanned"=>$isBanned,
            "isAssigned"=>$isAssigned,
            "userCanViewSource"=>$userCanViewSource,
            "isGloballyAssigned"=>$isGloballyAssigned,
            "isPublic"=>$isPublic,
            "imagePath"=>$imagePath,
            "content"=>$json['content'],
            "isSinglePage"=>$json['isSinglePage'],
            "isPublic"=>$isPublic,
            "version"=>$json['version'],
            "learningOutcomes"=>$learningOutcomes,
        ],
        "courseId"=>$courseId,

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