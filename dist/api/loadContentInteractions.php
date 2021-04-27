<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];
$device = $jwtArray['deviceName'];

$contentId = mysqli_real_escape_string($conn,$_REQUEST["contentId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_REQUEST["attemptNumber"]);
$assignmentId = mysqli_real_escape_string($conn,$_REQUEST["assignmentId"]);

$success = TRUE;
$message = "";
if ($contentId == ""){
$success = FALSE;
$message = 'Internal Error: missing contentId';
}elseif ($attemptNumber == ""){
$success = FALSE;
$message = 'Internal Error: missing attemptNumber';
}elseif ($assignmentId == ""){
$success = FALSE;
$message = 'Internal Error: missing assignmentId';
}elseif ($userId == ""){
$success = FALSE;
$message = "You need to be signed in for content interaction information";
}

if ($success){

  $sql = "SELECT stateVariables, variant
        FROM content_interactions
        WHERE userId='$userId'
        AND contentId='$contentId'
        AND attemptNumber='$attemptNumber'
        AND assignmentId='$assignmentId'
        ORDER BY timestamp DESC, id DESC";

  $result = $conn->query($sql);
  // $stateVariables = array();
  // while ($row = $result->fetch_assoc()){
  //         array_push($stateVariables,$row["stateVariables"]);
  // }
  $row = $result->fetch_assoc();
  $stateVariables = $row["stateVariables"];
  $variant = $row["variant"];
}

$response_arr = array(
        "success"=>$success,
        "stateVariables" => $stateVariables,
        "variant" => $variant,
        "message"=>$message
);

http_response_code(200);

echo json_encode($response_arr);

$conn->close();

?>

