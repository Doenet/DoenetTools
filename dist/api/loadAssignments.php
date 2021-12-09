<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

if (!isset($_GET["driveId"])) {
    http_response_code(400);
    echo "Database Retrieval Error: No drive specified!";
} else {
    $driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
    $sql = "
    SELECT a.doenetId, 
    dc.label, 
    a.gradeCategory,
    a.totalPointsOrPercent
    FROM assignment AS a
    LEFT JOIN drive_content as dc
    ON a.doenetId = dc.doenetId
    WHERE a.driveId = '$driveId'
    AND dc.isReleased = '1'
    AND dc.isDeleted = '0'
    ORDER BY a.dueDate
    ";

    $result = $conn->query($sql); 
    $response_arr = array();


    if ($result->num_rows > 0){
        while ($row = $result->fetch_assoc()) {

            $doenetId = $row['doenetId'];
            $arr = array(
                "label"=>$row['label'],
                "category"=>$row['gradeCategory'],
                "totalPointsOrPercent"=>$row['totalPointsOrPercent']
            );
             array_push($response_arr,
                array(
                    $doenetId,$arr
                )
            );
        }

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($response_arr);
    } else {
         // set response code - 200 OK
         http_response_code(200);

         // make it json format
         echo json_encode($response_arr);
        // http_response_code(404);
        // echo "Database Retrieval Error: No such course: '$driveId'";
    }
}

$conn->close();
?>
