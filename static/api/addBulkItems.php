<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');
include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$response_arr = array(
    "access"=> TRUE
);


$_POST = json_decode(file_get_contents("php://input"),true);
$driveId = mysqli_real_escape_string($conn,$_POST["driveId"]);

$item_keys_dangerous = array_keys($_POST['content']);
$items = array_map(function($item_key_dangerous) use($conn) {
    $item_key = mysqli_real_escape_string($conn,$item_key_dangerous);
    $item_dangerous = $_POST['content'][$item_key];
    // var_dump($item_dangerous);
    $item_pieces_keys_dangerous = array_keys($item_dangerous);
    $item_pieces_keys = array_map(function($item_piece_key_dangerous) use($conn) {
        return mysqli_real_escape_string($conn,$item_piece_key_dangerous);
    }, $item_pieces_keys_dangerous);

    $item = [];

    foreach ($item_pieces_keys as &$key){
        $item[$key] = mysqli_real_escape_string($conn,$item_dangerous[$key]);
    }

    return $item;
  }, $item_keys_dangerous);

  function nullifier($val){
    // $val = str_replace(',','',$val);
    if (trim($val) === ''){
        $val = "NULL";
    }else{
        $val = "'$val'";
    }
    return $val;
  }
$sql_values = "";
foreach ($items as &$item){
    $itemId = $item['itemId'];
    $parentFolderId = $item['parentFolderId'];
    $label = $item['label'];
    $creationDate = $item['creationDate'];
    $itemType = $item['itemType'];
    $branchId = nullifier($item['branchId']);
    $assignmentId = nullifier($item['ass$assignmentId']);
    $urlId = nullifier($item['urlId']);

    $sql_values = $sql_values . "('$driveId','$itemId','$parentFolderId','$label'," .
    "'$creationDate','0','0','0','$itemType',$branchId,$assignmentId,$urlId),\n";
}

$sql_values = rtrim($sql_values,",\n");

  $sql = "INSERT INTO drive_content 
      (driveId,itemId,parentFolderId,label,creationDate,isDeleted,isPublished,isAssignment,itemType,branchId,assignmentId,urlId)
      values
      $sql_values
      ";
$result = $conn->query($sql);
foreach ($items as &$item){
    if($item['itemType'] === 'DoenetML'){
        $sourceBranchId = $item['sourceBranchId'];
        $destBranchId = $item['branchId']; 
        $sql = "INSERT INTO content (branchId,contentId,title,timestamp,isDraft,removedFlag,public)
            SELECT '$destBranchId' AS branchId,contentId,title,timestamp,isDraft,'0' AS removedFlag,public
            FROM content 
            WHERE branchId = '$sourceBranchId'
            AND removedFlag = '0'";
        $result = $conn->query($sql);
    };

    
}



    // set response code - 200 OK
    http_response_code(200);

//  echo json_encode($response_arr);

$conn->close();
?>