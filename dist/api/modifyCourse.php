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

if (array_key_exists('courseId', $_POST)) {
    $courseId = mysqli_real_escape_string($conn, $_POST['courseId']);

    $permissons = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );
    $allowed = $permissons['canModifyCourseSettings'] == '1';

    if (array_key_exists('defaultRole', $_POST)) {
        $allowed = $allowed && $permissons['canManageUsers'];
    }

    if ($allowed) {
        $settings = ['image', 'color', 'label', 'defaultRoleId'];
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

        if ($result == true) {
            http_response_code(202);
        } else {
            http_response_code(500);
        }
    } else {
        http_response_code(403); //User if forbidden from operation
    }
} else {
    http_response_code(400); //post missing data
}

$conn->close();

?>
