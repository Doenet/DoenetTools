<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
// $jwtArray = include "jwtArray.php";

$success = true;
$message = '';
$carouselData = [[], [], [], []];

$sql = "
	SELECT section,
	position,
	imagePath,
	text,
	link
	FROM homepage_carousel
  ORDER BY section,position
	";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $section = $row['section'];

        array_push($carouselData[$section], [
            'imagePath' => $row['imagePath'],
            'text' => $row['text'],
            'link' => $row['link'],
        ]);
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'carouselData' => $carouselData,
];

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

?>
