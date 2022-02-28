<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
include "cidFromSHA.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);

// $escapedDoenetML = mysqli_real_escape_string($conn,$_POST["doenetML"]);
// $escapedCID = hash('sha256',$escapedDoenetML);
$title =  mysqli_real_escape_string($conn,$_POST["title"]);
$dangerousDoenetML = $_POST["doenetML"];
$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$versionId = mysqli_real_escape_string($conn,$_POST["versionId"]);
$newDraftVersionId = mysqli_real_escape_string($conn,$_POST["newDraftVersionId"]);
$newDraftContentId = mysqli_real_escape_string($conn,$_POST["newDraftContentId"]);
$isDraft = mysqli_real_escape_string($conn,$_POST["isDraft"]);
$isNamed = mysqli_real_escape_string($conn,$_POST["isNamed"]);
$isReleased = mysqli_real_escape_string($conn,$_POST["isReleased"]);
$isNewTitle = mysqli_real_escape_string($conn,$_POST["isNewTitle"]);
$isNewCopy = mysqli_real_escape_string($conn,$_POST["isNewCopy"]);
$isSetAsCurrent = mysqli_real_escape_string($conn,$_POST["isSetAsCurrent"]);
$newTitle = mysqli_real_escape_string($conn,$_POST["newTitle"]);
$isNewToggleRelease = mysqli_real_escape_string($conn,$_POST["isNewToggleRelease"]);
$previousDoenetId = mysqli_real_escape_string($conn,$_POST["previousDoenetId"]);


$success = TRUE;
$message = "";

if ($title == ""){
    $success = FALSE;
    $message = 'Internal Error: missing title';
  }elseif ($doenetId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing doenetId';
  }elseif ($versionId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing versionId';
  }elseif ($isDraft == ""){
    $success = FALSE;
    $message = 'Internal Error: missing isDraft';
  }elseif ($isReleased == ""){
    $success = FALSE;
    $message = 'Internal Error: missing isReleased';
}elseif ($isNamed == ""){
    $success = FALSE;
    $message = 'Internal Error: missing isNamed';
// }elseif ($isNewTitle == ""){
//     $success = FALSE;
//     $message = 'Internal Error: missing isNewTitle';
  }elseif ($userId == ""){
    $success = FALSE;
    $message = "You need to be signed in to create a $type";
  }

//Add new version to content table
//TODO: Update draft version (Overwrite DoenetId named file)


//Test if we have permission to save to doenetId
if ($success){

  //get driveId from doenetId TODO: should be a sql join query with userId
  $sql = "SELECT driveId
      FROM `drive_content`
      WHERE doenetId = '$doenetId'
  ";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $driveId = $row['driveId'];
  }

  if(array_key_exists('driveId', get_defined_vars())) {
    $sql = "SELECT canEditContent
      FROM drive_user
      WHERE userId = '$userId'
      AND driveId = '$driveId'
    ";
    $result = $conn->query($sql); 
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $allowed = $row['canEditContent'];
      if (!$allowed) {
          http_response_code(403); //User if forbidden from operation
          $success = FALSE;
          $message = "You need need permission to add versions";
      }
    } else {
        //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
        http_response_code(401); //User has bad auth
        $success = FALSE;
    }
  } else {
    http_response_code(404);
    $success = FALSE;
  }
}

