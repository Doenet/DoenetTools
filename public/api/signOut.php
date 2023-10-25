<?php

// ***************
//Clear all cookies
// ***************


if (isset($_SERVER['HTTP_COOKIE'])) {
  $domain = $_SERVER["SERVER_NAME"];
  if ($domain == 'apache'){$domain = 'localhost';}

  // Split multiple cookies
  $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
  // Loop through the cookies
  foreach($cookies as $cookie) {
      // Get the name of the cookie
      $parts = explode('=', $cookie);
      $name = trim($parts[0]);
      // Set the cookie to expire one hour ago
      $success = setcookie($name, '', time()-3600, '/', $domain);
      //Stop the script if deleting a cookie fails
      if (!$success){
        //TODO" Log errors here
        exit;
      }
  }
}



// setcookie("JWT", "", time()-3600, "/", $domain, false, true);
// setcookie("JWT_JS", "", time()-3600, "/", $domain, false, false);

// ***************
//Update database
// ***************

include "db_connection.php";
include "baseModel.php";

$jwtArray = include "jwtArray.php";
$device = $jwtArray['deviceName'];
$userId = $jwtArray['userId'];
if ($userId != "" && $device != ""){
  $sql = "UPDATE user_device
          SET signedIn='0'
          WHERE userId='$userId' AND deviceName = '$device'";
  Base_Model::runQuery($conn,$sql);
}

var_dump($cookies);

?>

