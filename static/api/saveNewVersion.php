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

// $escapedDoenetML = mysqli_real_escape_string($conn,$_POST["doenetML"]);
// $escapedCID = hash('sha256',$escapedDoenetML);
$title =  mysqli_real_escape_string($conn,$_POST["title"]);
$dangerousDoenetML = $_POST["doenetML"];
$branchId = mysqli_real_escape_string($conn,$_POST["branchId"]);
$draft = mysqli_real_escape_string($conn,$_POST["draft"]);

//Add new version to content table
//TODO: Update draft version (Overwrite BranchId named file)

//TODO: Test if we have permission to save to branchId

//save to file as contentid
$contentId = hash('sha256', $dangerousDoenetML);
$response_arr = array(
    "success"=> TRUE,
    "contentId"=> $contentId
);
//Config file needed for server
$newfile = fopen("../media/$contentId", "w") or die("Unable to open file!");
fwrite($newfile, $dangerousDoenetML);
fclose($newfile);


$sql = "INSERT INTO content 
SET branchId='$branchId',
contentId='$contentId', 
title='$title',
timestamp=NOW(),
isDraft='0'
";

$result = $conn->query($sql); 


// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();

?>

