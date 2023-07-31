<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include '../api/db_connection.php';

$_POST = json_decode(file_get_contents('php://input'), true);

$message = "";
$success = TRUE;
$courseId = $_POST['courseId'];
$userId = $_POST['userId'];
$studentUserId = $_POST['studentUserId'];
$label = $_POST['label'];
// $emailaddress = 'devuser@example.com';
// $userId = 'devuserid';

if ($userId == ''){
    $userId = 'cyuserid';
}
if ($studentUserId == ''){
  $studentUserId = 'cyStudentUserId';
}
if ($label == ''){
  $label = 'Cypress Generated';
}

$studentRoleId = $courseId . "SId";
$ownerRoleId = $courseId . "OId";

$sql = "
INSERT INTO course
SET courseId='$courseId',
label='$label',
image='picture1.jpg',
defaultRoleId = '$studentRoleId'
";
$result = $conn->query($sql); 

$result = $conn->query(
  //Owner
  "INSERT INTO course_role
  SET
  courseId = '$courseId',
  roleId = '$ownerRoleId',
  label = 'Owner',
  canViewContentSource = '1',
  canEditContent = '1',
  canPublishContent = '1',
  canViewUnassignedContent = '1',
  canProctor = '1',
  canViewAndModifyGrades = '1',
  canViewActivitySettings = '1',
  canModifyActivitySettings = '1',
  canModifyCourseSettings = '1',
  dataAccessPermission = 'Identified',
  canViewUsers = '1',
  canManageUsers = '1',
  isAdmin = '1',
  isOwner = '1'"
);

$result = $conn->query(
  //Student
  "INSERT INTO course_role
  SET
  courseId= '$courseId', 
  roleId= '$studentRoleId', 
  label= 'Student', 
  isIncludedInGradebook = '1'"
);

$sql = "
SELECT userId
FROM course_user
WHERE userId = '$userId'
AND courseId = '$courseId'
";
$result = $conn->query($sql); 

//Don't create another if it already exists 
if ($result->num_rows == 0) {

    $sql = "
    INSERT INTO course_user
    (userId,courseId,roleId)
    VALUES
    ('$userId','$courseId','$ownerRoleId')
    ";

    $result = $conn->query($sql); 
}

$sql = "
SELECT userId
FROM course_user
WHERE userId = '$studentUserId'
AND courseId = '$courseId'
";
$result = $conn->query($sql); 

//Don't create another if it already exists 
if ($result->num_rows == 0) {

    $sql = "
    INSERT INTO course_user
    (userId,courseId,roleId)
    VALUES
    ('$studentUserId','$courseId','$studentRoleId')
    ";

    $result = $conn->query($sql); 
}


$response_arr = array(
  "message" => $message,
  "success" => $success
  );

http_response_code(200);
echo json_encode($response_arr);

 $conn->close();
?>