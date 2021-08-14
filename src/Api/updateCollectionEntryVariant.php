<?php
include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

if (array_key_exists('doenetId', $_REQUEST)) {
    //TODO: variant update logic
}
?>