if ($success){

//save to file as contentid
$SHA = hash('sha256', $dangerousDoenetML);
$contentId = cidFromSHA($SHA);

if ($isDraft == '1' and $isSetAsCurrent != '1'){
    $sql = "UPDATE content 
    SET timestamp=NOW(), contentId='$contentId'
    WHERE isDraft='1'
    AND doenetId='$doenetId'
    ";

    if (!$result = $conn->query($sql)) {
      $success = FALSE;
      $message = $conn->error;
    }else{
     $saveError = saveDoenetML($contentId,$dangerousDoenetML);
     if ($saveError != NULL){
      $success = FALSE;
      $message = $saveError;
     }
    }

}elseif($isSetAsCurrent == '1'){

  //Add draft as named version
    $sql = "SELECT
    contentId,
    versionId
    FROM content
    WHERE isDraft='1'
    AND doenetId='$doenetId'
    ";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();

    $oldDraftContentId = $row['contentId'];
    $oldDraftVersionId = $row['versionId'];

    //Update draft to new versionId and content
    //After this we are missing the old draft info
    $sql = "UPDATE content 
    SET timestamp=NOW(), 
    contentId='$newDraftContentId',
    versionId='$newDraftVersionId'
    WHERE isDraft='1'
    AND doenetId='$doenetId'
    ";
    $result = $conn->query($sql);

    //Save the old draft info as an autosave
    $sql = "INSERT INTO content 
    SET doenetId='$doenetId',
    contentId='$oldDraftContentId', 
    versionId='$oldDraftVersionId', 
    title='$newTitle',
    timestamp=NOW(),
    isDraft='0',
    isNamed='1',
    isReleased='0'
    ";

    $result = $conn->query($sql);
    

}elseif($isNewTitle == '1'){

        $sql = "UPDATE content
        SET title='$title',isNamed='1'
        WHERE doenetId='$doenetId'
        AND versionId='$versionId'
        ";
        $result = $conn->query($sql);
}elseif($isNewToggleRelease == '1'){
  //Use Database as source of truth
  $sql = "SELECT contentId, isReleased
  FROM content
  WHERE doenetId='$doenetId'
  AND versionId='$versionId'
  ";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  $db_version_isReleased = $row['isReleased'];
  $db_version_contentId = $row['contentId'];
  //Unrelease All
  $sql = "UPDATE content
  SET isReleased='0'
  WHERE doenetId='$doenetId'
  ";
  $result = $conn->query($sql);
  if ($db_version_isReleased == "0"){
    //Release the version
    $sql = "UPDATE content
    SET isReleased='1'
    WHERE doenetId='$doenetId'
    AND versionId='$versionId'
    ";
  $result = $conn->query($sql);
    //update assignment to match new version
    $sql = "UPDATE assignment
    SET contentId='$db_version_contentId'
    WHERE doenetId='$doenetId'
    ";
    $result = $conn->query($sql);
    //Update drive status to release (even if it was)
    $sql = "UPDATE drive_content
    SET isReleased='1'
    WHERE doenetId='$doenetId'
    ";
    $result = $conn->query($sql);
  }else{
    //Update drive status to not released 
    $sql = "UPDATE drive_content
    SET isReleased='0'
    WHERE doenetId='$doenetId'
    ";
    $result = $conn->query($sql);
  }
  

}else{

    //Protect against duplicate versionId's
    $sql = "SELECT versionId
    FROM content
    WHERE versionId='$versionId'
    ";

    $result = $conn->query($sql);
    $row = $result->fetch_assoc();


    if($versionId == $row['versionId']){
      $success = FALSE;
      $message = "Internal Error: Duplicate VersionId $versionId";

    }elseif($isNewCopy == '1'){
      //New Copy!

      //Find previous contentId of draft
      $sql = "SELECT contentId
        FROM content
        WHERE doenetId='$previousDoenetId'
        AND isDraft='1'
      ";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $contentId = $row['contentId']; //Overwrite contentId with draft
      
      //Safe the draft for the new content
      $sql = "INSERT INTO content 
        SET doenetId='$doenetId',
        contentId='$contentId', 
        versionId='$versionId', 
        title='Draft',
        timestamp=NOW(),
        isDraft='1',
        isNamed='0'
        ";
    
        $result = $conn->query($sql);
     

    }else{

        saveDoenetML($contentId,$dangerousDoenetML);
    
        $sql = "INSERT INTO content 
        SET doenetId='$doenetId',
        contentId='$contentId', 
        versionId='$versionId', 
        title='$title',
        timestamp=NOW(),
        isDraft='0',
        isNamed='$isNamed'
        ";
    
        $result = $conn->query($sql);
    }
    
}
}


function saveDoenetML($fileName,$dangerousDoenetML){
    // $fileName = $contentId;
    // if ($isDraft){$fileName = $doenetId;}
    //TODO: Config file needed for server
    $newfile = fopen("../media/$fileName.doenet", "w") or die("Unable to open file!");
    $status = fwrite($newfile, $dangerousDoenetML);
    if ($status === false){
      return "Didn't save to file";
    }
    fclose($newfile);
}

$response_arr = array(
    "success"=>$success,
    "versionId"=> $versionId,
    "message"=>$message,
    "contentId"=> $contentId
);

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();

?>

