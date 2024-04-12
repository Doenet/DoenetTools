<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$emailaddress =  mysqli_real_escape_string($conn,$_REQUEST["emailaddress"]);

$deviceNames = include "deviceNames.php";

//Nine digit random number
$signInCode = rand(100000000,999999999);

$sql = "SELECT email, userId
FROM user
WHERE email='$emailaddress'";

$result = $conn->query($sql);

if ($result->num_rows > 0){
    //Already have an email with this account
    $row = $result->fetch_assoc();
    $user_id = $row['userId'];
    //unique deviceName
    //Remove device names which are already in use
    $sql = "
    SELECT deviceName
    FROM user_device
    WHERE userId='$user_id'
    ";

    $result = $conn->query($sql);
    $used_deviceNames = array();
    while($row = $result->fetch_assoc()){
    array_push($used_deviceNames,$row['deviceName']);
    }
    $deviceNames = array_values(array_diff($deviceNames,$used_deviceNames));
    if (count($deviceNames) < 1){
    //Ran out of device names
    $deviceName = include 'randomId.php';
    }else{
    //Pick from what is left
    $randomNumber = rand(0,(count($deviceNames) - 1));
    $deviceName = $deviceNames[$randomNumber];
    }


}else{
    //New email address
    $user_id = include "randomId.php";
    $sql = "INSERT INTO user (userId,email) VALUE ('$user_id','$emailaddress')";
    $result = $conn->query($sql);
    //Define device name
    $randomNumber = rand(0,(count($deviceNames) - 1));
    $deviceName = $deviceNames[$randomNumber];
}
$sql = "INSERT INTO user_device (userId,email,signInCode,timestampOfSignInCode, deviceName)
    VALUE ('$user_id','$emailaddress','$signInCode',NOW(),'$deviceName')";
    $result = $conn->query($sql);


// Generate and modify email content
$htmlContent = file_get_contents("signInEmail.html");
$htmlContent = str_replace(array("deviceName", "signInCode"), array($deviceName, $signInCode), $htmlContent);

$from = 'noreply@doenet.org';
$fromName = 'Doenet Accounts';
$subject = 'Sign-In Request';

// Set content-type header for sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= 'From: '.$fromName.'<'.$from.'>' . "\r\n";

//SEND EMAIL WITH CODE HERE
mail($emailaddress,$subject,$htmlContent, $headers);

$response_arr = array(
    "success" => 1,
    "deviceName" => $deviceName,
    );

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);


$conn->close();

