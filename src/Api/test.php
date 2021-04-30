<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$sql = "
SELECT screenName
FROM user
";
$result = $conn->query($sql);
while($row = $result->fetch_assoc()){
  echo $row['screenName']."\n";
}
$conn->close();
?>