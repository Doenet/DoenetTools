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

if (!isset($_REQUEST["doenetId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No doenetId specified!";
} else if (!isset($_REQUEST["userId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No userId specified!";
} else if (!isset($_REQUEST["attemptNumber"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No attemptNumber specified!";
} else {


    $doenetId = mysqli_real_escape_string($conn, $_REQUEST["doenetId"]);
    $attemptNumber = mysqli_real_escape_string($conn, $_REQUEST["attemptNumber"]);
    $userId = mysqli_real_escape_string($conn, $_REQUEST["userId"]);
    $attemptTaken = false;

    $sql = "SELECT *
    FROM user_assignment_attempt AS uaa
    WHERE uaa.userId = '$userId'
    AND uaa.doenetId = '$doenetId'
    AND uaa.attemptNumber = '$attemptNumber'
    ";

    $result = $conn->query($sql);

    if ($result->num_rows > 0){
        $attemptTaken = true;
    }



    $sql = "
	SELECT 
	ua.credit as assignmentCredit,
	ua.creditOverride as assignmentCreditOverride,
	uaa.credit as attemptCredit,
	uaa.creditOverride AS attemptCreditOverride,
    uaa.cid as cid,
    ci.stateVariables AS stateVariables,
    ci.variant AS variant,
    ci.timestamp AS timestamp,
    ci.interactionSource AS interactionSource
    FROM content_interactions AS ci
    JOIN user_assignment AS ua
    ON ua.doenetId = '$doenetId'
    AND ua.userId = '$userId'
    JOIN user_assignment_attempt AS uaa
    ON uaa.attemptNumber = '$attemptNumber'
    AND uaa.doenetId = '$doenetId'
    AND uaa.userId = '$userId'
    WHERE ci.attemptNumber = '$attemptNumber'
    AND ci.doenetId = '$doenetId'
    AND ci.userId = '$userId'
    ";

    $result = $conn->query($sql); 
    $response_arr = array();
    
    if ($result->num_rows == 1){
        $row = $result->fetch_assoc();
        $response_arr = array(
            "assignmentAttempted" => $attemptTaken,
            "stateVariables"=>$row['stateVariables'],
            "variant"=>$row['variant'],
            "interactionSource"=>$row['interactionSource'],
            "assignmentCredit"=>$row['assignmentCredit'],
            "assignmentCreditOverride"=>$row['assignmentCreditOverride'],
            "attemptCredit"=>$row['attemptCredit'],
            "attemptCreditOverride"=>$row['attemptCreditOverride'],
            "timestamp"=>$row['timestamp'],
            "cid"=>$row['cid'],
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($response_arr);
        
    } 
    // else if ($result->num_rows == 0) {

    //     $sql = "SELECT
    //     c.doenetML,
    //     ua.creditOverride
    //     FROM user_assignment AS ua
    //     LEFT JOIN assignment AS a
    //     ON a.assignmentId = '$assignmentId'
    //     LEFT JOIN content AS c
    //     ON a.cid = c.cid
    //     WHERE ua.userId = '$userId'
    //     AND ua.assignmentId = '$assignmentId'; 
    //     ";

    //     $result = $conn->query($sql); 
    //     if($result->num_rows == 0){
    //         echo "no rows";
    //     }
    //     else{
    //         $row = $result->fetch_assoc();

    //         $response_arr = array(
    //             "assignmentAttempted" => $attemptTaken,
    //             "doenetML"=>$row['doenetML'],
    //             "stateVariables"=> array(),
    //             "variant"=>array(),
    //             "assignmentCredit"=>0,
    //             "assignmentCreditOverride"=>$row['assignmentCreditOverride'],
    //             "attemptCredit"=>0,
    //             "attemptCreditOverride"=>0,
    //             "timestamp"=> NULL, 

    //         );

    //         // set response code - 200 OK
    //         http_response_code(200);

    //         // make it json format
    //         echo json_encode($response_arr);
    //     }
        
    // } 
    else {
        http_response_code(500);
        echo "Database Retrieval Error: 0 or too Many Attempts Returned!";
    }

    
}

$conn->close();
?>
