<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include '../api/db_connection.php';
include "../api/lexicographicalRankingSort.php";

$_POST = json_decode(file_get_contents('php://input'), true);

$message = "";
$success = TRUE;
$courseId = $_POST['courseId'];
$doenetId = $_POST['doenetId'];
$parentDoenetId = $_POST['parentDoenetId'];
$pageDoenetId1 = $_POST['pageDoenetId1'];
$pageDoenetId2 = $_POST['pageDoenetId2'];
$pageDoenetId3 = $_POST['pageDoenetId3'];
$pageDoenetId4 = $_POST['pageDoenetId4'];
$shuffleDoenetId = $_POST['shuffleDoenetId'];
$doenetML1 = $_POST['doenetML1'];
$doenetML2 = $_POST['doenetML2'];
$doenetML3 = $_POST['doenetML3'];
$doenetML4 = $_POST['doenetML4'];

$shufflePages = $_POST['shufflePages'];

if ($parentDoenetId == ""){
  $parentDoenetId = $courseId;
}

if (!$courseId) {
  $success = false;
  $message = 'Missing courseId';
} elseif (!$doenetId) {
  $success = false;
  $message = 'Missing doenetId';
} elseif (!$pageDoenetId1) {
  $success = false;
  $message = 'Missing pageDoenetId1';
} elseif (!$pageDoenetId2) {
  $success = false;
  $message = 'Missing pageDoenetId2';
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

    $contentJSON = '"'.$pageDoenetId1.'", "'.$pageDoenetId2.'"';
    if($pageDoenetId3) {
      $contentJSON = $contentJSON . ', "'.$pageDoenetId3.'"';
      if($pageDoenetId4) {
        $contentJSON = $contentJSON . ', "'.$pageDoenetId4.'"';
      }
    }

    if($shufflePages == "true") {
      $contentJSON = '{"type":"order", "content":['.$contentJSON.'],"behavior":"shuffle","doenetId":"'.$shuffleDoenetId.'","numberToSelect":1, "withReplacement": false}';
    }
    
    $jsonDefinition = '{"type":"activity","version": "0.1.0","isSinglePage": false,"content":['.$contentJSON.'],"assignedCid":null,"draftCid":null,"itemWeights": [1],"files":[]}';

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
        VALUES
        ('$courseId','$doenetId','$pageDoenetId1','Cypress Page1'),
        ('$courseId','$doenetId','$pageDoenetId2','Cypress Page2');
      ";
    $conn->query($sql);

    if($pageDoenetId3) {
      $sql = "
      INSERT INTO pages (courseId,containingDoenetId,doenetId,label) 
        VALUES
        ('$courseId','$doenetId','$pageDoenetId3','Cypress Page3')
      ";
      $conn->query($sql);
      if($pageDoenetId4) {
        $sql = "
        INSERT INTO pages (courseId,containingDoenetId,doenetId,label) 
          VALUES
          ('$courseId','$doenetId','$pageDoenetId4','Cypress Page4')
        ";
        $conn->query($sql);
      }

    }


    //Create files for pages
    $filename = "../media/byPageId/$pageDoenetId1.doenet";
    $dirname = dirname($filename);
    if (!is_dir($dirname)) {
        mkdir($dirname, 0755, true);
    }

    $newfile = fopen($filename, "w");
    if ($newfile === false) {
        $success = false;
        $message = "Unable to open file!";
    } else {
        fwrite($newfile, $doenetML1);
        fclose($newfile);
    }

    $filename = "../media/byPageId/$pageDoenetId2.doenet";

    $newfile = fopen($filename, "w");
    if ($newfile === false) {
        $success = false;
        $message = "Unable to open file!";
    } else {
        fwrite($newfile, $doenetML2);
        fclose($newfile);
    }

    if($pageDoenetId3) {
      $filename = "../media/byPageId/$pageDoenetId3.doenet";

      $newfile = fopen($filename, "w");
      if ($newfile === false) {
          $success = false;
          $message = "Unable to open file!";
      } else {
          fwrite($newfile, $doenetML3);
          fclose($newfile);
      }
      if($pageDoenetId4) {
        $filename = "../media/byPageId/$pageDoenetId4.doenet";

        $newfile = fopen($filename, "w");
        if ($newfile === false) {
            $success = false;
            $message = "Unable to open file!";
        } else {
            fwrite($newfile, $doenetML4);
            fclose($newfile);
        }
      }

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