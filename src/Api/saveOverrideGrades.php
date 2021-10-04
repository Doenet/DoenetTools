<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
include "db_connection.php";


date_default_timezone_set('UTC');
// America/Chicago

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];


$_POST = json_decode(file_get_contents("php://input"),true);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);

$emails = array_map(function($item) use($conn) {
  return mysqli_real_escape_string($conn, $item);
}, $_POST['emails']);
$scores = array_map(function($item) use($conn) {
  return mysqli_real_escape_string($conn, $item);
}, $_POST['scores']);

$success = TRUE;
$message = "";

if ($attemptNumber == ""){
  $success = FALSE;
  $message = 'Internal Error: missing attemptNumber';
}elseif ($doenetId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing doenetId';
}

//TODO: Test permission to set grades

if ($success){

  //Look up total points for assignment
  $sql = "
  SELECT 
  attemptAggregation,
  totalPointsOrPercent,
  driveId
  FROM assignment
  WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  $totalPointsOrPercent = $row['totalPointsOrPercent'];
  $attemptAggregation = $row['attemptAggregation'];
  $driveId = $row['driveId'];

  $sql = "SELECT canChangeAllDriveSettings
      FROM drive_user
      WHERE userId = '$userId'
      AND driveId = '$driveId'
    ";
    $result = $conn->query($sql); 
    $row = $result->fetch_assoc();
      $allowed = $row['canChangeAllDriveSettings'];
      if (!$allowed) {
        $success = FALSE;
        $message = "You need need permission to add grades";
      }

  if ($success){

  foreach ($emails AS $key => $email){
    $credit = $scores[$key] / $totalPointsOrPercent;

    //Find userId
    $sql = "
    SELECT u.userId
    FROM user AS u
    INNER JOIN enrollment AS e
    ON e.userId = u.userId
    WHERE u.email = '$email'
    AND e.driveId = '$driveId' 
    ";
    $result = $conn->query($sql);
    //Uploaded data requires students who are enrolled
    if ($result->num_rows < 1) {
      continue;
    }
    $row = $result->fetch_assoc();
    $emailUserId = $row['userId'];

    //If a row exists then update else insert
    $sql = "
    SELECT doenetId
    FROM user_assignment_attempt
    WHERE userId = '$emailUserId'
    AND doenetId = '$doenetId'
    AND attemptNumber = '$attemptNumber'
    ";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $sql = "UPDATE user_assignment_attempt
        SET credit='$credit',
        creditOverride='$credit'
        WHERE userId = '$emailUserId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        ";
    }else{
        $sql = "
        INSERT INTO user_assignment_attempt (doenetId,contentId,userId,attemptNumber,credit,creditOverride)
        VALUES
        ('$doenetId','e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855','$emailUserId','$attemptNumber','$credit','$credit')
        ";
    }
    $result = $conn->query($sql);

    // if we don't have a record for this user on the user_assignment table then we need to insert not update
    $sql = "
    SELECT creditOverride
    FROM user_assignment
    WHERE doenetId = '$doenetId'
    AND userId = '$emailUserId'
    ";

    $result = $conn->query($sql);

    $need_insert = TRUE;
  if ($result->num_rows > 0) {
    $need_insert = FALSE;
    $row = $result->fetch_assoc();
    $creditOverride_for_assignment = $row['creditOverride'];
 
    // if we have $creditOverride_for_assignment, don't update assignment credit
    if ($creditOverride_for_assignment != NULL){
      continue;
    }
  }

      $sql = "
      SELECT 
      credit
      FROM user_assignment_attempt
      WHERE userId = '$emailUserId'
      AND doenetId = '$doenetId'
      ORDER BY attemptNumber DESC
      ";
      $result = $conn->query($sql);
      
    $credit_for_assignment = 0;

    //Update user_assignment table
    if ($attemptAggregation == 'm'){
      // Find maximum attempt score
      while($row = $result->fetch_assoc()){
        $attemptCredit = $row['credit'];
        // $attemptCredit = (float) $row['credit'];
        
        if ($attemptCredit > $credit_for_assignment){
          $credit_for_assignment = $attemptCredit;
        }
      }
    }else if ($attemptAggregation == 'l'){
      // Use latest attempt score
      $row = $result->fetch_assoc();
      $lastCredit = $row['credit'];

      $credit_for_assignment = $lastCredit;
    }

    if ($need_insert){
        // insert credit in user_assigment
        $sql = "
        INSERT INTO user_assignment (doenetId,contentId,userId,credit)
        VALUES
        ('$doenetId','e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855','$emailUserId','$credit_for_assignment')
        ";
    }else{
        // update credit in user_assigment
        $sql = "
        UPDATE user_assignment
        SET credit='$credit_for_assignment'
        WHERE userId = '$emailUserId'
        AND doenetId = '$doenetId'
        ";
    }
    $result = $conn->query($sql);

  }
}
}



$response_arr = array(
  "success"=> $success,
  "message"=> $message,
);

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>