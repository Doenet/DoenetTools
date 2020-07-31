<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: access");
// header("Access-Control-Allow-Methods: GET");
// header("Access-Control-Allow-Credentials: true");
// header('Content-Type: application/json');

include "db_connection.php";

use \Firebase\JWT\JWT;
require_once "/var/www/html/vendor/autoload.php";
$key = $ini_array['key'];

$emailaddress =  mysqli_real_escape_string($conn,$_REQUEST["emailaddress"]);  
$nineCode =  mysqli_real_escape_string($conn,$_REQUEST["nineCode"]);  
$deviceName =  mysqli_real_escape_string($conn,$_REQUEST["deviceName"]);  
$newAccount =  mysqli_real_escape_string($conn,$_REQUEST["newAccount"]);  
$stay =  mysqli_real_escape_string($conn,$_REQUEST["stay"]);  


//Check if expired
$sql = "SELECT TIMESTAMPDIFF(MINUTE, timestampOfSignInCode, NOW()) AS minutes 
FROM user_device 
WHERE email='$emailaddress' AND deviceName='$deviceName'";

$result = $conn->query($sql);
$row = $result->fetch_assoc();


//Check if it took longer than 10 minutes to enter the code
if ($row['minutes'] > 10){
    echo "Code expired";
}else{
    $sql = "SELECT signInCode AS nineCode, userId
    FROM user_device 
    WHERE email='$emailaddress' AND deviceName='$deviceName'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $userId = $row["userId"];
    if ($row["nineCode"]!= $nineCode){
        echo "Invalid Code";
    }else{
        //Valid code and not expired
        http_response_code(200);

        $payload = array(
            // "email" => $emailaddress,
            "userId" => $userId,
            "deviceName" => $deviceName,
        );
        $jwt = JWT::encode($payload, $key);

        $sql = "UPDATE user_device 
        SET signedIn = '1'
        WHERE userId='$userId' AND deviceName='$deviceName'";
        $result = $conn->query($sql);


        $value = $jwt;
        $expirationTime = 0;    
        if ($stay == 1){
            $expirationTime = 2147483647;    
        }
        $path = '/';
        $domain = $ini_array['dbhost']; 
        $isSecure = true;  
        if ($domain=="127.0.0.1"){
          $domain = 'localhost'; 
        $isSecure = false;  
        }
        $isHttpOnly = true;
        setcookie("JWT", $value, $expirationTime, $path, $domain, $isSecure, $isHttpOnly);
        setcookie("JWT_JS", 1, $expirationTime, $path, $domain, $isSecure, 0);
        if ($newAccount == 1){
            header("Location: /accountsettings");
        }else{
            header("Location: /dashboard");

        }
    }

}
    


$conn->close();

