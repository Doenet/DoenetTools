<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');

include "db_connection.php";

// Content
$_POST = json_decode(file_get_contents("php://input"),true);
$number_content = count($_POST["contentSeeds"]["contentId"]);

for ($i = 0; $i < $number_content; $i++){
  $branchId = mysqli_real_escape_string($conn,$_POST["contentSeeds"]["branchId"][$i]);
  $title =  mysqli_real_escape_string($conn,$_POST["contentSeeds"]["title"][$i]);
  $doenetML = mysqli_real_escape_string($conn,$_POST["contentSeeds"]["doenetML"][$i]);
  $contentId = mysqli_real_escape_string($conn,$_POST["contentSeeds"]["contentId"][$i]);

  $sql = "
  INSERT INTO content_branch
  (branchId,title,doenetML,updateDate,creationDate,latestContentId)
  VALUES
  ('$branchId','$title','$doenetML',NOW(),NOW(),'$contentId')
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $sql = "
  INSERT INTO content
  (doenetML,branchId,title,contentId,timestamp,draft)
  VALUES
  ('$doenetML','$branchId','$title','$contentId',NOW(),1)
  ";
  echo $sql;
  $result = $conn->query($sql); 
  if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

// Heading
$number_seeds = count($_POST["assignmentSeeds"]);

for ($i = 0; $i < $number_seeds; $i++){

  $headingText =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["headingText"]);
  $courseHeadingId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["courseHeadingId"]);
  $courseId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["courseId"]);
  $headingLevel = mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["headingLevel"]);
  $parentHeadingId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["parentHeadingId"]);

  if ($parentHeadingId == ""){
    //Base level so just find the last sortOrder and increment by 100
    $sql = "SELECT MIN(sortOrder) AS minSortOrder
    FROM course_heading 
    WHERE courseId = '$courseId';";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    //$minSortOrder = mysqli_real_escape_string($conn,$row['minSortOrder']);
    //echo "minSortOrder $minSortOrder\n";

    $sql = "UPDATE course_heading 
    SET sortOrder = sortOrder + 100
    WHERE courseId = '$courseId'";
    $result = $conn->query($sql);

    $sql = "INSERT INTO course_heading SET
    courseHeadingId = '$courseHeadingId',
    headingText = '$headingText',
    courseId = '$courseId',
    headingLevel = '$headingLevel',
    sortOrder = '100'
    ";
    $result = $conn->query($sql);
  }else{
    //has a parent
    $sql = "SELECT sortOrder AS parentSortOrder
    FROM course_heading 
    WHERE courseHeadingId = '$parentHeadingId';";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $parentSortOrder = $row['parentSortOrder'];

    $sql = "UPDATE course_heading 
    SET sortOrder = sortOrder + 100
    WHERE courseId = '$courseId'
    AND sortOrder > '$parentSortOrder'";
    $result = $conn->query($sql);

    $insertSortOrder = $parentSortOrder + 100;
    $sql = "INSERT INTO course_heading SET
    courseHeadingId = '$courseHeadingId',
    headingText = '$headingText',
    courseId = '$courseId',
    headingLevel = '$headingLevel',
    sortOrder = '$insertSortOrder'
    ";
    echo $sql;
    $result = $conn->query($sql);
  }


  if ($result === TRUE) {
      // set response code - 200 OK
      http_response_code(200);
  }else {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $courseId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["courseId"]);
  $number_assignments = count($_POST["assignmentSeeds"][$i]["documentName"]);
  $headingId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["headingId"]);
  //Find maxSortOrder
  $sql = "SELECT MAX(sortOrder) AS maxSortOrder FROM assignment WHERE courseHeadingId = '".$headingId."';";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  $maxSortOrder = mysqli_real_escape_string($conn,$row['maxSortOrder']);
  $sortOrder = $maxSortOrder + 100;


  for ($j = 0; $j < $number_assignments; $j++){
    $documentName =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["documentName"][$j]);
    $assignmentId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["assignmentId"][$j]);
    $branchId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["branchId"][$j]);
    $contentId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["contentId"][$j]);
    $creationDate =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["creationDate"][$j]);
    $assignedDate =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["assignedDate"][$j]);
    $dueDate =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["dueDate"][$j]);

    $sql = "INSERT INTO assignment 
    SET assignmentId='$assignmentId',
    courseHeadingId='$headingId',
    assignmentName='$documentName',
    courseId='$courseId',
    sourceBranchId='$branchId',
    contentId='$contentId',
    sortOrder='$sortOrder',
    assignedDate = '$assignedDate',
    dueDate = '$dueDate',
    creationDate= '$creationDate'"
    ;

    $result = $conn->query($sql);
    $sortOrder = $sortOrder + 100;
  }

  if ($result === TRUE) {
      // set response code - 200 OK
      http_response_code(200);
  }else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}


$conn->close();

?>

