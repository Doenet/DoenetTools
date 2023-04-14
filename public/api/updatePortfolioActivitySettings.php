<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'lexicographicalRankingSort.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = '';

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents('php://input'), true);

if (!array_key_exists('doenetId', $_POST)) {
    $success = false;
    $message = 'Missing doenetId';
} elseif (!array_key_exists('label', $_POST)) {
    $success = false;
    $message = 'Missing label';
} elseif (!array_key_exists('imagePath', $_POST)) {
    $success = false;
    $message = 'Missing imagePath';
} 


$portfolioCourseId = '';

$doenetId = mysqli_real_escape_string($conn, $_POST['doenetId']);
$label = mysqli_real_escape_string($conn, $_POST['label']);
$imagePath = mysqli_real_escape_string($conn, $_POST['imagePath']);
$public = mysqli_real_escape_string($conn, $_POST['public']);


$isPublic = '0';
if ($public) {
    $isPublic = '1';
}


$sql = "
SELECT courseId,
isPublic,
userCanViewSource
FROM course_content
WHERE doenetId = '$doenetId'
";
$result = $conn->query($sql);

$dbIsPublic = "";
$dbIsUserCanViewSource = "";

//Test if the user has permission to update
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $portfolioCourseId = $row['courseId'];
    $dbIsPublic = $row['isPublic'];
    $dbUserCanViewSource = $row['userCanViewSource'];
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $portfolioCourseId
    );
    if ($permissions['canEditContent'] != '1') {
        $success = false;
        $message = 'You need permission to edit content.';
    }
} else {
    $success = false;
    $message = "Error: doenetId doesn't match.";
}

if ($success) {

    if($dbIsPublic != $isPublic) {
        
        $userCanViewSource = 1;
        if (!$isPublic) {
                //if we are moving back to private don't change userCanViewSource
                   $userCanViewSource = $dbUserCanViewSource;
            }

            //Changing from public to private or vice versa
            $sql = "
            UPDATE course_content
            SET isPublic = '$isPublic',
            userCanViewSource = '$userCanViewSource',
            addToPrivatePortfolioDate = CONVERT_TZ(NOW(), @@session.time_zone, '+00:00')
            WHERE doenetId = '$doenetId'
            ";
            $conn->query($sql);
    }

    $sql = "
        UPDATE course_content
        SET label = '$label', 
        imagePath = '$imagePath',
        isPublic = '$isPublic'
        WHERE doenetId = '$doenetId'
        AND courseId = '$portfolioCourseId'
        ";
    $conn->query($sql);
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'portfolioCourseId' => $portfolioCourseId,
];



// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
