<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include '../api/db_connection.php';

$message = "";
$success = TRUE;
$courseId = $_REQUEST['courseId'];
$userId = $_REQUEST['userId'];
// $emailaddress = 'devuser@example.com';
// $userId = 'devuserid';

if ($userId == ''){
    $userId = 'cyuserid';
}

$sql = "
INSERT INTO course
SET courseId='$courseId',
label='Cypress Generated',
image='picture1.jpg'
";
$result = $conn->query($sql); 

$sql = "
SELECT userId
FROM course_user
WHERE userId = '$userId'
AND courseId = '$courseId'
";
$result = $conn->query($sql); 

//Don't create another if it already exists 
if ($result->num_rows == 0) {

    $roleLabels = '["Owner"]';

    $sql = "
    INSERT INTO course_user
    (userId,courseId,canViewCourse,canViewContentSource,canEditContent,
    canPublishContent,canViewUnassignedContent,canProctor,canViewAndModifyGrades,
    canViewActivitySettings,canModifyCourseSettings,canViewUsers,canManageUsers,
    canModifyRoles,isOwner,roleLabels)
    VALUES
    ('$userId','$courseId','1','1','1','1','1','1','1','1','1','1','1','1','1','$roleLabels')
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