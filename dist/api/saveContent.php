<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');
include "db_connection.php";

$response_arr = array(
    "access"=> TRUE
);

//prerelease security
$sql = "SELECT adminAccessAllowed FROM user WHERE username='$remoteuser'";
$result = $conn->query($sql); 
$row = $result->fetch_assoc();
if ($row["adminAccessAllowed"] != 1){
	$response_arr = array(
		"access"=> FALSE
    );
    
} else {


$_POST = json_decode(file_get_contents("php://input"),true);
$title =  mysqli_real_escape_string($conn,$_POST["title"]);
$doenetML = mysqli_real_escape_string($conn,$_POST["doenetML"]);
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]);
$branchId = mysqli_real_escape_string($conn,$_POST["branchId"]);
$publish = mysqli_real_escape_string($conn,$_POST["publish"]);

//TEST if branch exists
$sql = "
SELECT id
FROM content_branch
WHERE branchId = '$branchId'
";
$result = $conn->query($sql); 
if ($result->num_rows < 1){
    //No previous information on this branch so store it
    $sql = "
    INSERT INTO content_branch
    (branchId,title,doenetML,updateDate,creationDate,latestContentId)
    VALUES
    ('$branchId','$title','$doenetML',NOW(),NOW(),'$contentId')
    ";
    $result = $conn->query($sql); 
}

//TEST if draft exists 
$sql = "
SELECT id
FROM content
WHERE branchId = '$branchId' AND draft=1
";
$result = $conn->query($sql); 
if ($result->num_rows < 1){
    //No information on this branch so store it
    $sql = "
    INSERT INTO content
    (doenetML,branchId,title,contentId,timestamp,draft)
    VALUES
    ('$doenetML','$branchId','$title','$contentId',NOW(),1)
    ";
    $result = $conn->query($sql); 
}

//Update content draft
$sql = "
UPDATE content
SET title='$title',
doenetML='$doenetML',
contentId='$contentId',
timestamp=NOW()
WHERE branchId='$branchId' AND draft=1 
";
$result = $conn->query($sql); 

if ($publish){
    //Insert content as published version (not draft)
    $sql = "
    INSERT INTO content
    (doenetML,branchId,title,contentId,timestamp,draft)
    VALUES
    ('$doenetML','$branchId','$title','$contentId',NOW(),0)
    ";
    $result = $conn->query($sql); 
    //Update doenetML, title, latestContentId cell and updateDate for branchId
    $sql = "
    UPDATE content_branch
    SET title='$title',
    doenetML='$doenetML',
    updateDate=NOW(),
    latestContentId='$contentId'
    WHERE branchId='$branchId' 
    ";
    $result = $conn->query($sql); 
}
}

    // set response code - 200 OK
    http_response_code(200);

 echo json_encode($response_arr);

$conn->close();
?>