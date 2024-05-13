<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
// TODO in the future: check permission
// make sure you use dev DB when running this test !
$_POST = json_decode(file_get_contents('php://input'),true);
$sql="UPDATE course 
SET 
    overviewEnabled=1,
    syllabusEnabled=1,
    gradeEnabled=1,
    assignmentEnabled=1
WHERE
    courseId = 'aI8sK4vmEhC5sdeSP3vNW';";
$conn->query($sql);
?>
