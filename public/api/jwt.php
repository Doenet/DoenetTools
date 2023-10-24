<?php
include 'db_connection.php';
include "baseModel.php";

use \Firebase\JWT\JWT;
// require_once "/var/www/html/vendor/autoload.php";
require_once "vendor/autoload.php";
$key = $ini_array['key'];

$emailaddress = mysqli_real_escape_string($conn, $_REQUEST['emailaddress']);
$nineCode = mysqli_real_escape_string($conn, $_REQUEST['nineCode']);
$deviceName = mysqli_real_escape_string($conn, $_REQUEST['deviceName']);
$newAccount = mysqli_real_escape_string($conn, $_REQUEST['newAccount']);
$stay = mysqli_real_escape_string($conn, $_REQUEST['stay']);

$response_arr;
try {
    Base_Model::checkForRequiredInputs($_REQUEST,["emailaddress","nineCode","deviceName","newAccount","stay"]);
    //Check if expired
    $sql = "SELECT TIMESTAMPDIFF(MINUTE, timestampOfSignInCode, NOW()) AS minutes 
    FROM user_device 
    WHERE email='$emailaddress' AND deviceName='$deviceName'
    ORDER BY timestampOfSignInCode DESC
    LIMIT 1
    ";

    $row = Base_Model::runQuery($conn,$sql)->fetch_assoc();

    //Check if it took longer than 10 minutes to enter the code
    if ($row['minutes'] > 10) {
        throw new Exception("Code expired.");
    } 
    $sql = "SELECT signInCode AS nineCode,userId
    FROM user_device 
    WHERE email='$emailaddress' AND deviceName='$deviceName'
    ORDER BY timestampOfSignInCode DESC
    LIMIT 1";
    $row = Base_Model::runQuery($conn,$sql)->fetch_assoc();
    $userId = $row['userId'];
    if ($row['nineCode'] != $nineCode) {
        throw new Exception("Invalid Code.");
    } 
    //Valid code and not expired
    http_response_code(200);

    $expirationTime = 0;
    if ($stay == 1) {
        $expirationTime = 2147483647;
    }

    $payload = [
        // "email" => $emailaddress,
        'userId' => $userId,
        'deviceName' => $deviceName,
        // "expires" => $expirationTime
    ];
    $jwt = JWT::encode($payload, $key);

    $sql = "UPDATE user_device
    SET signedIn = '1'
    WHERE userId='$userId' AND deviceName='$deviceName'";
    Base_Model::runQuery($conn,$sql);

    $value = $jwt;

    $path = '/';
    //$domain = $ini_array['dbhost'];
    $domain = $_SERVER["SERVER_NAME"];
    if ($domain == 'apache'){$domain = 'localhost';}
    $isSecure = true;
    if ($domain == 'apache') {
        $domain = 'localhost';
    }
    if ($domain == 'localhost') {
        $isSecure = false;
    }
    $isHttpOnly = true;
    setcookie(
        'JWT',
        $value,
        $expirationTime,
        $path,
        $domain,
        $isSecure,
        $isHttpOnly
    );
    setcookie(
        'JWT_JS',
        1,
        $expirationTime,
        $path,
        $domain,
        $isSecure,
        false
    );

    $response_arr = [
        'success' => true,
    ];

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
