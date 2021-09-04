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
$variants = array();
$starts = array();
$attemptNumbers = array();

if ($success){

  $sql = "
        SELECT e.timeLimitMultiplier AS timeLimitMultiplier
        FROM enrollment AS e
        LEFT JOIN drive_content AS dc
        ON e.driveId = dc.driveId
        WHERE dc.doenetId='$doenetId'
        AND e.userId = '$userId'";
 
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$timeLimitMultiplier = $row['timeLimitMultiplier'];
if (!$timeLimitMultiplier){
        $timeLimitMultiplier = "1";
}

  $sql = "SELECT attemptNumber,
        generatedVariant,
        began
        FROM user_assignment_attempt
        WHERE userId='$userId'
        AND doenetId='$doenetId'
        ORDER BY attemptNumber ASC";

  $result = $conn->query($sql);
  while ($row = $result->fetch_assoc()){
          array_push($variants,$row["generatedVariant"]);
          array_push($starts,$row["began"]);
          array_push($attemptNumbers,$row["attemptNumber"]);

  }
}

$response_arr = array(
        "success"=>$success,
        "attemptNumbers"=>$attemptNumbers,
        "variants" => $variants,
        "starts" => $starts,
        "timeLimitMultiplier"=> $timeLimitMultiplier,
        "message"=>$message
);

http_response_code(200);

echo json_encode($response_arr);

$conn->close();

?>

