<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "cidFromSHA.php";


$doenetML = "
<graph>
  <point>(0,3)</point>
</graph>
";

echo $doenetML;
echo cidFromSHA(hash("sha256",$doenetML));


$conn->close();
?>