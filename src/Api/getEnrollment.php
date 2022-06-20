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

$allowed = false;

if (array_key_exists('courseId', $_REQUEST)) {
    $courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);

    //check user has permission to view users
    $permissons = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );
    $allowed = $permissons['canViewUsers']; //TODO Emilio deal with undefined (for a 401?)
}

$enrollmentArray = [];

if ($allowed) {
    $sql = "SELECT cu.userId,
		u.firstName,
		u.lastName,
		u.email,
		cu.externalId,
		cu.dateEnrolled,
		cu.section,
		cu.withdrew
		FROM course_user AS cu, user AS u
		WHERE cu.userId = u.userId
        AND cu.courseId = '$courseId'
		ORDER BY firstName
		";
    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $learner = [
            'userId' => $row['userId'],
            'firstName' => $row['firstName'],
            'lastName' => $row['lastName'],
            'email' => $row['email'],
            'externalId' => $row['externalId'],
            'dateEnrolled' => $row['dateEnrolled'],
            'section' => $row['section'],
            'withdrew' => $row['withdrew'],
        ];
        array_push($enrollmentArray, $learner);
    }
}

$response_arr = [
    'success' => $allowed,
    'enrollmentArray' => $enrollmentArray,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
