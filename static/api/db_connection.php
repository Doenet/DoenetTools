<?php

$env_path = "/var/www/html/dev.doenet.org/etc/env.ini";
$remoteuser = $_SERVER[ 'REMOTE_USER' ];
$db_temp = "cse_doenet";


if ($_SERVER['HTTP_HOST'] == 'localhost' || $_SERVER['HTTP_HOST'] == 'localhost:3000'){
  $env_path = "../open_api/env.ini";
  $remoteuser = "devuser";
  $db_temp = "doenet_local";
}

$ini_array = parse_ini_file($env_path);

$dbhost = $ini_array["dbhost"];
$username = $ini_array["username"];
$password = $ini_array["password"];
$database = $ini_array["database"];

$database = $db_temp; //TODO: remove all $db_temp's

if ($_SERVER['HTTP_HOST'] == 'localhost:3000'){
  $dbhost = "127.0.0.1";
}


$conn = mysqli_connect($dbhost, $username, $password, $database);
// Check connection
if (!$conn) {
    die("Database Connection failed: " . mysqli_connect_error());
}

http_response_code(200);

?>
