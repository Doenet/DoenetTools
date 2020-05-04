<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";
// $_PUT = json_decode(file_get_contents("php://input"),true);

$changeField = mysqli_real_escape_string($conn, $_REQUEST["changeField"]);
$toValue = mysqli_real_escape_string($conn, $_REQUEST["toValue"]);

$changeableStrings = array("email", "lastName", "firstName", "profilePicture", "bio");
$changeableInts = array("trackingConsent","roleStudent", "roleInstructor", "roleCourseDesigner", "roleWatchdog", "roleCommunityTA", "roleLiveDataCommunity");
$possiblePictures = array(
    "bird",
    "cat",
    "dog",
    "emu",
    "fox",
    "horse",
    "penguin",
    "squirrel",
    "swan",
    "turtle"
);

if (in_array($changeField, $changeableStrings)) {
    if (!is_string($toValue)) {
        http_response_code(400);
        echo "Invalid `toValue`: $toValue, must be string for $changeField.";
        $conn->close();
        return;
    }

    if ($changeField === "profilePicture" && !in_array($toValue, $possiblePictures)) {
        http_response_code(400);
        echo "Invalid `toValue`: $toValue for `profilePicture`, must be one of: " . implode(", ", $possiblePictures) . ".";
        $conn->close();
        return;
    }
} else if (in_array($changeField, $changeableInts)) {
    if (!ctype_digit($toValue)) {
        http_response_code(400);
        echo "Invalid `toValue`: $toValue, must be int (1|0) for $changeField.";
        $conn->close();
        return;
    }

    $toValue = (int)$toValue;
} else {
    http_response_code(400);
    echo "Invalid `changeField`";
    $conn->close();
    return;
}
// at this point we know that the field is valid and the value is of the right type
// TODO: more data validation???

$sql = "UPDATE user
        SET $changeField = '$toValue'
        WHERE username = '$remoteuser'";


$result = $conn->query($sql);

if ($result === TRUE) {
    include "loadMyProfile.php";

    // the rest will be handled by loadMyProfile
    return;
}else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
