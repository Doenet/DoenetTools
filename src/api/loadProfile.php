<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$sql = "SELECT screenName, email, lastName, firstName, profilePicture, trackingConsent, roleStudent, roleInstructor, roleCourseDesigner, roleWatchdog, roleCommunityTA, roleLiveDataCommunity
        FROM user
        WHERE userId = '$userId'";

$result = $conn->query($sql);
$response_arr = array("success" => "0");


if ($result->num_rows > 0){

    $row = $result->fetch_assoc();
    $profile = array(
        "screenName" => $row['screenName'],
        "email" => $row['email'],
        "firstName" => $row['firstName'],
        "lastName" => $row['lastName'],
        "profilePicture" => $row['profilePicture'],
        "trackingConsent" => $row['trackingConsent'],
        "roleStudent" => $row['roleStudent'],
        "roleInstructor" => $row['roleInstructor'],
        "roleCourseDesigner" => $row['roleCourseDesigner'],
        "roleWatchdog" => $row['roleWatchdog'],
        "roleCommunityTA" => $row['roleCommunityTA'],
        "roleLiveDataCommunity" => $row['roleLiveDataCommunity'],
);
$roleAccessList = array(
    "roleStudent" => array("Chooser", "Course"),
    "roleInstructor" => array("Chooser", "Course", "Documentation", "Gradebook"),
    "roleCourseDesigner" => array("Chooser", "Course", "Documentation"),
    "roleWatchdog" => array(/*???*/),
    "roleCommunityTA" => array(/*???*/),
    "roleLiveDataCommunity" => array(/*???*/)
  );
  
  $toolAccessList = [];

    foreach ($profile as $key => $value) {
       if ($roleAccessList[$key] != NULL && $value == 1){
      $toolAccessList = array_values(array_unique(array_merge($toolAccessList, $roleAccessList[$key])));
       }
    }

  $profile["toolAccess"] = $toolAccessList;

    $response_arr = array("success" => "1",
                          "profile" => $profile);
    
}else{
  //Send back not signed in profile
  $toolAccessList = array("Chooser", "Course", "Documentation");
  $profile = array(
    "screenName" => "anonymous",
    "email" => "",
    "firstName" => "",
    "lastName" => "",
    "profilePicture" => "anonymous",
    "trackingConsent" => true,
    "roleStudent" => "0",
    "roleInstructor" => "0",
    "roleCourseDesigner" => "0",
    "roleWatchdog" => "0",
    "roleCommunityTA" => "0",
    "roleLiveDataCommunity" => "0"
);
$profile["toolAccess"] = array("Chooser", "Course", "Documentation");
$response_arr = array("success" => "1",
                          "profile" => $profile);
}
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();
