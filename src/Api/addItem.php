<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$driveId = mysqli_real_escape_string($conn,$_REQUEST["driveId"]);
$parentFolderId = mysqli_real_escape_string($conn,$_REQUEST["parentFolderId"]);
$itemId = mysqli_real_escape_string($conn,$_REQUEST["itemId"]);
$versionId = mysqli_real_escape_string($conn,$_REQUEST["versionId"]);
$label = mysqli_real_escape_string($conn,$_REQUEST["label"]);
$type = mysqli_real_escape_string($conn,$_REQUEST["type"]);
$branchId = mysqli_real_escape_string($conn,$_REQUEST["branchId"]);
$sortOrder = mysqli_real_escape_string($conn,$_REQUEST["sortOrder"]);
$isNewCopy = mysqli_real_escape_string($conn,$_REQUEST["isNewCopy"]);

$success = TRUE;
$message = "";


if ($driveId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing driveId';
}elseif ($parentFolderId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing parentFolderId';
}elseif ($itemId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing itemId';
}elseif ($versionId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing versionId';
}elseif ($label == ""){
  $success = FALSE;
  $message = 'Internal Error: missing label';
}elseif ($type == ""){
  $success = FALSE;
  $message = 'Internal Error: missing type';
}elseif ($branchId == ""){
  $success = FALSE;
  $message = 'Internal Error: missing branchId';
}elseif ($userId == ""){
  $success = FALSE;
  $message = "You need to be signed in to create a $type";
}

if ($success){
  //Check for permissions
  $sql = "
  SELECT canAddItemsAndFolders
  FROM drive_user
  WHERE userId = '$userId'
  AND driveId = '$driveId'
  ";

  $result = $conn->query($sql); 
  if ($result->num_rows > 0){
  $row = $result->fetch_assoc();
  $canAdd = $row["canAddItemsAndFolders"];
  if (!$canAdd){
    $success = FALSE;
    $message = "No permission to add";
  }
  }else{
    //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
    $success = FALSE;
    $message = "Database rejected update";
  }
}

if ($success){


  if ($type == 'Folder'){
    $sql="
  INSERT INTO drive_content
  (driveId,itemId,parentFolderId,label,creationDate,isDeleted,itemType,branchId,sortOrder)
  VALUES
  ('$driveId','$itemId','$parentFolderId','$label',NOW(),'0','$type',NULL,'$sortOrder')
  ";

  $result = $conn->query($sql); 

  }else if ($type == 'Url'){
    $sql="
  INSERT INTO drive_content
  (driveId,itemId,parentFolderId,label,creationDate,isDeleted,itemType,branchId,sortOrder)
  VALUES
  ('$driveId','$itemId','$parentFolderId','$label',NOW(),'0','$type',NULL,'$sortOrder')
  ";

  $result = $conn->query($sql); 

  }else if ($type == 'DoenetML'){
    if ($isNewCopy != '1'){
      $emptyContentId = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      $fileName = $emptyContentId;
      //TODO: Config file needed for server
      $newfile = fopen("../media/$fileName.doenet", "w") or die("Unable to open file!");
      fwrite($newfile, "");
      fclose($newfile);
    }

    $sql="
    INSERT INTO drive_content
    (driveId,itemId,parentFolderId,label,creationDate,isDeleted,itemType,branchId,sortOrder)
    VALUES
    ('$driveId','$itemId','$parentFolderId','$label',NOW(),'0','$type','$branchId','$sortOrder')
    ";
    
    if ($isNewCopy != '1'){
      $result = $conn->query($sql); 
      $sql="
      INSERT INTO content
      (branchId,versionId,contentId,title,timestamp,isDraft,removedFlag,public)
      VALUES
      ('$branchId','$versionId','$emptyContentId','Draft',NOW(),'1','0','1')
      ";
    }

    $result = $conn->query($sql); 
  }else{
    $success = FALSE;
    $message = "Don't know how to add type $type";
  }

}

$response_arr = array(
  "success"=>$success,
  "message"=>$message
  );

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>