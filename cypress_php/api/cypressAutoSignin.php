<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include '../api/db_connection.php';

$message = "";
$success = TRUE;
$userId = $_REQUEST['userId'];
$firstName = $_REQUEST['firstName'];
$lastName = $_REQUEST['lastName'];
// $emailaddress = 'devuser@example.com';
// $userId = 'devuserid';

if ($userId == ''){
    $userId = 'cyuserid';
}

//If user not in user table insert it
$sql = "
SELECT userId
FROM user
WHERE 
userId='$userId'";
$result = $conn->query($sql); 

if ($result->num_rows == 0) {
if($firstName == '') {
    $firstName = 'first';
}
if($lastName == '') {
    $lastName = "last";
}
$sql = "
INSERT INTO user
SET userId='$userId',
screenName='screen name',
email='$userId@doenet.org',
lastName='$firstName',
firstName='$lastName'
";
$result = $conn->query($sql); 

$sql = "
INSERT INTO user_device
SET userId='$userId',
email='$userId@doenet.org',
signInCode='123456',
timestampOfSignInCode=NOW(),
deviceName='cypress',
signedIn='1'
";

$result = $conn->query($sql); 
}

use \Firebase\JWT\JWT;
// require_once "/var/www/html/vendor/autoload.php";
require_once "../api/vendor/autoload.php";
$key = $ini_array['key'];

$expirationTime = 2147483647;

$payload = [
    // "email" => $emailaddress,
    'userId' => $userId,
    'deviceName' => $deviceName,
    // "expires" => $expirationTime
];
$jwt = JWT::encode($payload, $key);

// $sql = "UPDATE user_device
// SET signedIn = '1'
// WHERE userId='$userId' AND deviceName='$deviceName'";
// $result = $conn->query($sql);

$value = $jwt;

$path = '/';
//$domain = $ini_array['dbhost'];
$domain = 'localhost';
$isSecure = false;
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

// setcookie("JWT", $value, array("expires"=>$expirationTime, "path"=>$path, "domain"=>$domain, "secure"=>$isSecure, "httponly"=>$isHttpOnly, "samesite"=>"strict"));
// setcookie("JWT_JS", 1, array("expires"=>$expirationTime, "path"=>$path, "domain"=>$domain, "secure"=>$isSecure, "httponly"=>false, "samesite"=>"strict"));

$response_arr = array(
  "message" => $message,
  "success" => $success
  );

http_response_code(200);

echo json_encode($response_arr);

 $conn->close();
?>