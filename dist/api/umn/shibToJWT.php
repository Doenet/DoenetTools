<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

use \Firebase\JWT\JWT;
require_once "../vendor/autoload.php";

$jwtArray = include '../jwtArray.php';
$userId = $jwtArray['userId'];

$firstName = $_SERVER['givenName'];
$lastName = $_SERVER['surname'];
$email = $_SERVER['mail'];
$success = TRUE;
$needToClearOutPreviousUser = TRUE;

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);

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
      if($dbUserId == $userId){
        $needToClearOutPreviousUser = FALSE;
      }
    }

  if ($needToClearOutPreviousUser){
    //Need to clear out previous sign in
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
    $expirationTime = -3600;

    setcookie("JWT", "", $expirationTime, "/", $domain, $isSecure, $isHttpOnly);
    setcookie("JWT_JS", "", $expirationTime, "/", $domain, $isSecure, false);
  }

  if (!$hasDoenetAccount){
    //Create a Doenet Acct
    $dbUserId = include '../randomId.php';

    // Random screen name
    $screen_names = include '../screenNames.php';
    $randomNumber = rand(0, count($screen_names) - 1);
    $newScreenName = $screen_names[$randomNumber];

    // Random profile picture
    $profile_pics = include '../profilePics.php';
    $randomNumber = rand(0, count($profile_pics) - 1);
    $newProfilePicture = $profile_pics[$randomNumber];

    $result = $conn->query(
      "INSERT INTO user
      SET 
          userId = '$dbUserId',
          email = '$email',
          firstName = '$firstName',
          lastName = '$lastName',
          screenName = '$newScreenName',
          profilePicture = '$newProfilePicture'"
  );

  }

  if ($needToClearOutPreviousUser){
    //Sign in JWT cookie
    $deviceNames = include "../deviceNames.php";
    $randomNumber = rand(0,(count($deviceNames) - 1));
    $deviceName = $deviceNames[$randomNumber];

    $expirationTime = 0;

    $payload = [
        'userId' => $dbUserId,
        'deviceName' => $deviceName,
    ];
    $jwt = JWT::encode($payload, $key);

    $sql = "INSERT INTO user_device 
    (userId,email,timestampOfSignInCode,deviceName,SignedIn)
    VALUES
    ('$dbUserId','$email',NOW(),'$deviceName','1')";
   // ON DUPLICATE KEY UPDATE 
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

$isEnrolled = FALSE;
//Enroll if not enrolled
if ($success){
  //Check course for autoenrollment
  $sql = "
  SELECT c.canAutoEnroll, cc.courseId, c.defaultRoleId
  FROM course_content AS cc
  INNER JOIN course AS c
  ON c.courseId = cc.courseId
  WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $canAutoEnroll = $row['canAutoEnroll'];
    $courseId = $row['courseId'];
    $defaultRoleId = $row['defaultRoleId'];
    
    //Check if they are enrolled
    $sql = "
    SELECT userId
    FROM course_user 
    WHERE userId = '$dbUserId'
    AND courseId = '$courseId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows == 0) {
      if ($canAutoEnroll == '1'){
        //Enroll the student
        $sql = "
        INSERT INTO course_user
        (courseId,userId,dateEnrolled,roleId)
        VALUES
        ('$courseId','$dbUserId',NOW(),'$defaultRoleId')
      ";
      $result = $conn->query($sql);
      $isEnrolled = TRUE;
      }
      

    }else{
      $isEnrolled = TRUE;
    }
      
  }
}

  

$response_arr = [
  'success' => $success,
  'needToClearOutPreviousUser' => $needToClearOutPreviousUser,
  'isEnrolled' => $isEnrolled,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
