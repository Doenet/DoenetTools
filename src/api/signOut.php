<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$device = $jwtArray['deviceName'];
$userId = $jwtArray['userId'];

$sql = "UPDATE user_device
        SET signedIn='0'
        WHERE userId='$userId' AND deviceName = '$device'";
$result = $conn->query($sql); //TODO: upgrade the script response

// set response code - 200 OK
http_response_code(200);

$path = '/';
// $domain = $ini_array['dbhost'];
$domain = $_SERVER["SERVER_NAME"];
$isSecure = true;
if ($domain=="localhost"){
  $isSecure = false;
}
$isHttpOnly = true;
$expirationTime = time() - 3600;
setcookie("JWT", "", array("expires"=>$expirationTime, "path"=>$path, "domain"=>$domain, "secure"=>$isSecure, "httponly"=>$isHttpOnly, "samesite"=>"strict"));
setcookie("JWT_JS", "", array("expires"=>$expirationTime, "path"=>$path, "domain"=>$domain, "secure"=>$isSecure, "httponly"=>false, "samesite"=>"strict"));
setcookie("Profile", "", array("expires"=>$expirationTime, "path"=>$path, "domain"=>$domain, "secure"=>$isSecure, "httponly"=>false, "samesite"=>"strict"));
// make it json format
// echo json_encode($response_arr);

$conn->close();

