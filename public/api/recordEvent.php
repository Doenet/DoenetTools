<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";
include "baseModel.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];
$examUserId = array_key_exists("examineeUserId", $jwtArray) ? $jwtArray['examineeUserId'] : "";
$examDoenetId = array_key_exists("doenetId", $jwtArray) ? $jwtArray['doenetId'] : "";

try {
  $_POST = json_decode(file_get_contents("php://input"), true);

  //validate input
  Base_Model::checkForRequiredInputs(
    $_POST,
    [
      "activityId",
      "attemptNumber",
      "verb",
      "object",
      "result",
      "context",
      "version",
      "timestamp"
    ]
  );

  if ($userId == "") {
    if ($examUserId == "") {
      http_response_code(401);
      throw new Exception("No access - Need to sign in");
    } else if ($examDoenetId != $doenetId) {
      http_response_code(403);
      throw new Exception("No access for doenetId: $doenetId");
    } else {
      $userId = $examUserId;
    }
  }

  //TODO: Handle Anonymous
  // elseif ($userId == ""){
  //   $success = FALSE;
  //   $message = "You need to be signed in to create a $type";
  // }

  $doenetId =  mysqli_real_escape_string($conn, $_POST["activityId"]);
  $activityCid =  mysqli_real_escape_string($conn, $_POST["activityCid"]);
  $pageCid =  mysqli_real_escape_string($conn, $_POST["pageCid"]);
  $pageNumber =  mysqli_real_escape_string($conn, $_POST["pageNumber"]);
  $attemptNumber =  mysqli_real_escape_string($conn, $_POST["attemptNumber"]);
  $verb =  mysqli_real_escape_string($conn, $_POST["verb"]);
  $object =  mysqli_real_escape_string($conn, $_POST["object"]);
  $result =  mysqli_real_escape_string($conn, $_POST["result"]);
  $context =  mysqli_real_escape_string($conn, $_POST["context"]);
  $version =  mysqli_real_escape_string($conn, $_POST["version"]);
  $activityVariantIndex =  mysqli_real_escape_string($conn, $_POST["activityVariantIndex"]);
  $pageVariantIndex =  mysqli_real_escape_string($conn, $_POST["pageVariantIndex"]);
  $timestamp =  mysqli_real_escape_string($conn, $_POST["timestamp"]);

  $pageCid = $pageCid == "" ? "NULL" : "'$pageCid'";
  $activityCid = $activityCid == "" ? "NULL" : "'$activityCid'";
  $pageVariantIndex = $pageVariantIndex == "" ? "NULL" : "'$pageVariantIndex'";
  $activityVariantIndex = $activityVariantIndex == "" ? "NULL" : "'$activityVariantIndex'";

  if ($pageNumber == "") {
    $pageNumber = 'NULL';
  }

  $sql =
    "INSERT INTO event (userId,doenetId,activityCid,pageCid,pageNumber,attemptNumber,activityVariantIndex,pageVariantIndex,verb,object,result,context,version,timestamp)
    VALUES ('$userId','$doenetId',$activityCid,$pageCid,$pageNumber,$attemptNumber,$activityVariantIndex,$pageVariantIndex,'$verb','$object','$result','$context','$version','$timestamp')";

  Base_Model::runQuery($conn, $sql);

  //build response array
  $response_arr = array(
    "success" => true,
    "message" => "Event recorded"
  );
  //set response code - 200 OK
  http_response_code(200);
} catch (Exception $e) {
  $response_arr = array(
    "success" => false,
    "message" => $e->getMessage()
  );
  if (http_response_code() == 200) {
    http_response_code(500);
  }
} finally {
  // make it json format
  echo json_encode($response_arr);
  //close database connection
  $conn->close();
}
