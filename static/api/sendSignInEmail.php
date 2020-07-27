<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$emailaddress =  mysqli_real_escape_string($conn,$_REQUEST["emailaddress"]);  

$deviceNames = include "deviceNames.php";
$randomNumber = rand(0,(count($deviceNames) - 1));
$deviceName = $deviceNames[$randomNumber];


//TODO: Make sure deviceName is unique

//Nine digit random number
$signInCode = rand(100000000,999999999);

$sql = "SELECT email, id
FROM user
WHERE email='$emailaddress'";

$result = $conn->query($sql);

if ($result->num_rows > 0){
    $row = $result->fetch_assoc();
    $user_id = $row['userId'];

}else{
    //New email address
    $user_id = include "randomId.php";
    $sql = "INSERT INTO user (userId,email) VALUE ('$user_id','$emailaddress')";
    $result = $conn->query($sql);
}
$sql = "INSERT INTO user_device (userId,email,signInCode,timestampOfSignInCode, deviceName) 
    VALUE ('$user_id','$emailaddress','$signInCode',NOW(),'$deviceName')";
    $result = $conn->query($sql);

//SEND EMAIL WITH CODE HERE
mail($emailaddress,"Doenet Signin","Your code is: $signInCode on device $deviceName.");

$response_arr = array(
    "success" => 1,
    "deviceName" => $deviceName,
    );

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);


$conn->close();

