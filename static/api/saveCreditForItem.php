<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');
include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$response_arr = array(
    "access"=> TRUE
);


$_POST = json_decode(file_get_contents("php://input"),true);
$assignmentId = mysqli_real_escape_string($conn,$_POST["assignmentId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$credit = mysqli_real_escape_string($conn,$_POST["credit"]);
$itemNumber = mysqli_real_escape_string($conn,$_POST["itemNumber"]);




//TODO: *** Update to user_assignment_attempt_item
//attemptAggregation (from assignment) 

//If attemptAggregation = "m"; (char 1 type "m" or "l")
//Set credit in user_assignment_attempt_item = max credit in table or new param calculated
//If attemptAggregation = "l"; 
////Set credit in user_assignment_attempt_item to new param calculated



//TODO: *** Calculate credit achieved for user_assignment_attempt

//CreditOveride else credit
//Weight
//Sum all credits * weights / sum of weights

//Use earlier calculation of new credit on the item
//If attemptAggregation = "m"; (char 1 type "m" or "l")
//Set credit in user_assignment_attempt = max credit in table or new param calculated
//If attemptAggregation = "l"; 
////Set credit in user_assignment_attempt to new param calculated


//TODO: *** Calculate user's score on user_assignment
//ASSUME "m" for user_assignment
//No weights
//max of all attempts 
//Credit or credit override (undefined vs zero)


//   $sql = "INSERT INTO user_assignment_attempt 
//       (userId,assignmentId,attemptNumber,contentId)
//       values
//       ('$userId','$assignmentId','$attemptNumber','$contentId')
//       ";
// $result = $conn->query($sql);

//   for ($itemNumber = 1; $itemNumber < count($weights) + 1; $itemNumber++){
//       echo $itemNumber . "\n";
//       //Store Item  weights
//       $weight = $weights[($itemNumber -1)];
//       $sql = "INSERT INTO user_assignment_attempt_item 
//       (userId,assignmentId,attemptNumber,itemNumber,weight)
//       values
//       ('$userId','$assignmentId','$attemptNumber','$itemNumber','$weight')
//       ";
//       echo $sql;
//     $result = $conn->query($sql);

//   }



    // set response code - 200 OK
    http_response_code(200);

//  echo json_encode($response_arr);

$conn->close();
?>