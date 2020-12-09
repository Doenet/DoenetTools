<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');
include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$response_arr = array(
    "access"=> TRUE
);


$_POST = json_decode(file_get_contents("php://input"),true);
$courseId = mysqli_real_escape_string($conn,$_POST["courseId"]);
$branchIds = array_map(function($branchId) use($conn) {
return mysqli_real_escape_string($conn, $branchId);
}, $_POST['branchIds']);
$assignmentIds = array_map(function($branchId) use($conn) {
return mysqli_real_escape_string($conn, $branchId);
}, $_POST['assignmentIds']);
var_dump($assignmentIds);

//INSERT assignments INTO assighnment table
for ($i = 0; $i < count($branchIds); $i++){
    $branchId = $branchIds[$i];
    $assignmentId = $assignmentIds[$i];
    //gather content information
    $sql = "
    SELECT title,contentId
    FROM content
    WHERE branchId = '$branchId'
    AND draft = 0
    ORDER BY timestamp DESC
    LIMIT 1
    ";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $title = $row['title'];
    $contentId = $row['contentId'];


    $sql = "
    INSERT INTO assignment
    (assignmentId,title,sourceBranchId,contentId,courseId,creationDate)
    VALUES
    ('$assignmentId','$title','$branchId','$contentId','$courseId',NOW())
    ";
    $result = $conn->query($sql);

}

//associate assignments with enrolled students
$enrolled_students = array();
$sql = "
SELECT userId
FROM course_enrollment
WHERE courseId = '$courseId'
AND withdrew = '0'
";
$result = $conn->query($sql);
while($row = $result->fetch_assoc()){
    array_push($enrolled_students,$row['userId']);
}

foreach ($assignmentIds as $assignmentId){
    foreach ($enrolled_students as $userId){
       $sql = "
        INSERT INTO user_assignment 
        (assignmentId, userId)
        VALUES
        ('$assignmentId','$userId')
        ";
    $result = $conn->query($sql);
    }
}

//Limit of 1000 values
// $insert_values = "";
// foreach ($assignmentIds as $assignmentId){
//     foreach ($enrolled_students as $userId){
//        $insert_values = $insert_values . "('$assignmentId','$userId'),";
//     }
// }
// $insert_values = rtrim($insert_values, ",");
// $sql = "
//         INSERT INTO user_assignment 
//         (assignmentId, userId)
//         VALUES
//         $insert_values
//         ";
//         echo $sql;
//     $result = $conn->query($sql);

    // set response code - 200 OK
    http_response_code(200);

    // echo $attemptNumber;
//  echo json_encode($response_arr);

$conn->close();
?>