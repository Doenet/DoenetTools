<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$instructorUserId = $jwtArray['userId'];

//TODO: Check if $userId is an Instructor who has access

if (!isset($_REQUEST["assignmentId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No assignmentId specified!";
} else if (!isset($_REQUEST["userId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No userId specified!";
} else if (!isset($_REQUEST["attemptNumber"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No attemptNumber specified!";
} else {
    $assignmentId = mysqli_real_escape_string($conn, $_REQUEST["assignmentId"]);
    $attemptNumber = mysqli_real_escape_string($conn, $_REQUEST["attemptNumber"]);
    $userId = mysqli_real_escape_string($conn, $_REQUEST["userId"]);

    $sql = "
	SELECT 
	ua.credit as assignmentCredit,
	ua.creditOverride as assignmentCreditOverride,
	uaa.credit as attemptCredit,
	uaa.creditOverride AS attemptCreditOverride,
    ci.stateVariables AS stateVariables,
    ci.variant AS variant,
    ci.timestamp AS timestamp,
    c.doenetML AS doenetML
    FROM content_interactions AS ci
    LEFT JOIN content AS c
    ON c.contentId = ci.contentId
    LEFT JOIN user_assignment AS ua
    ON ua.assignmentId = '$assignmentId'
    AND ua.userId = '$userId'
    LEFT JOIN user_assignment_attempt AS uaa
    ON uaa.attemptNumber = '$attemptNumber'
    AND uaa.assignmentId = '$assignmentId'
    AND uaa.userId = '$userId'
    WHERE ci.attemptNumber = '$attemptNumber'
    AND ci.assignmentId = '$assignmentId'
    AND ci.userId = '$userId'
    ";

    $result = $conn->query($sql); 
    $response_arr = array();


    if ($result->num_rows == 1){
        $row = $result->fetch_assoc();
        $response_arr = array(
            "doenetML"=>$row['doenetML'],
            "stateVariables"=>$row['stateVariables'],
            "variant"=>$row['variant'],
            "assignmentCredit"=>$row['assignmentCredit'],
            "assignmentCreditOverride"=>$row['assignmentCreditOverride'],
            "attemptCredit"=>$row['attemptCredit'],
            "attemptCreditOverride"=>$row['attemptCreditOverride'],
            "timestamp"=>$row['timestamp'],
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($response_arr);
        
    } else if ($result->num_rows == 0) {
        http_response_code(404);
        echo "Database Retrieval Error: No attempt with the assignmentId: '$assignmentId', userId: '$userId', and attemptNumber: '$attemptNumber'!";
    } else {
        http_response_code(500);
        echo "Database Retrieval Error: Too Many Attempts Returned!";
    }

    
}

$conn->close();
?>
