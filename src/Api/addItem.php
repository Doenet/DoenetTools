<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$driveId = mysqli_real_escape_string($conn, $_REQUEST['driveId']);
$parentFolderId = mysqli_real_escape_string($conn, $_REQUEST['parentFolderId']);
$itemId = mysqli_real_escape_string($conn, $_REQUEST['itemId']);
$versionId = mysqli_real_escape_string($conn, $_REQUEST['versionId']);
$label = mysqli_real_escape_string($conn, $_REQUEST['label']);
$type = mysqli_real_escape_string($conn, $_REQUEST['type']);
$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);
$sortOrder = mysqli_real_escape_string($conn, $_REQUEST['sortOrder']);
$isNewCopy = mysqli_real_escape_string($conn, $_REQUEST['isNewCopy']);

$success = true;
$message = '';

if ($driveId == '') {
    $success = false;
    $message = 'Internal Error: missing driveId';
} elseif ($parentFolderId == '') {
    $success = false;
    $message = 'Internal Error: missing parentFolderId';
} elseif ($itemId == '') {
    $success = false;
    $message = 'Internal Error: missing itemId';
} elseif ($versionId == '') {
    $success = false;
    $message = 'Internal Error: missing versionId';
} elseif ($label == '') {
    $success = false;
    $message = 'Internal Error: missing label';
} elseif ($type == '') {
    $success = false;
    $message = 'Internal Error: missing type';
} elseif ($doenetId == '') {
    $success = false;
    $message = 'Internal Error: missing doenetId';
} elseif ($userId == '') {
    $success = false;
    $message = "You need to be signed in to create a $type";
}

if ($success) {
    //Check for permissions
    $sql = "
    SELECT canAddItemsAndFolders
    FROM drive_user
    WHERE userId = '$userId'
    AND driveId = '$driveId'
    ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $canAdd = $row['canAddItemsAndFolders'];
        if (!$canAdd) {
            http_response_code(403); //User if forbidden from operation
            $success = false;
            $message = 'No permission to add';
        }
    } else {
        //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
        http_response_code(401); //User has bad auth
        $success = false;
        $message = 'Database rejected update';
    }
} else {
    http_response_code(400); //Request is missing a field
}

if ($success) {
    switch ($type) {
        case 'Folder':
            $sql = "
          INSERT INTO drive_content
          (driveId,itemId,parentFolderId,label,creationDate,isDeleted,itemType,doenetId,sortOrder)
          VALUES
          ('$driveId','$itemId','$parentFolderId','$label',NOW(),'0','$type','$doenetId','$sortOrder')
          ";
            $result = $conn->query($sql);
            break;
        case 'Url':
            $sql = "
          INSERT INTO drive_content
          (driveId,itemId,parentFolderId,label,creationDate,isDeleted,itemType,doenetId,sortOrder)
          VALUES
          ('$driveId','$itemId','$parentFolderId','$label',NOW(),'0','$type',NULL,'$sortOrder')
          ";
            $result = $conn->query($sql);
            break;
        case 'DoenetML':
            if ($isNewCopy != '1') {
                $emptyContentId =
                    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
                $fileName = $emptyContentId;
                //TODO: Config file needed for server
                ($newfile = fopen("../media/$fileName.doenet", 'w')) or
                    die('Unable to open file!');
                fwrite($newfile, '');
                fclose($newfile);
            }

            $sql = "
              INSERT INTO drive_content
              (driveId,itemId,parentFolderId,label,creationDate,isDeleted,itemType,doenetId,sortOrder)
              VALUES
              ('$driveId','$itemId','$parentFolderId','$label',NOW(),'0','$type','$doenetId','$sortOrder')
              ";

            if ($isNewCopy != '1') {
                $result = $conn->query($sql);
                $sql = "
                  INSERT INTO content
                  (doenetId,versionId,contentId,title,timestamp,isDraft,removedFlag,public)
                  VALUES
                  ('$doenetId','$versionId','$emptyContentId','Draft',NOW(),'1','0','1')
                  ";
            }
            $result = $conn->query($sql);
            break;
        case 'Collection':
            if ($isNewCopy != '1') {
                $emptyContentId =
                    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
                $fileName = $emptyContentId;
                //TODO: Config file needed for server
                ($newfile = fopen("../media/$fileName.doenet", 'w')) or
                    die('Unable to open file!');
                fwrite($newfile, '');
                fclose($newfile);
            }

            $sql = "
              INSERT INTO drive_content
              (driveId,itemId,parentFolderId,label,creationDate,isDeleted,itemType,doenetId,sortOrder)
              VALUES
              ('$driveId','$itemId','$parentFolderId','$label',NOW(),'0','$type','$doenetId','$sortOrder')
              ";

            if ($isNewCopy != '1') {
                $result = $conn->query($sql);
                $sql = "
                  INSERT INTO content
                  (doenetId,versionId,contentId,title,timestamp,isDraft,removedFlag,public)
                  VALUES
                  ('$doenetId','$versionId','$emptyContentId','Draft',NOW(),'1','0','1')
                  ";
            }
            $result = $conn->query($sql);
            break;
        default:
            $success = false;
            $message = "Unsupported item type: $type";
            http_response_code(400);
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
