<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";


if ($userId == ''){
  $success = FALSE;
  $message = "You need to be signed in to make a course";
}

if ($success){

// Random course picture
$course_pics = include 'coursePics.php';
$randomNumber = rand(0,(count($course_pics) - 1));
$course_pic = $course_pics[$randomNumber];

//Random courseId
$courseId = include "randomId.php";

$sql = "
INSERT INTO course
(courseId,image)
VALUES
('$courseId','$course_pic')
";

$result = $conn->query($sql); 

$sql = <<<END
INSERT INTO course_user
(userId,courseId,canViewCourse,canViewContentSource,canEditContent,
canPublishContent,canViewUnassignedContent,canProctor,canViewAndModifyGrades,
canViewActivitySettings,canModifyCourseSettings,canViewUsers,canManageUsers,
canModifyRoles,isOwner,roleLabels)
VALUES
('$userId','$courseId','1','1','1','1','1','1','1','1','1','1','1','1','1','["Owner"]')
END;

$result = $conn->query($sql); 


}


$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "courseId"=>$courseId,
  "course_pic"=>$course_pic
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>