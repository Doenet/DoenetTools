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
    SELECT cc.label,
    cc.courseId,
    cc.isDeleted,
    cc.isBanned,
    CAST(cc.jsonDefinition as CHAR) AS json,
    c.label as courseLabel,
    c.image,
    c.color
    FROM course_content AS cc
    LEFT JOIN course AS c
        ON c.courseId = cc.courseId
    LEFT JOIN user As u
        ON u.userId = c.portfolioCourseForUserId
    WHERE cc.doenetId = '$doenetId'
    AND cc.isPublic = '1'
    ";
    $result = $conn->query($sql);

    // if ($result->num_rows > 0) {
    //     $row = $result->fetch_assoc();
    //     $isBanned = $row['isBanned'];
    //     $label = $row['label'];
    //     $json = json_decode($row["json"], true);
    // array_push($contributors, [
    //     "courseId" => $row["courseId"],
    //     "isUserPortfolio" => is_null($row["portfolioCourseForUserId"]) ? "0" : "1",
    //     "courseLabel" => $row['courseLabel'],
    //     "courseImage" => $row['image'],
    //     "courseColor" => $row['color'],
    //     "firstName" => $row['firstName'],
    //     "lastName" => $row['lastName'],
    //     "profilePicture" => $row['profilePicture'],
    // ]);
    

    // }else{
    //     throw new Exception("Activity not found.");
    // }

   

    $response_arr = [
        'success' => true,
        'label' => $label,
        'json' => $json,
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
