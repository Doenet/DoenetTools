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
$branchId = mysqli_real_escape_string($conn,$_POST["branchId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$credit = mysqli_real_escape_string($conn,$_POST["credit"]);
$itemNumber = mysqli_real_escape_string($conn,$_POST["itemNumber"]);
$itemNumber = $itemNumber + 1;

//TODO: check if this is too many tries 
//TODO: check if attempt is older than given attempt

//**Find attemptAggregation
$sql = "SELECT attemptAggregation
        FROM assignment
        WHERE branchId='$branchId'";

$result = $conn->query($sql);
$row = $result->fetch_assoc();
$attemptAggregation = $row['attemptAggregation'];

//**Update user_assignment_attempt_item
if ($attemptAggregation == 'm'){
// Find previous credit if maximizing scores
// Update credit in the database if it's larger
$sql = "SELECT credit
        FROM user_assignment_attempt_item
        WHERE userId = '$userId'
        AND branchId = '$branchId'
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

echo "credit_to_store $credit_to_store";
// Store credit in user_assignment_attempt_item
$sql = "UPDATE user_assignment_attempt_item
        SET credit='$credit_to_store'
        WHERE userId = '$userId'
        AND branchId = '$branchId'
        AND attemptNumber = '$attemptNumber'
        AND itemNumber = '$itemNumber'
        ";
$result = $conn->query($sql);


//**update user_assignment_attempt for the content

// Get the attempt's defined weights and credits
$sql = "SELECT credit,itemNumber,weight
        FROM user_assignment_attempt_item
        WHERE userId = '$userId'
        AND branchId = '$branchId'
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
        $item_credit = $credit_to_store;
    }else{
        $item_credit = $row['credit'];
    }
    $total_credits = $total_credits + ($item_credit * $item_weight);
}
$credit_for_attempt = $total_credits / $total_weights;

// Store credit in user_assignment_attempt
$sql = "UPDATE user_assignment_attempt
        SET credit='$credit_for_attempt'
        WHERE userId = '$userId'
        AND branchId = '$branchId'
        AND attemptNumber = '$attemptNumber'
        ";
$result = $conn->query($sql);



//**update user_assignment with new score
// if ($attemptAggregation == 'm'){

//Find maximum credit and maximum creditOverrides on each attempt
$sql = "SELECT MAX(credit) AS maxCredit,
        MAX(creditOverride) AS maxCreditOverride
        FROM user_assignment_attempt
        WHERE userId = '$userId'
        AND branchId = '$branchId'
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

$max_credit_for_assignment = MAX($credit_for_attempt,$row['maxCredit'], $row['maxCreditOverride']);
$sql = "
    UPDATE user_assignment
    SET credit='$max_credit_for_assignment'
    WHERE userId = '$userId'
    AND branchId = '$branchId'
";
$result = $conn->query($sql);

// }else if ($attemptAggregation == 'l'){
//     //Use last attempt
//     $sql = "
//     UPDATE user_assignment
//     SET credit='$credit_for_attempt'
//     WHERE userId = '$userId'
//     AND branchId = '$branchId'
// ";
// $result = $conn->query($sql);
// }




    // set response code - 200 OK
    http_response_code(200);

//  echo json_encode($response_arr);

$conn->close();
?>