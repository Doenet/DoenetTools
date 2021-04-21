<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

if (!isset($_GET["courseId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No course specified!";
} else {
	$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);

	$sql = "
        SELECT ce.userId, ce.firstName, ce.lastName, ce.courseCredit, ce.courseGrade, ce.overrideCourseGrade
        FROM course_enrollment AS ce
        WHERE ce.courseId = '$courseId'
        ORDER BY ce.lastName
	";

	$result = $conn->query($sql); 
	$response_arr = array();


	if ($result->num_rows > 0){
		while ($row = $result->fetch_assoc()) {
			array_push($response_arr,
				array(
					$row['userId'],
          $row['firstName'],
					$row['lastName'],
					$row['courseCredit'],
					$row['courseGrade'],
					$row['overrideCourseGrade'],
				)
			);
        }

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($response_arr);
	} else {
        http_response_code(404);
		echo "Database Retrieval Error: No such course: '$courseId'";
	}

	
}

$conn->close();
?>
           
