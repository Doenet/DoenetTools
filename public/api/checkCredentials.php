<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "baseModel.php";

$emailaddress =  mysqli_real_escape_string($conn,$_REQUEST["emailaddress"]);  
$nineCode =  mysqli_real_escape_string($conn,$_REQUEST["nineCode"]);  
$deviceName =  mysqli_real_escape_string($conn,$_REQUEST["deviceName"]);  

$response_arr;
try {
    Base_Model::checkForRequiredInputs($_REQUEST,["emailaddress","nineCode","deviceName"]);

    //Check if expired
    $sql = "SELECT TIMESTAMPDIFF(MINUTE, timestampOfSignInCode, NOW()) AS minutes 
    FROM user_device 
    WHERE email='$emailaddress' AND deviceName='$deviceName'
    ORDER BY timestampOfSignInCode DESC
    LIMIT 1
    ";

    $result = $conn->query($sql);
    $row = $result->fetch_assoc();

    //Assume it already exists
    $existed = true;
    $hasFullName = false;
    $reason = "";

    // throw new Exception("Code expired"); //DELETE ME!!!


    //Check if it took longer than 10 minutes to enter the code
    if ($row['minutes'] > 10){
        throw new Exception("Code expired");
    }

    //Only the most recent one
    $sql = "SELECT signInCode AS nineCode 
    FROM user_device 
    WHERE email='$emailaddress' AND deviceName='$deviceName'
    ORDER BY timestampOfSignInCode DESC
    LIMIT 1
    ";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();

    if ($row["nineCode"] != $nineCode){
        throw new Exception("Invalid Code");
    }
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
            $hasFullName = true;
        }
        
        //Only new accounts won't have a screen name
        if ($row["screenName"] === null){
        // New Account!
        $existed = false;

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

        $sql = "SELECT c.courseId
        FROM course AS c
        LEFT JOIN user AS u
        ON u.userId = c.portfolioCourseForUserId
        WHERE u.email = '$emailaddress'";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $portfolioCourseId = "not_created";
        if ($result->num_rows > 0) {
            $portfolioCourseId = $row['courseId'];
        }

$response_arr = array(
    "success" => true,
    "existed" => $existed,
    "hasFullName" => $hasFullName,
    "portfolioCourseId" => $portfolioCourseId,
    );

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
?>
