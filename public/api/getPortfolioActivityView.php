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

    $sql = "
    SELECT cc.label,
    cc.courseId,
    cc.isBanned,
    CAST(cc.jsonDefinition as CHAR) AS json,
    c.portfolioCourseForUserId,
    c.label as courseLabel,
    c.image,
    c.color,
    u.firstName,
    u.lastName,
    u.profilePicture
    FROM course_content AS cc
    LEFT JOIN course AS c
        ON c.courseId = cc.courseId
    LEFT JOIN user As u
        ON u.userId = c.portfolioCourseForUserId
    WHERE cc.doenetId = '$doenetId'
    AND cc.isPublic = '1'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $isBanned = $row['isBanned'];
        if ($isBanned == '1'){
            throw new Exception("Activity has been banned.");
        }
        $label = $row['label'];
        $json = json_decode($row["json"], true);
    array_push($contributors, [
        "courseId" => $row["courseId"],
        "isUserPortfolio" => is_null($row["portfolioCourseForUserId"]) ? "0" : "1",
        "courseLabel" => $row['courseLabel'],
        "courseImage" => $row['image'],
        "courseColor" => $row['color'],
        "firstName" => $row['firstName'],
        "lastName" => $row['lastName'],
        "profilePicture" => $row['profilePicture'],
    ]);
    

    }else{
        throw new Exception("Activity not found.");
    }

    //Add contributor history
    $sql = "
    SELECT
    cch.courseId,
    cch.isUserPortfolio,
    c.label as courseLabel,
    c.image,
    c.color,
    u.firstName,
    u.lastName,
    u.profilePicture
    FROM content_contributor_history AS cch
    LEFT JOIN course AS c
        ON c.courseId = cch.courseId
    LEFT JOIN user As u
        ON u.userId = c.portfolioCourseForUserId
    WHERE cch.doenetId = '$doenetId'
    ORDER BY cch.timestamp DESC
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()){
            array_push($contributors, [
                "courseId" => $row["courseId"],
                "isUserPortfolio" => $row['isUserPortfolio'],
                "courseLabel" => $row['courseLabel'],
                "courseImage" => $row['image'],
                "courseColor" => $row['color'],
                "firstName" => $row['firstName'],
                "lastName" => $row['lastName'],
                "profilePicture" => $row['profilePicture'],
            ]);
        }
    }


    $response_arr = [
        'success' => true,
        'label' => $label,
        'contributors' => $contributors,
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
