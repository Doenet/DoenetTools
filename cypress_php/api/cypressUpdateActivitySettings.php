<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include '../api/db_connection.php';

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
  // KE: Is assignmentId the ID of the section/collection?
  $assignmentId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["assignmentId"][$j]);
  $doenetId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["doenetId"][$j]);
  // KE: Is contentId the ID of the activity?
  $contentId =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["contentId"][$j]);
  $creationDate =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["creationDate"][$j]);
  $assignedDate =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["assignedDate"][$j]);
  $dueDate =  mysqli_real_escape_string($conn,$_POST["assignmentSeeds"][$i]["dueDate"][$j]);

  // KE: Initialize the section/collection to hold these values?
  $sql = "INSERT INTO assignment 
  SET assignmentId='$assignmentId',
  courseHeadingId='$headingId',
  assignmentName='$documentName',
  courseId='$courseId',
  sourceDoenetId='$doenetId',
  contentId='$contentId',
  sectionId='$sectionId',
  sortOrder='$sortOrder',
  assignedDate = '$assignedDate',
  dueDate = '$dueDate',
  creationDate= '$creationDate'"
  ;

  $result = $conn->query($sql);
  $sortOrder = $sortOrder + 100;
}

// KE: If the activity is NOT nested within a section
if ($assignmentId == "") {
  //Base level so just find the last sortOrder and increment by 100
  $sql = "SELECT contentId AS minSortOrder
  FROM course_heading 
  WHERE courseId = '$courseId';";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  //$minSortOrder = mysqli_real_escape_string($conn,$row['minSortOrder']);
  //echo "minSortOrder $minSortOrder\n";

  // KE: Update the due date
  $sql = "UPDATE dueDate 
  SET dueDate = '$dueDate'
  WHERE courseId = '$courseId'";
  $result = $conn->query($sql);

  // KE: Update the assigned date
  $sql = "UPDATE assignedDate 
  SET assignedDate = '$assignedDate'
  WHERE courseId = '$courseId'";
  $result = $conn->query($sql);

  // KE: Reinsert the updated due date and assigned date back into the section
  $sql = "INSERT INTO assignment SET 
  assignmentId='$assignmentId',
  courseHeadingId='$headingId',
  assignmentName='$documentName',
  courseId='$courseId',
  sourceDoenetId='$doenetId',
  contentId='$contentId',
  sortOrder='$sortOrder',
  assignedDate = '$assignedDate',
  dueDate = '$dueDate',
  creationDate= '$creationDate'"
  ;
  $result = $conn->query($sql);

// KE: If the activity IS nested within a section
} else {
  //has a parent
  // KE: contentId (the activity) is nested within assignmentId (the section)
  $sql = "SELECT contentId AS assignmentId 
  FROM course_heading 
  WHERE courseHeadingId = '$parentHeadingId';";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  $parentSortOrder = $row['parentSortOrder'];

  // Update the due date
  $sql = "UPDATE dueDate 
  SET dueDate = '$dueDate'
  WHERE courseId = '$courseId'
  AND contentId > '$assignmentId'"; // KE: assignmentId is parenting contentId
  $result = $conn->query($sql);

  // Update the assigned date
  $sql = "UPDATE assignedDate 
  SET assignedDate = '$assignedDate'
  WHERE courseId = '$courseId'
  AND contentId > '$assignmentId'"; // KE: assignmentId is parenting contentId
  $result = $conn->query($sql);

  // KE: Do I need sortOrder? Is that relevant in this file?
  // $insertSortOrder = $parentSortOrder + 100;

  // KE: Reinsert the updated due date and assigned date back into the section
  $sql = "INSERT INTO assignment SET
  assignmentId='$assignmentId',
  courseHeadingId='$headingId',
  assignmentName='$documentName',
  courseId='$courseId',
  sourceDoenetId='$doenetId',
  contentId='$contentId',
  sortOrder='$sortOrder',
  assignedDate = '$assignedDate',
  dueDate = '$dueDate',
  creationDate= '$creationDate'"
  ;
  echo $sql;
  $result = $conn->query($sql);
}

if ($result === TRUE) {
    // set response code - 200 OK
    http_response_code(200);
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}
  
$conn->close();
?>