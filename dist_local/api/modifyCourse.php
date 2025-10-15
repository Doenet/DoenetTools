<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);
try {


    if (!array_key_exists('courseId', $_POST)) {
        throw new Exception("No courseId sent.");
    }
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);

    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );
    if ($permissions['canModifyCourseSettings'] != '1'){
        throw new Exception("You don't have permission to make course changes.");
    }

    $settings = ['image', 'color', 'label', 'defaultRoleId','canAutoEnroll'];
    $segments = [];
    foreach ($settings as $setting) {
        if (array_key_exists($setting, $_POST)) {
            $sanitizedNewValue = mysqli_real_escape_string(
                $conn,
                $_POST[$setting]
            );
            array_push($segments, "$setting = '$sanitizedNewValue'");
        }
    }
    $updates = implode(',', $segments);

    $sql = "UPDATE course 
        SET
        $updates
        WHERE 
        courseId ='$courseId'
    ";

    $result = $conn->query($sql);

    if (!$result){
        throw new Exception("Update Failed");
    }

        http_response_code(202);
        $response_arr = [
            'success' => true,
        ];
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
