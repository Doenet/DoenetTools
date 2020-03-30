<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$_POST = json_decode(file_get_contents("php://input"),true);
$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$itemNumber = mysqli_real_escape_string($conn,$_POST["itemNumber"]);
$documentCreditAchieved = mysqli_real_escape_string($conn,$_POST["documentCreditAchieved"]);
$itemCreditAchieved = mysqli_real_escape_string($conn,$_POST["itemCreditAchieved"]);
$serializedItem = mysqli_real_escape_string($conn,$_POST["serializedItem"]);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$conditionalUser =  mysqli_real_escape_string($conn,$_POST["learnerUsername"]);
if ($conditionalUser != "") {
  $remoteuser = $conditionalUser;
}

// echo "remoteuser from saveSubmitResult $remoteuser\n";


$sql = "SELECT viewedSolution
FROM user_assignment_attempt_item
WHERE assignmentId = '$assignmentId'
AND username = '$remoteuser'
AND attemptNumber = '$attemptNumber'
AND itemNumber = '$itemNumber'
;";

$response = $conn->query($sql);
$viewedSolution = 0;
if ($response->num_rows > 0){
  $row = $response->fetch_assoc();
  if ($row["viewedSolution"] == 1){
    $viewedSolution = 1;
  }
}

if ($viewedSolution == 1){

  //Find submissionNumber
  $sql = "SELECT submissionNumber 
  FROM user_assignment_attempt_item_submission
  WHERE username='$remoteuser'
  AND assignmentId = '$assignmentId'
  AND itemNumber = '$itemNumber'
  ORDER BY submissionNumber DESC;";
  $response = $conn->query($sql);
  $row = $response->fetch_assoc();
  $submissionNumber = $row['submissionNumber'];
  $submissionNumber++;
  
  $sql = "INSERT INTO user_assignment_attempt_item_submission
  (username,assignmentId,attemptNumber,itemNumber,submissionNumber,credit,itemState,submittedDate,valid)
  VALUES
  ('$remoteuser','$assignmentId','$attemptNumber','$itemNumber','$submissionNumber','$itemCreditAchieved','$serializedItem',NOW(),0);";
  $response = $conn->query($sql);

}else{
  $sql = "SELECT credit
  FROM user_assignment
  WHERE assignmentId = '$assignmentId'
  AND username = '$remoteuser';";
  
  $response = $conn->query($sql);
  if ($response->num_rows == 0){
    $maxAssignmentCredit = $documentCreditAchieved;

    $sql = "INSERT INTO user_assignment 
    (assignmentId,username,credit) 
    VALUES 
    ('$assignmentId','$remoteuser','$maxAssignmentCredit');";
    
    $response = $conn->query($sql);
  }else{
  $row = $response->fetch_assoc();

  $maxAssignmentCredit = $row['credit'];

    if ($documentCreditAchieved > $maxAssignmentCredit){
      $maxAssignmentCredit = $documentCreditAchieved;
      $sql = "UPDATE user_assignment 
      SET credit= '$maxAssignmentCredit'
      WHERE assignmentId = '$assignmentId'
      AND username = '$remoteuser';";
      $response = $conn->query($sql);
    }
  }
  
  
  //check attempts
  $sql = "SELECT attemptNumber,credit
  FROM user_assignment_attempt
  WHERE username = '$remoteuser'
  AND assignmentId = '$assignmentId'
  AND attemptNumber = '$attemptNumber' ";
  $response = $conn->query($sql);
  if ($response->num_rows == 0){
    $sql = "INSERT INTO user_assignment_attempt
    (username,assignmentId,attemptNumber,credit,began)
    VALUES
    ('$remoteuser','$assignmentId','$attemptNumber','$documentCreditAchieved',NOW());";
    $response = $conn->query($sql);
  }else{
    $row = $response->fetch_assoc();
    $attemptNumber = $row['attemptNumber'];
    $attemptCredit = $row['credit'];
 
    //only update if credit is better
    if ($documentCreditAchieved > $attemptCredit){
    $sql = "UPDATE user_assignment_attempt
    SET credit = '$documentCreditAchieved'
    WHERE username = '$remoteuser'
    AND assignmentId = '$assignmentId'
    AND attemptNumber = '$attemptNumber'; ";
    $response = $conn->query($sql);
    }
  }
  //user_assignment_attempt_item
  $sql = "SELECT credit
  FROM user_assignment_attempt_item
  WHERE username = '$remoteuser' 
  AND assignmentId = '$assignmentId'
  AND attemptNumber = '$attemptNumber'
  AND itemNumber = '$itemNumber';";
  
  $response = $conn->query($sql);
  if ($response->num_rows == 0){
    $sql = "INSERT INTO user_assignment_attempt_item
    (username,assignmentId,attemptNumber,itemNumber,credit)
    VALUES
    ('$remoteuser','$assignmentId','$attemptNumber','$itemNumber','$itemCreditAchieved');";
    $response = $conn->query($sql);
  }else{
    $row = $response->fetch_assoc();
    $pastCreditForItem = $row['credit'];
  
    //only update user_assignment_attempt_item if credit is greater
    if ($pastCreditForItem < $itemCreditAchieved){
    $sql = "UPDATE user_assignment_attempt_item
    SET credit = '$itemCreditAchieved'
    WHERE username='$remoteuser'
    AND assignmentId='$assignmentId'
    AND attemptNumber='$attemptNumber'
    AND itemNumber='$itemNumber';";
    $response = $conn->query($sql);
    }
  }


  
  //Find submissionNumber
  $sql = "SELECT submissionNumber 
  FROM user_assignment_attempt_item_submission
  WHERE username='$remoteuser'
  AND assignmentId = '$assignmentId'
  AND itemNumber = '$itemNumber'
  ORDER BY submissionNumber DESC;";
  $response = $conn->query($sql);
  $row = $response->fetch_assoc();
  $submissionNumber = $row['submissionNumber'];
  $submissionNumber++;
  
  $sql = "INSERT INTO user_assignment_attempt_item_submission
  (username,assignmentId,attemptNumber,itemNumber,submissionNumber,credit,itemState,submittedDate)
  VALUES
  ('$remoteuser','$assignmentId','$attemptNumber','$itemNumber','$submissionNumber','$itemCreditAchieved','$serializedItem',NOW());";
  $response = $conn->query($sql);


}



if ($response === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
}

$response_arr = array(
  "viewedSolution" => $viewedSolution,
  );

echo json_encode($response_arr);

$conn->close();


?>

