<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$_POST = json_decode(file_get_contents("php://input"),true);
$contentIds = array();

foreach ($_POST["contentIds"] as $post_contentId) {
    $contentId = mysqli_real_escape_string($conn,$post_contentId);
    array_push($contentIds, $contentId);
}
$contentIdsCSV = '"'.implode('","', $contentIds) . '"';
$sql = "SELECT DISTINCT doenetML, contentId
           FROM content 
          WHERE contentId IN ($contentIdsCSV)";

$result = $conn->query($sql);

$doenetMLs = array();
$retrievedContentIds = array();
while($row = $result->fetch_assoc()){
array_push($doenetMLs,$row['doenetML']);
array_push($retrievedContentIds,$row['contentId']);
}

$response_arr = array(
"doenetMLs" => $doenetMLs,
"retrievedContentIds" => $retrievedContentIds,
);

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
?>
