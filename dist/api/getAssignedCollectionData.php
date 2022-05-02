<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

if (array_key_exists('doenetId', $_REQUEST)) {
    $doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);

    $sql = "SELECT cid, assignedVariant
    FROM user_assignment_attempt
    WHERE userId ='$userId'
    AND doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows < 1) {
        echo json_encode(['isAssigned' => false]);
    } else {
        $row = $result->fetch_assoc();
        $cid = $row['cid'];
        $assignedVariant = $row['assignedVariant'];
        echo json_encode([
            'isAssigned' => true,
            'cid' => $cid,
            'assignedVariant' => $assignedVariant,
        ]);
    }
    http_response_code(200);
} else {
    http_response_code(400);
}

$conn->close();
?>
