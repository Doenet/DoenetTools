<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

$secureCookieExists = false;
if ($_COOKIE["JWT"] != NULL){
    $secureCookieExists = true;
}
$unsecureCookieExists = false;
if ($_COOKIE["JWT_JS"] != NULL){
    $unsecureCookieExists = true;
}

$response_arr = ['secureCookieExists' => $secureCookieExists,
'unsecureCookieExists' => $unsecureCookieExists,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);