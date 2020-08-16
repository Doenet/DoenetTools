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
$itemNumber = $itemNumber + 1;

//TODO: check if this is too many tries 
//TODO: check if attempt is older than given attempt

//Find attemptAggregation
$sql = "SELECT attemptAggregation
        FROM assignment
        WHERE assignmentId='$assignmentId'";

$result = $conn->query($sql);
$row = $result->fetch_assoc();
$attemptAggregation = $row['attemptAggregation'];

if ($attemptAggregation == 'm'){
// Find previous credit if maximizing scores
// Update credit in the database if it's larger
$sql = "SELECT credit
        FROM user_assignment_attempt_item
        WHERE userId = '$userId'
        AND assignmentId = '$assignmentId'
        AND attemptNumber = '$attemptNumber'
        AND itemNumber = '$itemNumber'
        ";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$previousCredit = $row['credit'];
$credit_to_store = MAX($previousCredit,$credit);
}else if ($attemptAggregation == 'l'){
    $credit_to_store = $credit;
}


// Store credit in user_assignment_attempt_item
$sql = "UPDATE user_assignment_attempt_item
        SET credit='$credit_to_store'
        WHERE userId = '$userId'
        AND assignmentId = '$assignmentId'
        AND attemptNumber = '$attemptNumber'
        AND itemNumber = '$itemNumber'
        ";
$result = $conn->query($sql);


//**update user_assignment_attempt for the content

// Get the attempt's defined weights and credits
$sql = "SELECT credit,itemNumber,weight
        FROM user_assignment_attempt_item
        WHERE userId = '$userId'
        AND assignmentId = '$assignmentId'
        AND attemptNumber = '$attemptNumber'
        ORDER BY itemNumber
        ";
$result = $conn->query($sql);
$credit_for_attempt = 0;

while($row = $result->fetch_assoc()){ 
    $loopItemNumber = $row['itemNumber'];
    $item_weight = $row['weight'];
    //Not guaranteed for credit to be stored due to async communication with db
    //So use value given here to be careful
    if ($loopItemNumber == $itemNumber){
        $item_credit = $credit_to_store;
    }else{
        $item_credit = $row['credit'];
    }
    $credit_for_attempt = $credit_for_attempt + ($item_credit * $item_weight);

    // echo "\$loopItemNumber $loopItemNumber\n";
    // echo "\$item_credit $item_credit\n";
    // echo "\$item_weight $item_weight\n";
    // echo "\$credit_for_attempt $credit_for_attempt\n\n";
}

// Store credit in user_assignment_attempt
$sql = "UPDATE user_assignment_attempt
        SET credit='$credit_for_attempt'
        WHERE userId = '$userId'
        AND assignmentId = '$assignmentId'
        AND attemptNumber = '$attemptNumber'
        ";
$result = $conn->query($sql);



//update user_assignment_attempt with new score
// if ($attemptAggregation == 'm'){
// //Use Max Item Credit
// echo "Max Item Credit\n";
// $sql = "SELECT itemNumber,weight
//         FROM user_assignment_attempt_item
//         WHERE userId = '$userId'
//         AND assignmentId = '$assignmentId'
//         ORDER BY attemptNumber,itemNumber
//         ";
// $result = $conn->query($sql);
// $weights = array();  //Set to this attempt's weights
// $credits = array();  //Initialize to zeros

// while($row = $result->fetch_assoc()){ 
//     $loopItemNumber = $row['itemNumber'];
//     $weights[$loopItemNumber] = $row['weight'];
//     $credits[$loopItemNumber] = 0;
// }


// }else if ($attemptAggregation == 'l'){
// //Use last attempt
// }else{
//     echo "Error: attempt aggregation not defined\n";
// }

//If attemptAggregation = "m"; (char 1 type "m" or "l")
//Set credit in user_assignment_attempt_item = max credit in table or new param calculated
//If attemptAggregation = "l"; 
//Set credit in user_assignment_attempt_item to new param calculated

// if ($attemptAggregation == 'm'){
// //Find Max Item Credit
// $sql = "SELECT MAX(credit) AS maxCredit,
//         MAX(creditOverride) AS maxCreditOverride
//         FROM user_assignment_attempt_item
//         WHERE userId = '$userId'
//         AND assignmentId = '$assignmentId'
//         AND itemNumber = '$itemNumber'
// ";
// $result = $conn->query($sql);
// $row = $result->fetch_assoc();
// $maxCredit = $row['maxCredit'];
// $maxCreditOverride = $row['maxCreditOverride'];
// $saveItemCredit = MAX($maxCredit,$maxCreditOverride,$credit);
// }else if ($attemptAggregation == 'l'){
//     //Use last attempt
//     $saveItemCredit = $credit;
// }else{
//     echo "Error: attempt aggregation not defined\n";
// }

// $sql = "UPDATE user_assignment_attempt_item
//         SET credit='$saveItemCredit'
//         WHERE userId = '$userId'
//         AND assignmentId = '$assignmentId'
//         AND attemptNumber = '$attemptNumber'
//         AND itemNumber = '$itemNumber'
//         ";
// $result = $conn->query($sql);




//TODO: *** Calculate credit achieved for user_assignment_attempt

//CreditOveride else credit
//Weight
//Sum all attempt credits * weights / sum of weights
// if ($attemptAggregation == 'm'){
// //Max credit
// $sql = "SELECT MAX(credit) AS maxCredit,
//         MAX(creditOverride) AS maxCreditOverride
//         FROM user_assignment_attempt_item
//         WHERE userId = '$userId'
//         AND assignmentId = '$assignmentId'
//         AND itemNumber = '$itemNumber'
// ";

//Use earlier calculation of new credit on the item
//If attemptAggregation = "m"; 
//Set credit in user_assignment_attempt = max credit in table or new param calculated
//If attemptAggregation = "l"; 
//Set credit in user_assignment_attempt to new param calculated
// }else if ($attemptAggregation == 'l'){
//     //Last credit
//     //Set credit in user_assignment_attempt to new param calculated
//     }else{
//         echo "Error: attempt aggregation not defined\n";
//     }

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