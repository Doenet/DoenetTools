<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$courseId =  mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
//Base level so just find the last sortOrder and increment by 100
$sql = "
SELECT a.assignmentName AS assignmentName,
a.assignmentId AS assignmentId,
a.gradeCategory AS gradeCategory,
a.totalPointsOrPercent AS totalPointsOrPercent,
ua.credit AS credit
FROM assignment AS a
LEFT JOIN user_assignment AS ua
ON a.assignmentId = ua.assignmentId AND ua.username = '$remoteuser'
WHERE a.courseId = '$courseId'
ORDER BY a.dueDate
";
$result = $conn->query($sql);

$grades_arr = array();

         
if ($result->num_rows > 0){
    while($row = $result->fetch_assoc()){ 
	array_push($grades_arr,
	array(
	"assignmentName" => $row["assignmentName"],
	"assignmentId" => $row["assignmentId"],
	"gradeCategory" => $row["gradeCategory"],
	"totalPointsOrPercent" => $row["totalPointsOrPercent"],
	"credit" => $row["credit"]
	)
	);
}
}

$sql = "
SELECT firstName,lastName,section
FROM course_enrollment
WHERE username='$remoteuser'
AND courseId='$courseId'
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$student = $row['firstName'] . " " . $row['lastName'];
$section = $row['section'];

$response_arr = array(
	"student" => $student,
	"section" => $section,
	"group" => "",
	"grades" => $grades_arr
);


 // set response code - 200 OK


 http_response_code(200);

 // make it json format
 //echo json_encode($heading_arr);
// echo json_encode($response_arr);
 echo json_encode($response_arr);

$conn->close();

?>

