<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$success = true;
$message = '';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents('php://input'), true);
$courseId = mysqli_real_escape_string($conn, $_POST['courseId']);
$roleId = mysqli_real_escape_string($conn, $_POST['roleId']);

if ($courseId == '') {
    $success = false;
    $message = 'Request Error: missing courseId';
}
if ($roleId == '') {
    $success = false;
    $message = 'Request Error: missing roleId';
}

//Check permissions
if ($success) {
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );

    if ($permissions['canManageUsers'] != '1') {
        $success = false;
        $message = 'You need permission to manage users.';
    }
}

if ($success) {
    //Set up merge data
    $mergeHeads = array_map(function ($doenetId) use ($conn) {
        return mysqli_real_escape_string($conn, $doenetId);
    }, $_POST['mergeHeads']);
    $mergeExternalId = array_map(function ($doenetId) use ($conn) {
        return mysqli_real_escape_string($conn, $doenetId);
    }, $_POST['mergeExternalId']);
    $mergeFirstName = array_map(function ($doenetId) use ($conn) {
        return mysqli_real_escape_string($conn, $doenetId);
    }, $_POST['mergeFirstName']);
    $mergeLastName = array_map(function ($doenetId) use ($conn) {
        return mysqli_real_escape_string($conn, $doenetId);
    }, $_POST['mergeLastName']);
    $mergeEmail = array_map(function ($doenetId) use ($conn) {
        return mysqli_real_escape_string($conn, $doenetId);
    }, $_POST['mergeEmail']);
    $mergeSection = array_map(function ($doenetId) use ($conn) {
        return mysqli_real_escape_string($conn, $doenetId);
    }, $_POST['mergeSection']);

    // Insert or Update records
    for ($i = 0; $i < count($mergeEmail); $i++) {
        $firstName = '';
        $lastName = '';
        $externalId = '';
        $email = '';
        $section = '';
        $new_userId = include 'randomId.php';

        if (in_array('email', $mergeHeads, false)) {
            $email = $mergeEmail[$i];
        }
        if (in_array('externalId', $mergeHeads, false)) {
            $externalId = $mergeId[$i];
        }
        if (in_array('firstName', $mergeHeads, false)) {
            $firstName = $mergeFirstName[$i];
        }
        if (in_array('lastName', $mergeHeads, false)) {
            $lastName = $mergeLastName[$i];
        }
        if (in_array('section', $mergeHeads, false)) {
            $section = $mergeSection[$i];
        }
        //TODO: Verify that this is the correct match strategy
        $email = trim($email);

        $isEmailInUserTable = false;

        //If they don't have an account in user table then make one
        $result = $conn->query(
            "SELECT userId
			FROM user
			WHERE email = '$email'"
        );

        if ($result->num_rows > 0) {
            //Acount found
            $row = $result->fetch_assoc();
            $new_userId = $row['userId'];
            $isEmailInUserTable = true;
        } elseif ($result->num_rows == 0) {
            //Create user account

            // Random screen name
            $screen_names = include 'screenNames.php';
            $randomNumber = rand(0, count($screen_names) - 1);
            $screenName = $screen_names[$randomNumber];

            // Random profile picture
            $profile_pics = include 'profilePics.php';
            $randomNumber = rand(0, count($profile_pics) - 1);
            $profilePicture = $profile_pics[$randomNumber];

            $result = $conn->query(
                "INSERT INTO user
				SET
				userId = '$userId',
				screenName = '$screenName',
				email = '$email',
				lastName = '$lastName',
				firstName = '$firstname',
				profilePicture = '$profilePicture',
				trackingConsent = '1'"
            );
        }

        //gather columns
        $update_columns = "roleId = '$roleId'";
        if ($externalId != '') {
            $update_columns = $update_columns . "externalId = '$externalId',";
        }
        if ($section != '') {
            $update_columns = $update_columns . "section = '$section',";
        }
        $update_columns = rtrim($update_columns, ', '); //REMOVE trailing comma

        //insert or update
        $result = $conn->query(
            "INSERT INTO course_user
			SET
				courseId = '$courseId',
				userId = '$new_userId',
				$update_columns
			ON DUPLICATE KEY UPDATE
				$update_columns"
        );
    }

    // Get all records for JS
    $result = $conn->query(
        "SELECT 
			u.email,
			u.firstName, 
			u.lastName,
			cu.section, 
			cu.dateEnrolled, 
			cu.externalId, 
			cu.withdrew,
		FROM 
			course_user as cu, 
			user as u
		WHERE 
			cu.userId = u.userId AND 
			cu.courseId = '$courseId'
		ORDER BY 
			firstName"
    );

    $peopleArray = [];
    if ($result->num_rows >= 1) {
        while ($row = $result->fetch_assoc()) {
            $person = [
                'firstName' => $row['firstName'],
                'lastName' => $row['lastName'],
                'email' => $row['email'],
                'dateEnrolled' => $row['dateEnrolled'],
                'externalId' => $row['externalId'],
                'section' => $row['section'],
                'withdrew' => $row['withdrew'],
            ];
            array_push($peopleArray, $person);
        }
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'peopleArray' => $peopleArray,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>

 ?> ?> ?> ?> ?> ?> ?> ?> ?>