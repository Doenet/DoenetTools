<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

if (!isset($_GET["courseId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No course specified!";
} else {
    $courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);

    $sql = "
    SELECT a.assignmentId AS assignmentId, 
    a.title AS title,
    a.totalPointsOrPercent AS totalPointsOrPercent,
    ua.credit AS credit,
    ua.creditOverride AS creditOverride
    FROM assignment AS a
    LEFT JOIN user_assignment as ua
    ON ua.assignmentId = a.assignmentId
    WHERE a.courseId = '$courseId'
    AND ua.userId= '$userId'
    ORDER BY a.dueDate
    ";

    $result = $conn->query($sql); 
    $response_arr = array();


    if ($result->num_rows > 0){
        while ($row = $result->fetch_assoc()) {
            array_push($response_arr,
                array(
                    "assignmentId"=>$row['assignmentId'],
                    "title"=>$row['title'],
                    "totalPointsOrPercent"=>$row['totalPointsOrPercent'],
                    "credit"=>$row['credit'],
                    "creditOverride"=>$row['creditOverride']
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
