<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$user_id = "g468lpuBGYwxldAMt5vT4";
$deviceNames = include "deviceNames.php";
//Remove device names which are already in use
$sql = "
SELECT deviceName
FROM user_device
WHERE userId='$user_id'
";

$result = $conn->query($sql);
$used_deviceNames = array();
while($row = $result->fetch_assoc()){
  array_push($used_deviceNames,$row['deviceName']);
}
$deviceNames = array_values(array_diff($deviceNames,$used_deviceNames));
if (count($deviceNames) < 1){
  //Ran out of device names
  $deviceName = include 'randomId.php';
}else{
  //Pick from what is left
  $randomNumber = rand(0,(count($deviceNames) - 1));
  $deviceName = $deviceNames[$randomNumber];
}

$conn->close();

?>