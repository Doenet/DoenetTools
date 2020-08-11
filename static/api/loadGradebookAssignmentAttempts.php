<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

//TODO: Check if $userId is an Instructor who has access

if (!isset($_GET["assignmentId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No assignment specified!";
} else {
    $assignmentId = mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);

    // check to make sure assignment exists
    $sql = "
        SELECT assignmentId
        FROM assignment
        WHERE assignment.assignmentId = '$assignmentId'
    ";

    $result = $conn->query($sql);
    if ($result->num_rows == 1) {
        // do the actual query
        $sql = "
        SELECT 
		ua.userId as userId,
		ua.credit as assignmentCredit,
		ua.creditOverride as assignmentCreditOverride,
		uaa.attemptNumber as attemptNumber,
		uaa.credit as attemptCredit,
		uaa.creditOverride AS attemptCreditOverride
        FROM user_assignment_attempt AS uaa
        LEFT JOIN user_assignment AS ua
        ON ua.assignmentId = uaa.assignmentId 
        AND ua.userId = uaa.userId
        WHERE uaa.assignmentId = '$assignmentId'
        ORDER BY uaa.attemptNumber
        ";
    
        $result = $conn->query($sql);
        $response_arr = array();

        while ($row = $result->fetch_assoc()) {
            array_push($response_arr,
                array(
                    $row['userId'],
                    $row['attemptNumber'],
                    $row['assignmentCredit'],
                    $row['assignmentCreditOverride'],
                    $row['attemptCredit'],
                    $row['attemptCreditOverride']
                )
            );
        }
    
        // set response code - 200 OK
        http_response_code(200);
    
        // make it json format
        echo json_encode($response_arr);
    } else {
        http_response_code(404);
        echo "Database Retrieval Error: No such assignment: '$assignmentId', or assignmentId exists more than once.";
    }

    
}

$conn->close();
?>
