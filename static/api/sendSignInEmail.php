<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$emailaddress =  mysqli_real_escape_string($conn,$_REQUEST["emailaddress"]);  

//Nine digit random number
$randomNumber = rand(100000000,999999999);

$sql = "SELECT email
FROM user
WHERE email='$emailaddress'";

$result = $conn->query($sql);

if ($result->num_rows > 0){
    //Already have this email address
    $sql = "UPDATE user SET signInCode='$randomNumber', timestampOfSignInCode=NOW() WHERE email = '$emailaddress'";
}else{
    //New email address
    $sql = "INSERT INTO user (email,signInCode,timestampOfSignInCode) VALUE ('$emailaddress','$randomNumber',NOW())";
}
$result = $conn->query($sql);

//SEND EMAIL WITH CODE HERE
mail($emailaddress,"Doenet Signin","You're code is: $randomNumber");

// set response code - 200 OK
http_response_code(200);


$conn->close();

