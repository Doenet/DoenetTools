<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$emailaddress =  mysqli_real_escape_string($conn,$_REQUEST["emailaddress"]);  
$nineCode =  mysqli_real_escape_string($conn,$_REQUEST["nineCode"]);  

$sql = "SELECT screenName, email, lastName, firstName, profilePicture, trackingConsent, roleStudent, roleInstructor, roleCourseDesigner, roleWatchdog, roleCommunityTA, roleLiveDataCommunity
        FROM user
        WHERE email = '$emailaddress' AND signInCode = '$nineCode'";

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
    "roleStudent" => array("Chooser", "Course", "Profile"),
    "roleInstructor" => array("Chooser", "Course", "Documentation", "Gradebook", "Profile"),
    "roleCourseDesigner" => array("Chooser", "Course", "Documentation", "Profile"),
    "roleWatchdog" => array(/*???*/"Profile"),
    "roleCommunityTA" => array(/*???*/"Profile"),
    "roleLiveDataCommunity" => array(/*???*/"Profile")
  );
  
  $toolAccessList = [];

    foreach ($profile as $key => $value) {
       if ($roleAccessList[$key] != NULL){
        $toolAccessList = array_values(array_unique(array_merge($toolAccessList, $roleAccessList[$key])));
       }
    }

  $profile["toolAccess"] = $toolAccessList;

    $response_arr = array("success" => "1",
                          "profile" => $profile);
    
}
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);

$conn->close();

