<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include '../db_connection.php';

$jwtArray = include '../jwtArray.php';
$userId = $jwtArray['userId'];

$firstName = $_SERVER['givenName'];
$lastName = $_SERVER['surname'];
$email = $_SERVER['mail'];
$success = TRUE;
$needToClearOutPreviousUser = FALSE;

if ($email == ''){
  $success = FALSE;
}

if ($success){
  //Check if there is a user with $email
  $sql = "
  SELECT userId
  FROM user
  WHERE email='$email'
  ";
  $dbUserId = '';
  $hasDoenetAccount = FALSE;

  $result = $conn->query($sql);
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $dbUserId = $row['userId'];
      $hasDoenetAccount = TRUE;
      if ($dbUserId != $userId){
        //Need to clear out previous sign in
        $needToClearOutPreviousUser = TRUE;
      }
    }

  if (!$hasDoenetAccount){
    //Create a Doenet Acct
    $dbUserId = include '../randomId.php';
    $sql = "INSERT INTO user (userId,email) VALUE ('$dbUserId','$email')";
    $result = $conn->query($sql);
  }

  if ($dbUserId != $userId){
    //Sign in JWT cookie
    $deviceNames = include "../deviceNames.php";
    $randomNumber = rand(0,(count($deviceNames) - 1));
    $deviceName = $deviceNames[$randomNumber];

    $expirationTime = 0;
    if ($stay == 1) {
        $expirationTime = 2147483647;
    }

    $payload = [
        'userId' => $userId,
        'deviceName' => $deviceName,
    ];
    $jwt = JWT::encode($payload, $key);

    $sql = "UPDATE user_device
    SET signedIn = '1'
    WHERE userId='$userId' AND deviceName='$deviceName'";
    $result = $conn->query($sql);

    $value = $jwt;

    $path = '/';
    $domain = $_SERVER["SERVER_NAME"];
    if ($domain == 'apache'){$domain = 'localhost';}
    $isSecure = true;
    if ($domain == 'apache') {
        $domain = 'localhost';
    }
    if ($domain == 'localhost') {
        $isSecure = false;
    }
    $isHttpOnly = true;
    setcookie(
        'JWT',
        $value,
        $expirationTime,
        $path,
        $domain,
        $isSecure,
        $isHttpOnly
    );
    setcookie(
        'JWT_JS',
        1,
        $expirationTime,
        $path,
        $domain,
        $isSecure,
        false
    );
  }
}
  

$response_arr = [
  'success' => $success,
  'needToClearOutPreviousUser' => $needToClearOutPreviousUser,
  'dbUserId' => $dbUserId
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
