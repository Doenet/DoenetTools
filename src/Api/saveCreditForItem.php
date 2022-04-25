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
$examUserId = array_key_exists("examineeUserId",$jwtArray) ? $jwtArray['examineeUserId'] : "";
$examDoenetId = array_key_exists("doenetId",$jwtArray) ? $jwtArray['doenetId'] : "";

$_POST = json_decode(file_get_contents("php://input"),true);
$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$credit = mysqli_real_escape_string($conn,$_POST["credit"]);
$itemNumber = mysqli_real_escape_string($conn,$_POST["itemNumber"]);
$componentsSubmitted =  mysqli_real_escape_string($conn,$_POST["componentsSubmitted"]);

//TODO: check if attempt is older than given attempt

$success = TRUE;
$message = "";

if ($doenetId == ""){
$success = FALSE;
$message = 'Internal Error: missing doenetId';
}elseif ($attemptNumber == ""){
  $success = FALSE;
  $message = 'Internal Error: missing attemptNumber';
}elseif ($credit == ""){
  $success = FALSE;
  $message = 'Internal Error: missing credit';
}elseif ($itemNumber == ""){
  $success = FALSE;
  $message = 'Internal Error: missing itemNumber';
}elseif ($componentsSubmitted == ""){
  $success = FALSE;
  $message = 'Internal Error: missing componentsSubmitted';
}elseif ($userId == ""){
  if ($examUserId == ""){
    $success = FALSE;
    $message = "No access - Need to sign in";
  }else if ($examDoenetId != $doenetId){
      $success = FALSE;
      $message = "No access for doenetId: $doenetId";
  }else{
      $userId = $examUserId;
  }
}

