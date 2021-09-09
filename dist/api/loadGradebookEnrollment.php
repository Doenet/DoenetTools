<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

if (!isset($_GET["driveId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No course specified!";
} else {
	$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);

	//TODO: Need a permission related to see grades (not du.canEditContent)
  $sql = "
  SELECT du.canEditContent 
  FROM drive_user AS du
  WHERE du.userId = '$userId'
  AND du.driveId = '$driveId'
  AND du.canEditContent = '1'
  ";
	$have_permission = FALSE; 
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
		$have_permission = TRUE; 
	}

	if ($have_permission){
	$sql = "
		SELECT du.userId, e.firstName, e.lastName, e.courseCredit, e.courseGrade, e.overrideCourseGrade, du.role
		FROM drive_user AS du
		LEFT JOIN enrollment AS e
		ON du.userId = e.userId
		WHERE du.driveId = '$driveId'
		ORDER BY e.lastName
	";
}else{
	$sql = "
		SELECT du.userId, e.firstName, e.lastName, e.courseCredit, e.courseGrade, e.overrideCourseGrade, du.role
		FROM drive_user AS du
		LEFT JOIN enrollment AS e
		ON du.userId = e.userId
		WHERE du.driveId = '$driveId'
		AND du.userId = '$userId'
		ORDER BY e.lastName
	";
}

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
					$row['role'],
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
           
