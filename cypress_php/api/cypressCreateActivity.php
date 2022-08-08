<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include '../api/db_connection.php';
include "../api/lexicographicalRankingSort.php";

$message = "";
$success = TRUE;
$courseId = $_REQUEST['courseId'];
$doenetId = $_REQUEST['doenetId'];
$parentDoenetId = $_REQUEST['parentDoenetId'];
$pageDoenetId = $_REQUEST['pageDoenetId'];

if ($parentDoenetId == ""){
  $parentDoenetId = $courseId;
}

if (!$courseId) {
  $success = false;
  $message = 'Missing courseId';
} elseif (!$doenetId) {
  $success = false;
  $message = 'Missing doenetId';
} elseif (!$pageDoenetId) {
  $success = false;
  $message = 'Missing pageDoenetId';
} 

if ($success){

  $sql = "
  SELECT doenetId
  FROM course_content
  WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql); 

  //Don't create another if it already exists 
  if ($result->num_rows == 0) {

    $label = 'Cypress Activity';

    $jsonDefinition = '{"type":"activity","version": "0.1.0","isSinglePage": true,"content":["'.$pageDoenetId.'"],"assignedCid":null,"draftCid":null,"itemWeights": [1],"files":[]}';

    $sql = "SELECT sortOrder
    FROM `course_content`
    WHERE courseId = '$courseId' 
    AND sortOrder >= (Select sortOrder From `course_content` WHERE doenetId='$previousContainingDoenetId' AND isDeleted = 0)
    AND isDeleted = 0
    ORDER BY sortOrder
    LIMIT 2";
    $result = $conn->query($sql); 
    $row = $result->fetch_assoc() ;
    $prev = $row['sortOrder'] ?: "";
    $row = $result->fetch_assoc();
    $next = $row['sortOrder'] ?: "";
    $sortOrder = SortOrder\getSortOrder($prev, $next);


    $sql = "
      INSERT INTO course_content 
      (type,
      courseId,
      doenetId,
      parentDoenetId,
      label,
      creationDate,
      sortOrder,
      jsonDefinition)
      VALUES
      ('activity','$courseId','$doenetId','$parentDoenetId','$label',CONVERT_TZ(NOW(), @@session.time_zone, '+00:00'),'$sortOrder','$jsonDefinition');
      ";
      $conn->query($sql);

      $sql = "
        INSERT INTO pages (courseId,containingDoenetId,doenetId,label) 
          VALUES('$courseId','$doenetId','$pageDoenetId','Cypress Page');
        ";
      $conn->query($sql);


      //Create blank file for page
      $filename = "../media/byPageId/$pageDoenetId.doenet";
      $dirname = dirname($filename);
      if (!is_dir($dirname)) {
          mkdir($dirname, 0755, true);
      }

      $newfile = fopen($filename, "w");
      if ($newfile === false) {
          $success = false;
          $message = "Unable to open file!";
      } else {
          // don't write anything to file so that it is a blank file
          fclose($newfile);
      }

  }
}

$response_arr = array(
  "message" => $message,
  "success" => $success
  );

http_response_code(200);
echo json_encode($response_arr);

 $conn->close();
?>