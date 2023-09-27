<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);


$response_arr;
try {
  $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
    $conn,
    $userId,
    $courseId
);

if ($requestorPermissions['dataAccessPermission'] != 'Identified') {
    throw new Exception("You need to have Identified data access in order to view data.");
}

$sql = "SELECT 
label,
doenetId
FROM course_content
WHERE courseId = '$courseId'
AND isAssigned = '1'
ORDER BY sortOrder
";
$result = $conn->query($sql);

$activities_arr = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        array_push($activities_arr, [
            'doenetId' => $row['doenetId'],
            'label' => $row['label'],
        ]);
    }
  }

$response_arr = [
  'success' => true,
  'activities' => $activities_arr,
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
