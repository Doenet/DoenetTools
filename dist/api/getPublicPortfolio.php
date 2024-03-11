<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$success = true;
$message = '';



$courseId = mysqli_real_escape_string($conn, $_REQUEST['courseId']);


$response_arr;
$publicActivities = [];
$fullName = '';
$courseLabel = '';
$courseImage = '';
$courseColor = '';
try {

    //Get all the public activites in a course
    //And if it's a user's portfolio 
    $sql = "
    SELECT 
    cc.doenetId,
    cc.imagePath,
    cc.label,
    cc.courseId,
    c.portfolioCourseForUserId,
    c.label as courseLabel,
    c.image as courseImage,
    c.color as courseColor
    FROM course_content AS cc
    LEFT JOIN course AS c
        ON c.courseId = cc.courseId
    WHERE cc.courseId = '$courseId'
    AND cc.isPublic = '1'
    AND cc.isDeleted = '0'
    AND cc.isBanned = '0'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($publicActivities, [
                'doenetId' => $row['doenetId'],
                'imagePath' => is_null($row['imagePath']) ? "/activity_default.jpg" : $row['imagePath'],
                'label' => $row['label'],
            ]);
            $isUserPortfolio = is_null($row["portfolioCourseForUserId"]) ? "0" : "1";
            $courseLabel = $row['courseLabel'];
            $courseImage = $row['courseImage'];
            $courseColor = $row['courseColor'];
        }
    }

    if ($isUserPortfolio == "1"){
        $sql = "
        SELECT u.firstName,
        u.lastName
        FROM user AS u
        LEFT JOIN course AS c
        ON u.userId = c.portfolioCourseForUserId
        WHERE c.courseId = '$courseId'
        ";
        $result = $conn->query($sql);
    
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $fullName = $row['firstName'] . ' ' . $row['lastName'];
        }else{
            throw new Exception("Error retrieving User's Information.");
        }
    }


    $response_arr = [
        'success' => true,
        'publicActivities' => $publicActivities,
        'fullName' => $fullName,
        'isUserPortfolio' => $isUserPortfolio,
        'courseLabel' => $courseLabel,
        'courseImage' => $courseImage,
        'courseColor' => $courseColor,
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
