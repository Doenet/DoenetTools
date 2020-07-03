<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$emailaddress =  mysqli_real_escape_string($conn,$_REQUEST["emailaddress"]);  
$nineCode =  mysqli_real_escape_string($conn,$_REQUEST["nineCode"]);  

//Check if expired
$sql = "SELECT TIMESTAMPDIFF(MINUTE, timestampOfSignInCode, NOW()) AS minutes 
FROM user 
WHERE email='$emailaddress'";

$result = $conn->query($sql);
$row = $result->fetch_assoc();

//Assume success and it already exists
$response_arr = array(
"success" => 1,
"existed" => 1,
);

//Check if it took longer than 10 minutes to enter the code
if ($row['minutes'] > 10){
    $response_arr = array(
    "success" => 0,
    "reason" => "Code expired",
    );
}else{

    $sql = "SELECT signInCode AS nineCode FROM user WHERE email='$emailaddress'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    var_dump($row);
    if ($row["nineCode"] != $nineCode){
        $response_arr = array(
        "success" => 0,
        "reason" => "Invalid Code",
        );
    }else{
        //Valid code and not expired
        //Test if it's a new account

        //** if new account */

        // New Account!
// $response_arr = array(
// "success" => 1,
// "existed" => 0,
// );

// Make a new profile
// Random screen name
// Random profile picture

    }
    

}









http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

