<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

if (!isset($_REQUEST["assignmentId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No assignmentId specified!";
} else if (!isset($_REQUEST["username"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No username specified!";
} else if (!isset($_REQUEST["attemptNumber"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No attemptNumber specified!";
} else {
    $assignmentId = mysqli_real_escape_string($conn, $_REQUEST["assignmentId"]);
    $attemptNumber = mysqli_real_escape_string($conn, $_REQUEST["attemptNumber"]);
    $username = mysqli_real_escape_string($conn, $_REQUEST["username"]);

    $sql = "
        SELECT uaa.latestDocumentState
        FROM user_assignment_attempt AS uaa
        WHERE (uaa.assignmentId = '$assignmentId' AND uaa.attemptNumber = '$attemptNumber' AND uaa.username = '$username')
    ";

    $result = $conn->query($sql); 
    $response_arr = array();


    if ($result->num_rows == 1){
        $row = $result->fetch_assoc();
        array_push($response_arr,
            $row['latestDocumentState']
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($response_arr);
        
    } else if ($result->num_rows == 0) {
        http_response_code(404);
        echo "Database Retrieval Error: No attempt with the assignmentId: '$assignmentId', username: '$username', and attemptNumber: '$attemptNumber'!";
    } else {
        http_response_code(500);
        echo "Database Retrieval Error: Too Many Attempts Returned!";
    }

    
}

$conn->close();
?>
