<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

//TODO: Check if the user is the instructor in the course

if (!isset($_REQUEST["driveId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No course specified!";
} else {
    $driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);


        $sql = "
            SELECT a.doenetId, ua.credit, ua.userId
            FROM assignment AS a
            JOIN user_assignment AS ua
            ON a.doenetId = ua.doenetId
            WHERE a.driveId = '$driveId'
            ORDER BY a.dueDate

        ";
        // echo $sql;

        $result = $conn->query($sql); 
        $response_arr = array();

        while ($row = $result->fetch_assoc()) {
            array_push($response_arr,
                array(
                    $row['doenetId'],
                    $row['credit'],
                    $row['userId']
                )
            );
        }

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($response_arr);
    } 
$conn->close();
?>
           
