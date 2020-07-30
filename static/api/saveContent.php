<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');
include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$response_arr = array(
    "access"=> TRUE
);


$_POST = json_decode(file_get_contents("php://input"),true);
$title =  mysqli_real_escape_string($conn,$_POST["title"]);
$doenetML = mysqli_real_escape_string($conn,$_POST["doenetML"]);
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]);
$branchId = mysqli_real_escape_string($conn,$_POST["branchId"]);
$publish = mysqli_real_escape_string($conn,$_POST["publish"]);

//SECURITY TEST
if ($userId == ""){
    //SECURITY 1
    //Test if signed in

$response_arr = array(
    "access"=> FALSE,
    "reason"=> "Not signed in"
);

}else{
    //SECURITY 2
    $HAVE_ACCESS = TRUE; //Assume they have access
    //Test if they are part of a repo
    $sql = "SELECT ra.userId as userId
    FROM folder_content AS fc
    LEFT JOIN repo_access AS ra
    ON fc.rootId = ra.repoId
    WHERE fc.childId = '$branchId' 
    AND ra.userId = '$userId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows < 1){
    //SECURITY 3
    //TEST if the branch is not in a repo and is user's
    $sql = "
    SELECT userId 
    FROM user_content
    WHERE userId = '$userId'
    AND branchId = '$branchId'
    ";
    $result = $conn->query($sql);
        if ($result->num_rows < 1){
            $response_arr = array(
                "access"=> FALSE,
                "reason"=> "No access to content"
            );
            $HAVE_ACCESS = FALSE;
        } 
    }


    if ($HAVE_ACCESS){
            
            
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
    
}





    // set response code - 200 OK
    http_response_code(200);

 echo json_encode($response_arr);

$conn->close();
?>