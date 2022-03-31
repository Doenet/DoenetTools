<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


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
  $sortOrder = 'a'; //replace with position function

//Defaults for each item type
if ($itemType == 'section'){
  $jsonDefinition = '{"isIncludedInStudentNavigation":true}';
}else if($itemType == 'activity'){
  $pageDoenetId = include "randomId.php";
  $orderDoenetId = include "randomId.php";
  $jsonDefinition = '{"type":"activity","order":{"type":"order","doenetId":"'.$orderDoenetId.'","behavior":"sequence","content":["'.$pageDoenetId.'"]},"variantControl": {"nVariants": 100,"seeds": ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100"]},"itemWeights": [1],"cid":"bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku","files":[]}';

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
        (contentType,
        courseId,
        doenetId,
        parentDoenetId,
        creationDate,
        sortOrder,
        jsonDefinition)
        VALUES
        ('$itemType','$courseId','$doenetId','$previousDoenetId',NOW(),'$sortOrder','$jsonDefinition');
        ";
        $conn->query($sql);

        $sql = "
        INSERT INTO pages (containingDoenetId,doenetId) 
          VALUES('$doenetId','$pageDoenetId');
        ";
        $conn->query($sql);
        $pageEntered = array(
          "type"=>"page",
          "label"=>"Untitled",
          "doenetId"=>$pageDoenetId,
          "draftCid"=>"bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku", 
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
    (contentType,
    courseId,
    doenetId,
    parentDoenetId,
    label,
    creationDate,
    sortOrder,
    jsonDefinition)
    VALUES
    ('$itemType','$courseId','$doenetId','$previousDoenetId','$label',NOW(),'$sortOrder','$jsonDefinition')
    ";
    
    $result = $conn->query($sql); 

  }



}


$sql = "
SELECT 
doenetId,
contentType,
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
  "contentType"=>$row['contentType'],//TODO: should be type
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
$item['isSelected'] = false;

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