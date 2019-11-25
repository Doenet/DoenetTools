<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";


$_POST = json_decode(file_get_contents("php://input"),true);
$author =  mysqli_real_escape_string($conn,$_POST["author"]);
$title =  mysqli_real_escape_string($conn,$_POST["title"]);
$doenetML = mysqli_real_escape_string($conn,$_POST["doenetML"]);
$contentId = mysqli_real_escape_string($conn,$_POST["contentId"]);
$branchId = mysqli_real_escape_string($conn,$_POST["branchId"]);
$publish = mysqli_real_escape_string($conn,$_POST["publish"]);
$change_title_not_code = mysqli_real_escape_string($conn,$_POST["change_title_not_code"]);
/*
echo $author;
echo "\n";
echo $title;
echo "\n";
echo $doenetML;
echo "\n";
echo $contentId;
echo "\n";
echo $branchId;
echo "\n";
echo $publish;
echo "\n";
*/

//TEST if row exists in content_branch table
// if ($contentId != "" && $branchId != "" && $change_title_not_code){
//     $sql = "
//         UPDATE content
//         SET title='$title',
//         timestamp=NOW()
//         WHERE branchId='$branchId' AND contentId = '$contentId'
//         ";
//     echo"chaning title only !";
//     $result = $conn->query($sql);
//     if ($result === TRUE) {
//         // set response code - 200 OK
//         http_response_code(200);
//     }else {
//         echo "Error: " . $sql . "\n" . $conn->error;
//         }
    
    
//     $conn->close();
//     return;

// }
$sql = "
SELECT id
FROM content_branch
WHERE branchId = '$branchId'
";
if ($contentId != "" && $branchId != ""){
$result = $conn->query($sql); }

if ($result->num_rows < 1){
//No information on this branch so store it
$sql = "
INSERT INTO content_branch
(branchId,title,doenetML,updateDate,creationDate,latestContentId)
VALUES
('$branchId','$title','$doenetML',NOW(),NOW(),'$contentId')
";
echo $sql;
if ($contentId != "" && $branchId != ""){
$result = $conn->query($sql); 
}}

//TEST if draft row exists in the content table
$sql = "
SELECT id
FROM content
WHERE branchId = '$branchId' AND draft=1
";
if ($contentId == "" && $branchId != ""){
$result = $conn->query($sql); }

// if ($result->num_rows < 1){
// //No information on this branch so store it
// $sql = "
// INSERT INTO content
// (doenetML,branchId,title,contentId,timestamp,draft)
// VALUES
// ('$doenetML','$branchId','$title','$contentId',NOW(),1)
// ";
// echo $sql;
// if ($contentId != "" && $branchId != ""){
// $result = $conn->query($sql); 
// }}

//Update content draft
// $sql = "
// UPDATE content
// SET title='$title',
// doenetML='$doenetML',
// contentId='$contentId',
// timestamp=NOW()
// WHERE branchId='$branchId' AND draft=1 
// ";
// echo $sql;
// if ($contentId != "" && $branchId != ""){
// $result = $conn->query($sql); }

if ($publish){
echo "publish!\n";
//Insert content row without draft
$sql = "
INSERT INTO content
(doenetML,branchId,title,contentId,timestamp,draft)
VALUES
('$doenetML','$branchId','$title','$contentId',NOW(),0)
";
echo $sql;
if ($contentId != "" && $branchId != ""){
$result = $conn->query($sql); }
//Update doenetML, title, latestContentId cell and updateDate for branchId
$sql = "
UPDATE content_branch
SET title='$title',
doenetML='$doenetML',
updateDate=NOW(),
latestContentId='$contentId'
WHERE branchId='$branchId' 
";
echo $sql;
if ($contentId != "" && $branchId != ""){
$result = $conn->query($sql); }
}


if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
}else {
    echo "Error: " . $sql . "\n" . $conn->error;
    }


$conn->close();


?>

