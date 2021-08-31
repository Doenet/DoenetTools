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
$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$credit = mysqli_real_escape_string($conn,$_POST["credit"]);
$itemNumber = mysqli_real_escape_string($conn,$_POST["itemNumber"]);
$stateVariables =  mysqli_real_escape_string($conn,$_POST["stateVariables"]);

//TODO: check if attempt is older than given attempt


//**Find assessment settings
$sql = "SELECT attemptAggregation,
        timeLimit,
        numberOfAttemptsAllowed,
        dueDate
        FROM assignment
        WHERE doenetId='$doenetId'";

$result = $conn->query($sql);
$row = $result->fetch_assoc();
$attemptAggregation = $row['attemptAggregation'];
$timeLimit = $row['timeLimit'];
$numberOfAttemptsAllowed = $row['numberOfAttemptsAllowed'];
$dueDate = $row['dueDate'];

$valid = 1;

$timeExpired = FALSE;
$databaseError = FALSE;
$pastDueDate = FALSE;
$exceededAttemptsAllowed = FALSE;
$viewedSolution = FALSE;


if($attemptNumber > $numberOfAttemptsAllowed) {
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
    $timeLimit = 1;
    //TODO: handle Owners and Admins not being enrolled.
    // $databaseError = 1;
    // $valid = 0;
  } else {
    $row = $result->fetch_assoc();
    $timeLimit = ceil($timeLimit * $row["timeLimitMultiplier"]) ;
  }


}


// Get time began and creditOverride from user_assignment_attempt
$sql = "SELECT began, creditOverride
        FROM user_assignment_attempt
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND contentId = '$contentId'
        AND attemptNumber = '$attemptNumber'
        ";
$result = $conn->query($sql);

if ($result->num_rows < 1){
  $databaseError = 2;
  $valid = 0;
} else {
  $row = $result->fetch_assoc();
  $creditOverride_for_attempt = $row['creditOverride'];

  if($timeLimit > 0) {
    // give a buffer of one minute
    $effectiveTimeLimit = $timeLimit+1;

    // if began more than timeLimit ago, we're past time
    if(strtotime($row['began']) < strtotime("-".$effectiveTimeLimit." minutes")) {
      $timeExpired = TRUE;
      $valid = 0;
    }
  }

}



// look for a due date adjustment and creditOverride for asssignment,
// which includes check for user_assignment having an entry
$sql = "SELECT dueDateOverride, creditOverride
        FROM user_assignment
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND contentId = '$contentId'
        ";

$result = $conn->query($sql);
if ($result->num_rows < 1){ 
  $databaseError = 3;
  $valid = 0;
} else {

  $row = $result->fetch_assoc();
  $dueDateOverride = $row['dueDateOverride'];
  $creditOverride_for_assignment = $row['creditOverride'];

  // If there is a due date override for this user
  // use that for the due date
  if($dueDateOverride) {
    $dueDate = $dueDateOverride;
  }
  
  // give one minute buffer on due date
  if(strtotime($dueDate) < strtotime("-1 minute")) {
    $pastDueDate = TRUE;
    $valid = 0;
  }

} 



$sql = "SELECT credit, creditOverride, viewedSolution
        FROM user_assignment_attempt_item
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND contentId = '$contentId'
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
        AND contentId = '$contentId'
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
(doenetId,contentId,userId,attemptNumber,itemNumber,submissionNumber,stateVariables,credit,submittedDate,valid)
VALUES
('$doenetId','$contentId','$userId','$attemptNumber','$itemNumber','$submissionNumber','$stateVariables','$credit',NOW(),'$valid')
";

$result = $conn->query($sql);


// we update credit in
//   - user_assignment
//   - user_assignment_attempt, and 
//   - user_assignment_attempt_item
// only if valid

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
    AND contentId = '$contentId'
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
              AND contentId = '$contentId'
              AND attemptNumber = '$attemptNumber'
              ORDER BY itemNumber
              ";
      $result = $conn->query($sql);
      $total_credits = 0;
      $total_weights = 0;

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
              AND contentId = '$contentId'
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
                AND contentId = '$contentId'
        ";

        $result = $conn->query($sql);
        $row = $result->fetch_assoc();

        $max_credit_for_assignment = MAX($credit_for_attempt,$row['maxCredit']);

        // update credit in user_assigment
        $sql = "
            UPDATE user_assignment
            SET credit='$max_credit_for_assignment'
            WHERE userId = '$userId'
            AND doenetId = '$doenetId'
            AND contentId = '$contentId'
            ";
        $result = $conn->query($sql);

      } // close have NULL override of credit for assignment

    } // close have NULL override of credit for attempt

  } // close have NULL override of credit for item

} //Close have valid attempt

$response_arr = array(
    "access"=> TRUE,
    "viewedSolution"=>$viewedSolution,
    "timeExpired"=>$timeExpired,
    "pastDueDate"=>$pastDueDate,
    "exceededAttemptsAllowed"=>$exceededAttemptsAllowed,
    "databaseError"=>$databaseError,
    "valid"=>$valid
);

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>