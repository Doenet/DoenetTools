<?php

include 'db_connection.php';

// use \Firebase\JWT\JWT;
// // require_once "/var/www/html/vendor/autoload.php";
// require_once "vendor/autoload.php";
// $key = $ini_array['key'];

// $code = mysqli_real_escape_string($conn, $_REQUEST['code']);
// $doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);
// $userId = mysqli_real_escape_string($conn, $_REQUEST['userId']);

// $sql = "
// SELECT driveId,
// isReleased
// FROM drive_content
// WHERE doenetId = '$doenetId'
// ";
// $result = $conn->query($sql);
// if ($result->num_rows > 0) {
//     $row = $result->fetch_assoc();
//     $driveId = $row['driveId'];
//     $isReleased = $row['isReleased'];
// }else{
//     //Error!
//     return;
// }

// //Valid code and not expired
// http_response_code(200);


// $expirationTime = 2147483647;

// $payload = [
//     'userId' => $userId,
//     // 'euserId' => $userId,
//     'doenetId' => $doenetId,
// ];
// $jwt = JWT::encode($payload, $key);

// $value = $jwt;

// $path = '/';
// //$domain = $ini_array['dbhost'];
// $domain = $_SERVER["SERVER_NAME"];
// if ($domain == 'apache'){$domain = 'localhost';}
// $isSecure = true;
// if ($domain == 'apache') {
//     $domain = 'localhost';
// }
// if ($domain == 'localhost') {
//     $isSecure = false;
// }
// $isHttpOnly = true;
// setcookie(
//     'EJWT',
//     $value,
//     $expirationTime,
//     $path,
//     $domain,
//     $isSecure,
//     $isHttpOnly
// );
// setcookie(
//     'EJWT_JS',
//     1,
//     $expirationTime,
//     $path,
//     $domain,
//     $isSecure,
//     false
// );
// header("Location: /#/exam?tool=assessment&doenetId=$doenetId");
// // setcookie("EJWT", $value, array("expires"=>$expirationTime, "path"=>$path, "domain"=>$domain, "secure"=>$isSecure, "httponly"=>$isHttpOnly, "samesite"=>"strict"));
// // setcookie("EJWT_JS", 1, array("expires"=>$expirationTime, "path"=>$path, "domain"=>$domain, "secure"=>$isSecure, "httponly"=>false, "samesite"=>"strict"));

// //         // if ($newAccount == 1){
// //         // //     header("Location: /accountsettings");
// //         //         header("Location: /library");
// //         // }else{
// //         // //     header("Location: /dashboard");
// //         //         header("Location: /course");
// //         // }
// //     }
// // }

$conn->close();
