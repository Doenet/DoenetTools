<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];
$device = $jwtArray['deviceName'];

$contentId = mysqli_real_escape_string($conn,$_REQUEST["contentId"]);

// contentId='$contentId',

$sql = "SELECT stateVariables
        FROM content_interactions
        WHERE userId='$userId'
        AND contentId='$contentId'
        ORDER BY timestamp DESC, id DESC";

$result = $conn->query($sql);
// $stateVariables = array();
// while ($row = $result->fetch_assoc()){
//         array_push($stateVariables,$row["stateVariables"]);
// }
$row = $result->fetch_assoc();
$stateVariables = $row["stateVariables"];

$response_arr = array(
        "success" => 0,
        "stateVariables" => $stateVariables,
        );

http_response_code(200);

echo json_encode($response_arr);

$conn->close();

?>

