<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

function storeData($conn,$courseId,$info,$hOrder,$headingLevel){
foreach ($info["headingsOrder"] as $array){
$headingId = mysqli_real_escape_string($conn,$array["courseHeadingId"]);
$headingText = mysqli_real_escape_string($conn,$array["headingText"]);
//echo ">>>>HEAD $headingId $headingText\n";
//test if heading with this id exists
$sql = "
SELECT id
FROM course_heading
WHERE courseHeadingId = '$headingId';
";
$result = $conn->query($sql);
if ($result->num_rows > 0){
//update heading
//echo "UPDATE level $headingLevel\n";
$sql = "
UPDATE course_heading
SET headingLevel='$headingLevel',
sortOrder='$hOrder'
WHERE courseHeadingId = '$headingId'
";
$result = $conn->query($sql);
}else{
//insert heading
$sql = "
INSERT INTO course_heading
(courseHeadingId,headingText,courseId,headingLevel,sortOrder)
VALUES
('$headingId','$headingText','$courseId',$headingLevel,$hOrder)
";
$result = $conn->query($sql);
}

//ASSIGNMENTS
$hObj = $info["heading"][$headingId];
//echo "### hObj ###\n";
//var_dump($hObj);
  
$aOrder = 100;
foreach($hObj["assignmentOrder"] as $assignment){
    $assignmentId = mysqli_real_escape_string($conn,$assignment);
    $aInfo = $hObj["assignments"][$assignmentId];
    //echo "### aInfo ###\n";
    //var_dump($aInfo);
    //Is it already stored?
    $branchId = $aInfo["sourceBranchId"];
    $aName = $aInfo["documentName"];
    $gradeCategory = $aInfo["gradeCategory"];
    $totalPointsOrPercent = $aInfo["totalPointsOrPercent"];
    $sql = "
    SELECT contentId
    FROM assignment
    WHERE assignmentId = '$assignmentId';
    ";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();    
    if ($result->num_rows > 0){
    //Update SortOrder of Assignment
    $sql = "
    UPDATE assignment
    SET sortOrder='$aOrder'
    WHERE assignmentId='$assignmentId';
    ";
    $result = $conn->query($sql);
  
    }else{
    //Insert Assignment
    $sql = "
    SELECT
    latestContentId 
    FROM content_branch
    WHERE branchId='$branchId'
    ";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();    
    $contentId = $row['latestContentId'];
    $sql = "
    INSERT INTO assignment
    (assignmentId,courseHeadingId,assignmentName,sourceBranchId,contentId,courseId,creationDate,sortOrder,gradeCategory, totalPointsOrPercent)
    VALUES
    ('$assignmentId','$headingId','$aName','$branchId','$contentId','$courseId',NOW(),$aOrder,'$gradeCategory','$totalPointsOrPercent')
    "; 
    $result = $conn->query($sql);
    }
    $aOrder = $aOrder + 100;
  }


$hOrder = $hOrder + 100;
if ($info["heading"][$headingId] !== NULL){
  $hOrder = storeData($conn,$courseId,$info["heading"][$headingId],$hOrder,$headingLevel+1);
}


//  echo "---- END heading ----\n";
}
return $hOrder;
}

include "db_connection.php";


$_POST = json_decode(file_get_contents("php://input"),true);
$courseId = mysqli_real_escape_string($conn,$_POST["courseId"]);


storeData($conn,$courseId,$_POST["courseInfo"],100,1);


// set response code - 200 OK
http_response_code(200);


$conn->close();


?>

