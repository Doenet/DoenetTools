<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

//ONLY TESTING IF THE SECURE SIGNED IN (JWT) COOKIE EXISTS
$signedIn = isset($_COOKIE["JWT"]);

$response_arr = ['signedIn' => $signedIn];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);