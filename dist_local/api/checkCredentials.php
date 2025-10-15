<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$emailaddress =  mysqli_real_escape_string($conn,$_REQUEST["emailaddress"]);  
$nineCode =  mysqli_real_escape_string($conn,$_REQUEST["nineCode"]);  
$deviceName =  mysqli_real_escape_string($conn,$_REQUEST["deviceName"]);  

//Check if expired
$sql = "SELECT TIMESTAMPDIFF(MINUTE, timestampOfSignInCode, NOW()) AS minutes 
FROM user_device 
WHERE email='$emailaddress' AND deviceName='$deviceName'";

$result = $conn->query($sql);
$row = $result->fetch_assoc();

//Assume success and it already exists


$success = 1;
$existed = 1;
$hasFullName = 0;
$reason = "";

//Check if it took longer than 10 minutes to enter the code
if ($row['minutes'] > 10){
    $success = 0;
    $reason = "Code expired";
}else{

    $sql = "SELECT signInCode AS nineCode 
    FROM user_device 
    WHERE email='$emailaddress' AND deviceName='$deviceName'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();

    if ($row["nineCode"] != $nineCode){
        $success = 0;
        $reason = "Invalid Code";
       
    }else{
        //Valid code and not expired

        //Update signedIn on user_device table
        $sql = "UPDATE user_device 
        SET signedIn='1' 
        WHERE email='$emailaddress' AND deviceName='$deviceName'";
        $result = $conn->query($sql);

        //Test if it's a new account

        $sql = "SELECT firstName,lastName, screenName 
        FROM user 
        WHERE email='$emailaddress'
        ";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();

        if ($row["firstName"] != "" && $row["lastName"] != ""){
            $hasFullName = 1;
        }
        
        //Only new accounts won't have a screen name
        if ($row["screenName"] === null){
        // New Account!
        $existed = 0;

        // Make a new profile
        // Random screen name
        $screen_names = include 'screenNames.php';
        $randomNumber = rand(0,(count($screen_names) - 1));
        $screen_name = $screen_names[$randomNumber];

        // Random profile picture
        $profile_pics = include 'profilePics.php';
        $randomNumber = rand(0,(count($profile_pics) - 1));
        $profile_pic = $profile_pics[$randomNumber];
        // Store screen name and profile picture
        $sql = "UPDATE user SET screenName='$screen_name',profilePicture='$profile_pic' WHERE email='$emailaddress' ";
        $result = $conn->query($sql);
    }



    }
    

}


$response_arr = array(
    "success" => $success,
    "existed" => $existed,
    "hasFullName" => $hasFullName,
    "reason" => $reason,
    );

http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