if ($success){


//**Find assessment settings
$sql = "SELECT attemptAggregation,
        timeLimit,
        numberOfAttemptsAllowed,
        dueDate,
        totalPointsOrPercent
        FROM assignment
        WHERE doenetId='$doenetId'";

$result = $conn->query($sql);
$row = $result->fetch_assoc();
$attemptAggregation = $row['attemptAggregation'];
$timeLimit = $row['timeLimit'];
$numberOfAttemptsAllowed = $row['numberOfAttemptsAllowed'];
$dueDate = $row['dueDate'];
$totalPointsOrPercent = $row['totalPointsOrPercent'];

$valid = 1;

$timeExpired = FALSE;
$databaseError = FALSE;
$pastDueDate = FALSE;
$exceededAttemptsAllowed = FALSE;
$viewedSolution = FALSE;

//$numberOfAttemptsAllowed is '' when unlimited
if($numberOfAttemptsAllowed != '' && $attemptNumber > $numberOfAttemptsAllowed) {
  $exceededAttemptsAllowed = TRUE;
  $valid = 0;
}


// if there is a time limit,
// multiply by factor for user
if($timeLimit > 0) {

  // have to use drive_content
  // to get driveID from doenetID
  $sql = "SELECT timeLimitMultiplier 
    FROM enrollment e
    INNER JOIN drive_content dc
        ON dc.driveId = e.driveId
    WHERE dc.doenetId = '$doenetId'
    AND e.userId = '$userId'
    ";

  $result = $conn->query($sql);

  
  if ($result->num_rows < 1) {
    //TODO: handle Owners and Admins not being enrolled.
    // $databaseError = 1;
    // $valid = 0;
  } else {
    $row = $result->fetch_assoc();
    $timeLimit = ceil($timeLimit * $row["timeLimitMultiplier"]) ;
  }


}


// Get time began and creditOverride from user_assignment_attempt
$sql = "SELECT 
        NOW() AS now,
        began, 
        creditOverride, 
        credit
        FROM user_assignment_attempt
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        ";
$result = $conn->query($sql);

if ($result->num_rows < 1){
  $databaseError = 2;
  $valid = 0;
} else {
  $row = $result->fetch_assoc();
  $creditOverride_for_attempt = $row['creditOverride'];
  $previousCredit_for_attempt = $row['credit'];

  if($timeLimit > 0) {

    // give a buffer of one minute
    $effectiveTimeLimit = $timeLimit+1;

    // if began more than timeLimit ago, we're past time
    $began_seconds = strtotime($row['began']);
    $now_seconds = strtotime($row['now']);
    $effective_timelimit_seconds = $effectiveTimeLimit * 60;
    $diff_seconds = $now_seconds - ($began_seconds + $effective_timelimit_seconds);
    if(($began_seconds + $effective_timelimit_seconds) < $now_seconds) {
      $timeExpired = TRUE;
      $valid = 0;
    }
  }

}



// look for a due date adjustment and creditOverride for asssignment,
// which includes check for user_assignment having an entry
$sql = "SELECT 
        NOW() AS now,
        dueDateOverride, 
        creditOverride, 
        credit
        FROM user_assignment
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        ";

$result = $conn->query($sql);
if ($result->num_rows < 1){ 
  $databaseError = 3;
  $valid = 0;
} else {

  $row = $result->fetch_assoc();
  $dueDateOverride = $row['dueDateOverride'];
  $creditOverride_for_assignment = $row['creditOverride'];
  $previousCredit_for_assignment = $row['credit'];

  // If there is a due date override for this user
  // use that for the due date
  if($dueDateOverride) {
    $dueDate = $dueDateOverride;
  }
  //If null then it's never past due
  if ($dueDate){
    $dueDate_seconds = strtotime($dueDate);
    $now_seconds = strtotime($row['now']);
    $dueDate_diff = $now_seconds - $dueDate_seconds;
    // give one minute buffer on due date
    if($dueDate_seconds < $now_seconds) {
      $pastDueDate = TRUE;
      $valid = 0;
    }
  }

} 



$sql = "SELECT credit, creditOverride, viewedSolution
        FROM user_assignment_attempt_item
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        AND itemNumber = '$itemNumber'
        ";
$result = $conn->query($sql);

if ($result->num_rows < 1){ 
  $databaseError = 4;
  $valid = 0;
} else {
  $row = $result->fetch_assoc();

  $previousCredit = $row['credit'];
  $creditOverride_for_item = $row['creditOverride'];
  $viewedSolution = $row['viewedSolution'] == '1';
  if ($viewedSolution){
    $valid = 0;
  }
}



// we insert a row into user_assignment_attempt_item_submission
// whether or not it is valid

//Find submissionNumber
$sql = "
        SELECT submissionNumber
        FROM user_assignment_attempt_item_submission
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        AND itemNumber = '$itemNumber'
        ORDER BY submissionNumber DESC
        LIMIT 1
";
$result = $conn->query($sql);
if ($result->num_rows < 1){ 
  $submissionNumber = 1;
} else {
  $row = $result->fetch_assoc();
  $submissionNumber = $row['submissionNumber'];

  if ($submissionNumber < 1){ $submissionNumber = 0; }
  $submissionNumber++;
}

//Insert item submission 
//Specifically we want to store the credit of that actual submission
$sql = "
INSERT INTO user_assignment_attempt_item_submission
(doenetId,userId,attemptNumber,itemNumber,submissionNumber,componentsSubmitted,credit,submittedDate,valid)
VALUES
('$doenetId','$userId','$attemptNumber','$itemNumber','$submissionNumber','$componentsSubmitted','$credit',NOW(),'$valid')
";

$result = $conn->query($sql);


// we update credit in
//   - user_assignment
//   - user_assignment_attempt, and 
//   - user_assignment_attempt_item
// only if valid

$set_credit_by_item = FALSE;
$credit_by_item = array();


if ($valid){

  // if have a credit override on that item
  // then there is nothing to do,
  // as the score for the item must stay unchanged,
  // which means the resulting score for attempt and assignment
  // also cannot change
  if($creditOverride_for_item == NULL) {
    if ($attemptAggregation == 'm'){
      // Find previous credit if maximizing scores
      // Update credit in the database if it's larger
      $credit_for_item = MAX($previousCredit,$credit);
    }else if ($attemptAggregation == 'l'){
      $credit_for_item = $credit;
    }


    // Store credit in user_assignment_attempt_item
    $sql = "UPDATE user_assignment_attempt_item
    SET credit='$credit_for_item'
    WHERE userId = '$userId'
    AND doenetId = '$doenetId'
    AND attemptNumber = '$attemptNumber'
    AND itemNumber = '$itemNumber'
    ";
    $result = $conn->query($sql);


    // if have a credit override on the attempt
    // then we don't need to recalculate credit on the attempt or the assignment

    if($creditOverride_for_attempt == NULL) {

      // **update user_assignment_attempt for the content

      // Get the attempt's defined weights and credits
      $sql = "SELECT credit,itemNumber,weight
              FROM user_assignment_attempt_item
              WHERE userId = '$userId'
              AND doenetId = '$doenetId'
              AND attemptNumber = '$attemptNumber'
              ORDER BY itemNumber
              ";
      $result = $conn->query($sql);
      $total_credits = 0;
      $total_weights = 0;

      $set_credit_by_item = TRUE;

      while($row = $result->fetch_assoc()){ 
          $loopItemNumber = $row['itemNumber'];
          $item_weight = $row['weight'];
          $total_weights = $total_weights + $item_weight;
          //Not guaranteed for credit to be stored due to async communication with db
          //So use value given here to be careful
          if ($loopItemNumber == $itemNumber){
              $item_credit = $credit_for_item;
          }else{
              $item_credit = $row['credit'];
          }
  
          $total_credits = $total_credits + ($item_credit * $item_weight);

          $credit_by_item[] = $item_credit;
      }
      $credit_for_attempt = 0;
      if ($total_weights > 0){ //Prevent divide by zero
          $credit_for_attempt = $total_credits / $total_weights;
      }



      // Store credit in user_assignment_attempt
      $sql = "UPDATE user_assignment_attempt
              SET credit='$credit_for_attempt'
              WHERE userId = '$userId'
              AND doenetId = '$doenetId'
              AND attemptNumber = '$attemptNumber'
              ";
      $result = $conn->query($sql);

      // if have credit override on assignment, don't update assignment credit
      if($creditOverride_for_assignment == NULL) {

        //Find maximum credit over all attempts
        $sql = "SELECT MAX(credit) AS maxCredit
                FROM user_assignment_attempt
                WHERE userId = '$userId'
                AND doenetId = '$doenetId'
        ";

        $result = $conn->query($sql);
        $row = $result->fetch_assoc();

        $credit_for_assignment = MAX($credit_for_attempt,$row['maxCredit']);

        // update credit in user_assigment
        $sql = "
            UPDATE user_assignment
            SET credit='$credit_for_assignment'
            WHERE userId = '$userId'
            AND doenetId = '$doenetId'
            ";
        $result = $conn->query($sql);

      } else {
        // have non-NULL override of credit for assignment
        $credit_for_assignment = $creditOverride_for_assignment;
      } 

    } else {
      // have non-NULL override of credit for attempt
      $credit_for_attempt = $creditOverride_for_attempt;
      $credit_for_assignment = $previousCredit_for_assignment;
    }

  } else {
    // have non-NULL override of credit for item
    $credit_for_item = $creditOverride_for_item;
    $credit_for_attempt = $previousCredit_for_attempt;
    $credit_for_assignment = $previousCredit_for_assignment;
  } 

}  else {
  // have invalid attempt

  if($databaseError) {
    $credit_for_item = 0;
    $credit_for_attempt = 0;
    $credit_for_assignment = 0;
  } else {
    $credit_for_item = $previousCredit;
    $credit_for_attempt = $previousCredit_for_attempt;
    $credit_for_assignment = $previousCredit_for_assignment;
  }

}

if(!$set_credit_by_item && !$databaseError) {
  // look up the stored credit for each item of attempt
  $sql = "SELECT credit
          FROM user_assignment_attempt_item
          WHERE userId = '$userId'
          AND doenetId = '$doenetId'
          AND attemptNumber = '$attemptNumber'
          ORDER BY itemNumber
          ";
  $result = $conn->query($sql);

  while($row = $result->fetch_assoc()){ 
    $credit_by_item[] = $row['credit'];
  }

}
}

$response_arr = array(
    "success"=>$success,
    "message"=>$message,
    "access"=> TRUE,
    "viewedSolution"=>$viewedSolution,
    "timeExpired"=>$timeExpired,
    "pastDueDate"=>$pastDueDate,
    "exceededAttemptsAllowed"=>$exceededAttemptsAllowed,
    "databaseError"=>$databaseError,
    "valid"=>$valid,
    "creditForItem"=>$credit_for_item,
    "creditForAttempt"=>$credit_for_attempt,
    "creditForAssignment"=>$credit_for_assignment,
    "creditByItem"=>$credit_by_item,
    "began_seconds"=>$began_seconds,
    "effective_timelimit_seconds"=>$effective_timelimit_seconds,
    "now_seconds"=>$now_seconds,
    "diff_seconds"=>$diff_seconds,
    "dueDate_diff"=>$dueDate_diff,
    "totalPointsOrPercent"=>$totalPointsOrPercent,
);

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>