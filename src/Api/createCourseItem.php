<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "lexicographicalRankingSort.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$success = TRUE;
$message = "";

$previousDoenetId = mysqli_real_escape_string($conn,$_REQUEST["previousDoenetId"]);
$itemType = mysqli_real_escape_string($conn,$_REQUEST["itemType"]);
$courseId = mysqli_real_escape_string($conn,$_REQUEST["courseId"]);
$placeInFolderFlag = mysqli_real_escape_string($conn,$_REQUEST["placeInFolderFlag"]);

if ($userId == ''){
  $success = FALSE;
  $message = "You need to be signed in to make a course";
}

if ($success){
  $doenetId = include "randomId.php";
  $label = 'Untitled';

  $jsonDefinition = null;

  if ($previousDoenetId == $courseId) {
    $sql = "SELECT sortOrder, parentDoenetId 
    FROM `course_content` 
    WHERE courseId = '$courseId' 
    ORDER BY sortOrder 
    LIMIT 1";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $prev =$row['sortOrder'] ?: "";
    $next = "";
    $parentDoenetId = $placeInFolderFlag  == 'true' ? $previousDoenetId : $row['parentDoenetId'];
  } else {
    $sql = "SELECT sortOrder, parentDoenetId
    FROM `course_content`
    WHERE courseId = '$courseId' and sortOrder >= (Select sortOrder From `course_content` WHERE doenetId='$previousDoenetId')
    ORDER BY sortOrder
    LIMIT 2";
    $result = $conn->query($sql); 
    $row = $result->fetch_assoc() ;
    $prev = $row['sortOrder'] ?: "";
    $parentDoenetId = $placeInFolderFlag == 'true' ? $previousDoenetId : $row['parentDoenetId'];
    $row = $result->fetch_assoc();
    $next = $row['sortOrder'] ?: "";
  }
  $sortOrder = SortOrder\getSortOrder($prev, $next);

//Defaults for each item type
if ($itemType == 'section'){
  $jsonDefinition = '{"isIncludedInStudentNavigation":true}';
}else if($itemType == 'activity'){
  $pageDoenetId = include "randomId.php";
  $orderDoenetId = include "randomId.php";
  $jsonDefinition = '{"type":"activity","version": "0.1.0","isSinglePage": true,"order":{"type":"order","doenetId":"'.$orderDoenetId.'","behavior":"sequence","content":["'.$pageDoenetId.'"]},"assignedCid":null,"draftCid":null,"itemWeights": [1],"files":[]}';

}else if($itemType == 'bank'){
  $jsonDefinition = '{"type":"bank","pages":[]}';
}else{
  $success = FALSE;
  $message = "Not able to make type $itemType";
}

if ($success){

  //Transaction with two inserts
  if ($itemType == 'activity'){
 
    // $conn->begin_transaction();

    try {
      $sql = "
        INSERT INTO course_content 
        (type,
        courseId,
        doenetId,
        parentDoenetId,
        creationDate,
        sortOrder,
        jsonDefinition)
        VALUES
        ('$itemType','$courseId','$doenetId','$parentDoenetId',NOW(),'$sortOrder','$jsonDefinition');
        ";
        $conn->query($sql);

        $sql = "
        INSERT INTO pages (courseId,containingDoenetId,doenetId) 
          VALUES('$courseId','$doenetId','$pageDoenetId');
        ";
        $conn->query($sql);
        $pageEntered = array(
          "type"=>"page",
          "label"=>"Untitled",
          "containingDoenetId"=>$doenetId,
          "doenetId"=>$pageDoenetId,
          "cid"=>"bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku"
        );
        

        /* If code reaches this point without errors then commit the data in the database */
        // $conn->commit();
    } catch (mysqli_sql_exception $exception) {
        // $conn->rollback();

        $success = FALSE;
        $message = $exception;
    }
    

  }else{
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
    ('$itemType','$courseId','$doenetId','$parentDoenetId','$label',NOW(),'$sortOrder','$jsonDefinition')
    ";
    
    $result = $conn->query($sql); 

  }



}


$sql = "
SELECT 
doenetId,
type,
parentDoenetId,
label,
creationDate,
isAssigned,
isGloballyAssigned,
isPublic,
CAST(jsonDefinition as CHAR) AS json
FROM course_content
WHERE doenetId = '$doenetId'
";
$result = $conn->query($sql); 
$row = $result->fetch_assoc();


$itemEntered = array(
  "doenetId"=>$row['doenetId'],
  "type"=>$row['type'],
  "parentDoenetId"=>$row['parentDoenetId'],
  "label"=>$row['label'],
  "creationDate"=>$row['creationDate'],
  "isAssigned"=>$row['isAssigned'],
  "isGloballyAssigned"=>$row['isGloballyAssigned'],
  "isPublic"=>$row['isPublic'],
);

$json = json_decode($row['json'],true);
// var_dump($json);
$itemEntered = array_merge($json,$itemEntered);


$itemEntered['isOpen'] = false;
$itemEntered['isSelected'] = false;

//Get new order
$sql = "
SELECT doenetId
FROM course_content
WHERE courseId='$courseId'
ORDER BY sortOrder
";

$result = $conn->query($sql); 
$order = [];
while($row = $result->fetch_assoc()){
  array_push($order,$row['doenetId']);
}
}

$response_arr = array(
  "success"=>$success,
  "message"=>$message,
  "doenetId"=>$doenetId,
  "itemEntered"=>$itemEntered,
  "pageEntered"=>$pageEntered,
  "pageDoenetId"=>$pageDoenetId,
  "order"=>$order,
  );


// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>