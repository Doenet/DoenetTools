<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";
$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);

// $escapedDoenetML = mysqli_real_escape_string($conn,$_POST["doenetML"]);
// $escapedCID = hash('sha256',$escapedDoenetML);
$title =  mysqli_real_escape_string($conn,$_POST["title"]);
$dangerousDoenetML = $_POST["doenetML"];
$branchId = mysqli_real_escape_string($conn,$_POST["branchId"]);
$versionId = mysqli_real_escape_string($conn,$_POST["versionId"]);
$isDraft = mysqli_real_escape_string($conn,$_POST["isDraft"]);
$isNamed = mysqli_real_escape_string($conn,$_POST["isNamed"]);
$isNewTitle = mysqli_real_escape_string($conn,$_POST["isNewTitle"]);
$isNewCopy = mysqli_real_escape_string($conn,$_POST["isNewCopy"]);
$previousBranchId = mysqli_real_escape_string($conn,$_POST["previousBranchId"]);


$success = TRUE;
$message = "";

if ($title == ""){
    $success = FALSE;
    $message = 'Internal Error: missing title';
  }elseif ($branchId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing branchId';
  }elseif ($versionId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing versionId';
  }elseif ($isDraft == ""){
    $success = FALSE;
    $message = 'Internal Error: missing isDraft';
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
//TODO: Update draft version (Overwrite BranchId named file)


//Test if we have permission to save to branchId
if ($success){
    $sql = "
    SELECT canAddItemsAndFolders
    FROM drive_user
    WHERE userId = '$userId'
    AND driveId = '$driveId'
    ";
    $result = $conn->query($sql); 
    $row = $result->fetch_assoc();
    if ($row['canAddItemsAndFolders'] == '0'){
      $success = FALSE;
      $message = "You need need permission to add versions";
    }
}

if ($success){

//save to file as contentid
$contentId = hash('sha256', $dangerousDoenetML);


if ($isDraft){
    $sql = "UPDATE content 
    SET timestamp=NOW(), contentId='$contentId'
    WHERE isDraft='1'
    AND branchId='$branchId'
    ";

    $result = $conn->query($sql);
    saveDoenetML($branchId,$dangerousDoenetML);

}elseif($isNewTitle == '1'){
        $sql = "
        UPDATE content
        SET title='$title',isNamed='1'
        WHERE branchId='$branchId'
        AND versionId='$versionId'
        ";
        $result = $conn->query($sql);
    
}else{

    //Protect against duplicate versionId's
    $sql = "
    SELECT versionId
    FROM content
    WHERE versionId='$versionId'
    ";

    $result = $conn->query($sql);
    $row = $result->fetch_assoc();


    if($versionId == $row['versionId']){
        $response_arr = array(
            "success"=> false,
            "versionId"=> $versionId
        );
    }elseif($isNewCopy == '1'){
      //New Copy!
      $sql = "INSERT INTO content 
        SET branchId='$branchId',
        contentId='$contentId', 
        versionId='$versionId', 
        title='$title',
        timestamp=NOW(),
        isDraft='0',
        isNamed='$isNamed'
        ";
    
        $result = $conn->query($sql);

    }else{

        saveDoenetML($contentId,$dangerousDoenetML);
    
        $sql = "INSERT INTO content 
        SET branchId='$branchId',
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
    // if ($isDraft){$fileName = $branchId;}
    //TODO: Config file needed for server
    $newfile = fopen("../media/$fileName.doenet", "w") or die("Unable to open file!");
    fwrite($newfile, $dangerousDoenetML);
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

