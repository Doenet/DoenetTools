<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include_once 'permissionsAndSettingsForOneCourseFunction.php';

$success = true;
$message = '';
$userData = [];

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents('php://input'), true);
$courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
$email = mysqli_real_escape_string($conn, $_POST['email']);
$roleId = mysqli_real_escape_string($conn, $_POST['roleId']);
$firstName = mysqli_real_escape_string($conn, $_POST['firstName']);
$lastName = mysqli_real_escape_string($conn, $_POST['lastName']);
$externalId = mysqli_real_escape_string($conn, $_POST['externalId']);
$section = mysqli_real_escape_string($conn, $_POST['section']);

if ($courseId == '') {
    $success = false;
    $message = 'Request Error: missing courseId';
}
if ($email == '') {
    $success = false;
    $message = 'Request Error: missing email';
}

//Check permissions
if ($success) {
    $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );

    if ($requestorPermissions['canManageUsers'] != '1') {
        $success = false;
        $message = 'Operation Denied: you need permission to manage users';
    }
}

if ($roleId == '') {
    $roleId = $userPermissions['defaultRoleId'];
}

//Attempt check for user existance and create if need
if ($success) {
    //TODO: Verify that this is the correct match strategy
    $email = trim($email);
    $result = $conn->query(
        "SELECT 
            userId,
            screenName,
            firstName,
            lastName
        FROM user
        WHERE email = '$email'
    "
    );

    //none match, so create new user
    if ($result->num_rows < 1) {
        $toEnrollUserId = include 'randomId.php';
        $toEnrollFirstName = $firstName;
        $toEnrollLastName = $lastName;

        // Random screen name
        $screen_names = include 'screenNames.php';
        $randomNumber = rand(0, count($screen_names) - 1);
        $toEnrollScreenName = $screen_names[$randomNumber];

        // Random profile picture
        $profile_pics = include 'profilePics.php';
        $randomNumber = rand(0, count($profile_pics) - 1);
        $profilePicture = $profile_pics[$randomNumber];

        $result = $conn->query(
            "INSERT INTO user
            SET 
                userId = '$toEnrollUserId',
                email = '$email',
                firstName = '$toEnrollFirstName',
                lastName = '$toEnrollLastName',
                screenName = '$toEnrollScreenName',
                profilePicture = '$profilePicture'"
        );

        if ($result == false) {
            $success = false;
            $message = 'Internal Server Error; Could not create user';
        }
    } else {
        $row = $result->fetch_assoc();

        $toEnrollUserId = $row['userId'];
        $toEnrollScreenName = $row['screenName'];
        $toEnrollFirstName = $row['firstName'];
        $toEnrollLastName = $row['lastName'];
    }
}

//attempt to add user to course
if ($success) {
    //Test if they have already been added
    $result = $conn->query(
        "SELECT roleId
        FROM course_user
        WHERE userId = '$toEnrollUserId'
        AND courseId = '$courseId'"
    );

    //Already have this user, so bail
    if ($result->num_rows > 0) {
        $success = false;
        $message = "$toEnrollScreenName ($email) is already a part of this course";
    } else {
        //Add the user
        $userData = [
            'screenName' => $toEnrollScreenName,
            'email' => $email,
            'firstName' => $toEnrollFirstName,
            'lastName' => $toEnrollLastName,
            'roleId' => $roleId,
            'section' => $section,
            'externalId' => $externalId,
            'withdrew' => '0',
        ];

        $result = $conn->query(
            "INSERT INTO course_user
            SET
            courseId = '$courseId',
            userId = '$toEnrollUserId',
            roleId = '$roleId',
            externalId = '$externalId',
            section = '$section'"
        );

        if (!$result) {
            $success = false;
            $message = 'Interal Server Error; failed to add user';
        }

        $result = $conn->query(
            "SELECT dateEnrolled FROM course_user WHERE userId='$toEnrollUserId'"
        );

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $userData += ['dateEnrolled' => $row['dateEnrolled']];
        }
    }
}

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode([
    'success' => $success,
    'message' => $message,
    'userData' => $userData,
]);
$conn->close();
?>
