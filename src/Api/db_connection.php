<?php

$env_path = '../etc/env.ini';
$ini_array = parse_ini_file($env_path);

$dbhost = $ini_array['dbhost'];
$username = $ini_array['username'];
$password = $ini_array['password'];
$database = $ini_array['database'];

if (
    $database = 'doenet_local'
) {
    $_SERVER['givenName'] = "chocolate";  //For shib test on localhost
    $_SERVER['surname'] = "eclair"; //For shib test on localhost
    $_SERVER['mail'] = "eclair@doenet.org"; //For shib test on localhost
}

// unsure why this is here - Emilio
if ($_SERVER['HTTP_HOST'] == 'localhost:3000') {
    $dbhost = '127.0.0.1';
    $password = 'root';
}


$conn = new mysqli();


// Note: use MYSQLI_CLIENT_FOUND_ROWS
// so that can check rows_affected to determine if UPDATE queries match any records
// even if they didn't change any records
if (!$conn->real_connect($dbhost, $username, $password, $database, 3306, null, MYSQLI_CLIENT_FOUND_ROWS)) {
    die('Database Connection failed: ' . mysqli_connect_error());
}

?>
