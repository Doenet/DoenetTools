<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);

$title =  mysqli_real_escape_string($conn,$_POST["title"]);
$doenetML = mysqli_real_escape_string($conn,$_POST["doenetML"]);
$branchId = mysqli_real_escape_string($conn,$_POST["branchId"]);
$draft = mysqli_real_escape_string($conn,$_POST["draft"]);

var_dump($_POST);
//Add new version to content table
//Update draft version (Overwrite BranchId named file)

//save to file as contentid
$contentId = hash('sha256', $doenetML);
$response_arr = array(
    "success"=> TRUE,
    "contentId"=> $contentId
);
//Config file needed for server
// $newfile = fopen("../media/$contentId", "w") or die("Unable to open file!");
// fwrite($newfile, $doenetML);
// fclose($newfile);


// $sql = "INSERT INTO assignment 
// SET assignmentId='$assignmentId',
// courseHeadingId='$headingId',
// assignmentName='$documentName',
// sourceContentId='$contentId', 
// courseId='$courseId',
// contentRevisionNumber='$latestVersion',
// sortOrder='$sortOrder',
// gradeCategory='$gradeCategory',
// totalPointsOrPercent='$totalPointsOrPercent',
// creationDate=NOW()
// ";

// $result = $conn->query($sql); 


// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();

?>

