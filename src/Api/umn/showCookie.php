<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include '../db_connection.php';

$jwtArray = include '../jwtArray.php';
var_dump($jwtArray);


$conn->close();
