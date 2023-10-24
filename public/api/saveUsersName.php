<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "baseModel.php";

$email = mysqli_real_escape_string($conn,$_REQUEST["email"]);
$firstName = mysqli_real_escape_string($conn,$_REQUEST["firstName"]);
$lastName = mysqli_real_escape_string($conn,$_REQUEST["lastName"]);
$response_arr;
try {
    Base_Model::checkForRequiredInputs($_REQUEST,["email","firstName","lastName"]);

    $sql = "
    UPDATE user
    SET firstName='$firstName',
    lastName='$lastName'
    WHERE email='$email'
    ";
    Base_Model::runQuery($conn,$sql);

    $response_arr = array(
        'success' => true,
    );

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