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

if (!isset($_GET["doenetId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No assignment specified!";
} else {
    $doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);

    $sql = "
    SELECT du.role AS role
    FROM drive_user AS du
    LEFT JOIN drive_content AS dc
    ON dc.driveId = du.driveId
    WHERE dc.doenetId = '$doenetId'
    and du.userId = '$userId'
    ";

    $result = $conn->query($sql);  
    $row = $result->fetch_assoc();
    $role = $row['role'];
    // echo($doenetId);
    // check to make sure assignment exists
    $sql = "
        SELECT doenetId
        FROM assignment
        WHERE assignment.doenetId = '$doenetId'
    ";

    $result = $conn->query($sql);
    if ($result->num_rows == 1) {
        // do the actual query

        if ($role == 'Student'){
            $sql = "
            SELECT 
            ua.userId as userId,
            ua.credit as assignmentCredit,
            uaa.attemptNumber as attemptNumber,
            uaa.credit as attemptCredit,
            uaa.creditOverride as creditOverride
            FROM user_assignment_attempt AS uaa
            RIGHT JOIN user_assignment AS ua
            ON ua.doenetId = uaa.doenetId 
            AND ua.userId = uaa.userId
            WHERE uaa.doenetId = '$doenetId'
            AND uaa.userId = '$userId'
            ";
        }else{
            $sql = "
            SELECT 
            ua.userId as userId,
            ua.credit as assignmentCredit,
            uaa.attemptNumber as attemptNumber,
            uaa.credit as attemptCredit,
            uaa.creditOverride as creditOverride
            FROM user_assignment_attempt AS uaa
            RIGHT JOIN user_assignment AS ua
            ON ua.doenetId = uaa.doenetId 
            AND ua.userId = uaa.userId
            WHERE uaa.doenetId = '$doenetId'
            ";
        }

        
    
        $result = $conn->query($sql);
        $response_arr = array();

        while ($row = $result->fetch_assoc()) {
            array_push($response_arr,
                array(
                    $row['userId'],
                    $row['attemptNumber'],
                    $row['assignmentCredit'],
                    $row['attemptCredit'],
                    $row['creditOverride'],
                )
            );
        }
    
        // set response code - 200 OK
        http_response_code(200);
    
        // make it json format
        echo json_encode($response_arr);
    } else {
        http_response_code(404);
        echo "Database Retrieval Error: No such assignment: '$doenetId', or doenetId exists more than once.";
    }

    
}

$conn->close();
?>
