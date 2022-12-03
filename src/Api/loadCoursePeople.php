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

$success = true;

if (!array_key_exists('courseId', $_REQUEST)) {
    $success = false;
    $message = 'Request error, missing courseId';
}

//Check permissions
if ($success) {
    $courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);

    //check user has permission to view users
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );

    if ($permissions['canViewUsers'] != '1') {
        $success = false;
    }
}

$peopleArray = [];

if ($success) {
    $sql = "SELECT
		u.firstName,
		u.lastName,
        u.screenName,
		u.email,
		cu.externalId,
        cu.roleId,
		cu.dateEnrolled,
		cu.section,
		cu.withdrew
		FROM course_user AS cu, user AS u
		WHERE cu.userId = u.userId 
        AND cu.courseId = '$courseId'
		ORDER BY lastName
		";
    $result = $conn->query($sql);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $learner = [
                'firstName' => $row['firstName'],
                'lastName' => $row['lastName'],
                'screenName' => $row['screenName'],
                'email' => $row['email'],
                'externalId' => $row['externalId'],
                'roleId' => $row['roleId'],
                'dateEnrolled' => $row['dateEnrolled'],
                'section' => $row['section'],
                'withdrew' => $row['withdrew'],
            ];
            array_push($peopleArray, $learner);
        }
    }
}

$response_arr = [
    'success' => $allowed,
    'message' => $message,
    'peopleArray' => $peopleArray,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
