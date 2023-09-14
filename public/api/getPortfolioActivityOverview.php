<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

$response_arr;
$contributors = [];
try {

    //Is this the portfolio owner?
    $sql = "
    SELECT c.portfolioCourseForUserId
    FROM course_content AS cc
    LEFT JOIN course AS c
    ON c.courseId = cc.courseId
    WHERE doenetId = '$doenetId'
    ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($row['portfolioCourseForUserId'] != $userId){
            throw new Exception("You need to be the owner to view this overview.");
        }
    }

    $sql = "
    SELECT label,
    courseId,
    isDeleted,
    isBanned,
    isPublic,
    CAST(jsonDefinition as CHAR) AS json,
    imagePath
    FROM course_content
    WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        $label = $row['label'];
        $courseId = $row['courseId'];
        $isDeleted = $row['isDeleted'];
        $isBanned = $row['isBanned'];
        $isPublic = $row['isPublic'];
        $json = json_decode($row["json"], true);
        $imagePath = $row['imagePath'];

    }else{
        throw new Exception("Activity not found.");
    }

   

    $response_arr = [
        'success' => true,
        'label' => $label,
        'courseId' => $courseId,
        'isDeleted' => $isDeleted,
        'isBanned' => $isBanned,
        'isPublic' => $isPublic,
        'json' => $json,
        'imagePath' => $imagePath,
    ];
    // set response code - 200 OK
    http_response_code(200);

} catch (Exception $e) {
    $response_arr = [
        'success' => false,
        'message' => $e->getMessage(),
    ];
    http_response_code(400);

} finally {
    // make it json format
    echo json_encode($response_arr);
    $conn->close();
}

?>
