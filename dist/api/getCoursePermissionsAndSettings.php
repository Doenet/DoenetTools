<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require 'defineDBAndUserAndCourseInfo.php';

$response_arr;
try {

    if ($userId == '' && $examUserId == ''){
      throw new Exception("You need to be signed in to view courses.");
    }

    $response_arr = array(
      "success"=>$success,
      "message"=>$message,
      "permissionsAndSettings"=>$permissionsAndSettings,
      );

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