<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "baseModel.php";

$emailaddress =  mysqli_real_escape_string($conn,$_REQUEST["emailaddress"]);
$deviceName =  mysqli_real_escape_string($conn,$_REQUEST["deviceName"]);


$response_arr;
try {
    Base_Model::checkForRequiredInputs($_REQUEST,["emailaddress"]);

    //Create a nine digit random number
    $signInCode = rand(100000000,999999999);

    //Do we have an account with this email?
    $sql = "SELECT email, userId
    FROM user
    WHERE email='$emailaddress'";

    $userEmailArray = Base_Model::queryFetchAssoc($conn, $sql);
    if (count($userEmailArray) < 1){
        //We need an account created
        $user_id = include "randomId.php";
        $sql = "INSERT INTO user (userId,email) VALUE ('$user_id','$emailaddress')";
        Base_Model::runQuery($conn,$sql);
    }else{
        $user_id = $userEmailArray['userId'][0];
    }

    if (array_key_exists("deviceName",$_REQUEST)){
        //Already have a device name
        //Just update the signInCode and timestampOfSignInCode 
        //of the latest entry of that device name
        $sql = "UPDATE user_device
        SET signInCode = '$signInCode', timestampOfSignInCode = NOW()
        WHERE (userId, email, deviceName, timestampOfSignInCode) = (
            SELECT userId, email, deviceName, MAX(timestampOfSignInCode)
            FROM (
                SELECT * FROM user_device
            ) AS temp
            WHERE userId = '$user_id' AND email = '$emailaddress' AND deviceName = '$deviceName'
        )
        ";
        Base_Model::runQuery($conn,$sql);

    }else{
        //Select a device name 
        $deviceNames = include "deviceNames.php";
        //In order to maintain unique deviceNames
        //remove device names which are already in use
        $sql = "
        SELECT deviceName
        FROM user_device
        WHERE userId='$user_id'
        AND signedIn=1
        ";

        $devicesArray = Base_Model::queryFetchAssoc($conn, $sql);
        $used_deviceNames = $devicesArray['deviceName'] != null ? $devicesArray['deviceName'] : [];
    
        $deviceNames = array_values(array_diff($deviceNames,$used_deviceNames));
        if (count($deviceNames) < 1){
        //Ran out of device names
        $deviceName = include 'randomId.php';
        }else{
        //Pick from what is left
        $randomNumber = rand(0,(count($deviceNames) - 1));
        $deviceName = $deviceNames[$randomNumber];
        }

        //Insert the device with the code so a user with the right code can sign in
        $sql = "INSERT INTO user_device (userId,email,signInCode,timestampOfSignInCode, deviceName)
        VALUE ('$user_id','$emailaddress','$signInCode',NOW(),'$deviceName')";
        Base_Model::runQuery($conn,$sql);
    }
    


    // Generate and modify email content
    $htmlContent = file_get_contents("signInEmail.html");
    $htmlContent = str_replace(array("signInCode"), array($signInCode), $htmlContent);

    $from = 'noreply@doenet.org';
    $fromName = 'Doenet Accounts';
    $subject = 'Sign-In Request';

    // Set content-type header for sending HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: '.$fromName.'<'.$from.'>' . "\r\n";

    //SEND EMAIL WITH CODE HERE
    $mailSuccess = mail($emailaddress,$subject,$htmlContent, $headers);

    if (!$mailSuccess && $mode != 'development'){
        throw new Exception("Sending Email Failed.");
    }

$response_arr = [
    'success' => true,
    "deviceName" => $deviceName,
    ];

    http_response_code(200);

} catch (Exception $e) {
    $response_arr = [
        'success' => false,
        'message' => $e->getMessage(),
    ];
    http_response_code(400);

} finally {
    // make it json format
    echo json_encode($response_arr);
    $conn->close();
}

