<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$potentialRoles = ["roleStudent", "roleInstructor", "roleCourseDesigner", "roleWatchdog", "roleCommunityTA", "roleLiveDataCommunity"];

$sql = "SELECT username, email, accessAllowed, adminAccessAllowed, studentId, lastName, firstName, profilePicture, bio, trackingConsent, roleStudent, roleInstructor, roleCourseDesigner, roleWatchdog, roleCommunityTA, roleLiveDataCommunity
        FROM user
        WHERE username = '$remoteuser'";

$result = $conn->query($sql);
$response_arr = array();


if ($result->num_rows > 0){
    // set response code - 200 OK
    http_response_code(200);

    $responseRow = $result->fetch_assoc();
    $roles = [];
    for ($i=0; $i < count($potentialRoles); $i++) { 
        if ($responseRow[$potentialRoles[$i]]) {
            array_push($roles, $potentialRoles[$i]);
        }
    }

    include "roles.php";
    $responseRow["toolAccess"] = $toolAccessList;

    // make it json format
    echo json_encode($responseRow);
} else {
    http_response_code(500);
    echo "Internal Server Error";
}


$conn->close();

