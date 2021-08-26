<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];


$_POST = json_decode(file_get_contents("php://input"),true);
$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]);
$attemptNumber = mysqli_real_escape_string($conn,$_POST["attemptNumber"]);
$credit = mysqli_real_escape_string($conn,$_POST["credit"]);
$itemNumber = mysqli_real_escape_string($conn,$_POST["itemNumber"]);
$stateVariables =  mysqli_real_escape_string($conn,$_POST["stateVariables"]);

//TODO: check if this is too many tries 
//TODO: check if attempt is older than given attempt


//**Find attemptAggregation
$sql = "SELECT attemptAggregation
        FROM assignment
        WHERE doenetId='$doenetId'";

$result = $conn->query($sql);
$row = $result->fetch_assoc();
$attemptAggregation = $row['attemptAggregation'];

//**Insert user_assignment_attempt_item row if doesn't exist
$sql = "SELECT credit, viewedSolution
        FROM user_assignment_attempt_item
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND contentId = '$contentId'
        AND attemptNumber = '$attemptNumber'
        AND itemNumber = '$itemNumber'
        ";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

$previousCredit = $row['credit'];


$viewedSolution = $row['viewedSolution'] == '1';
$valid = 1;
if ($viewedSolution){
    $valid = 0;
}

if ($attemptAggregation == 'm'){
// Find previous credit if maximizing scores
// Update credit in the database if it's larger
$credit_for_item = MAX($previousCredit,$credit);
}else if ($attemptAggregation == 'l'){
    $credit_for_item = $credit;
}

// if ($result->num_rows < 1){
//     //Store credit for item that was not initiated
//     $sql = "INSERT INTO user_assignment_attempt_item
//     (doenetId,contentId,userId,attemptNumber,itemNumber,credit)
//     VALUES
//     ('$doenetId','$contentId','$userId','$attemptNumber','$itemNumber','$credit_for_item')
//     ";
// $result = $conn->query($sql);

// }else{

if ($valid){
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
}


// }

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
$row = $result->fetch_assoc();
$submissionNumber = $row['submissionNumber'];

if ($submissionNumber < 1){ $submissionNumber = 0; }
$submissionNumber++;
//Insert item submission 
//Specifically we want to store the credit of that actual submission
$sql = "
INSERT INTO user_assignment_attempt_item_submission
(doenetId,contentId,userId,attemptNumber,itemNumber,submissionNumber,stateVariables,credit,submittedDate,valid)
VALUES
('$doenetId','$contentId','$userId','$attemptNumber','$itemNumber','$submissionNumber','$stateVariables','$credit',NOW(),'$valid')
";

$result = $conn->query($sql);


if ($valid){

// //**update user_assignment_attempt for the content

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

//Test if item is stored in user_assignment_attempt
$sql = "SELECT doenetId
        FROM user_assignment_attempt
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND contentId = '$contentId'
        AND attemptNumber = '$attemptNumber'
        ";
$result = $conn->query($sql);
if ($result->num_rows < 1){
    $sql = "INSERT INTO user_assignment_attempt
    (doenetId,contentId,userId,attemptNumber,credit)
    VALUES
    ('$doenetId','$contentId','$userId','$attemptNumber','$credit_for_item')
    ";

    $result = $conn->query($sql);
}else{
    // Store credit in user_assignment_attempt
$sql = "UPDATE user_assignment_attempt
        SET credit='$credit_for_attempt'
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND contentId = '$contentId'
        AND attemptNumber = '$attemptNumber'
        ";
$result = $conn->query($sql);
}


$sql = "SELECT doenetId
        FROM user_assignment
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND contentId = '$contentId'
        ";
$result = $conn->query($sql);
$USER_ASSIGNMENT_HAS_AN_ENTRY = TRUE;
if ($result->num_rows < 1){
    $USER_ASSIGNMENT_HAS_AN_ENTRY = FALSE;
}
// echo "USER_ASSIGNMENT_HAS_AN_ENTRY $USER_ASSIGNMENT_HAS_AN_ENTRY\n";
// var_dump($USER_ASSIGNMENT_HAS_AN_ENTRY);
//**update user_assignment with new score


//Find maximum credit and maximum creditOverrides on each attempt
$sql = "SELECT MAX(credit) AS maxCredit,
        MAX(creditOverride) AS maxCreditOverride
        FROM user_assignment_attempt
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND contentId = '$contentId'
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

$max_credit_for_assignment = MAX($credit_for_attempt,$row['maxCredit'], $row['maxCreditOverride']);
if ($USER_ASSIGNMENT_HAS_AN_ENTRY){
    $sql = "
    UPDATE user_assignment
    SET credit='$max_credit_for_assignment'
    WHERE userId = '$userId'
    AND doenetId = '$doenetId'
    AND contentId = '$contentId'
    ";
$result = $conn->query($sql);
}else{
    $sql = "INSERT INTO user_assignment
    (doenetId,contentId,userId,credit)
    VALUES
    ('$doenetId','$contentId','$userId','$max_credit_for_assignment')
    ";

    $result = $conn->query($sql);
}


}//Close valid test

$response_arr = array(
    "access"=> TRUE,
    "viewedSolution"=>$viewedSolution,
    "valid"=>$valid
);

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>