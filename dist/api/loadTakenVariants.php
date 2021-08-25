<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);

$success = TRUE;
$message = "";

if ($doenetId == ""){
$success = FALSE;
$message = 'Internal Error: missing doenetId';
}

if ($success){

  $sql = "SELECT generatedVariant
        FROM user_assignment_attempt
        WHERE userId='$userId'
        AND doenetId='$doenetId'
        ORDER BY attemptNumber ASC";

  $result = $conn->query($sql);
  $variants = array();
  while ($row = $result->fetch_assoc()){
          array_push($variants,$row["generatedVariant"]);
  }
}

$response_arr = array(
        "success"=>$success,
        "variants" => $variants,
        "message"=>$message
);

http_response_code(200);

echo json_encode($response_arr);

$conn->close();

?>

