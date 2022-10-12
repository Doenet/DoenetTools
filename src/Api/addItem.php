<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);

$driveId = mysqli_real_escape_string($conn,$_POST["driveId"]);
$parentFolderId = mysqli_real_escape_string($conn,$_POST["parentFolderId"]);
$itemId = mysqli_real_escape_string($conn,$_POST["itemId"]);
$versionId = mysqli_real_escape_string($conn,$_POST["versionId"]);
$label = mysqli_real_escape_string($conn,$_POST["label"]);
$type = mysqli_real_escape_string($conn,$_POST["type"]);
$doenetId = mysqli_real_escape_string($conn,$_POST["doenetId"]);
$cid = mysqli_real_escape_string($conn,$_POST["cid"]);
$sortOrder = mysqli_real_escape_string($conn,$_POST["sortOrder"]);
$isNewCopy = mysqli_real_escape_string($conn,$_POST["isNewCopy"]);

//DoenetML Assignment
$dueDate = mysqli_real_escape_string($conn,$_POST["dueDate"]);
$assignedDate = mysqli_real_escape_string($conn,$_POST["assignedDate"]);
$timeLimit = mysqli_real_escape_string($conn,$_POST["timeLimit"]);
$numberOfAttemptsAllowed = mysqli_real_escape_string($conn,$_POST["numberOfAttemptsAllowed"]);
$attemptAggregation = mysqli_real_escape_string($conn,$_POST["attemptAggregation"]);
$totalPointsOrPercent = mysqli_real_escape_string($conn,$_POST["totalPointsOrPercent"]);
$gradeCategory = mysqli_real_escape_string($conn,$_POST["gradeCategory"]);
$individualize = mysqli_real_escape_string($conn,$_POST["individualize"]);
$showSolution = mysqli_real_escape_string($conn,$_POST["showSolution"]);
$showSolutionInGradebook = mysqli_real_escape_string($conn,$_POST["showSolutionInGradebook"]);
$showFeedback = mysqli_real_escape_string($conn,$_POST["showFeedback"]);
$showHints = mysqli_real_escape_string($conn,$_POST["showHints"]);
$showCorrectness = mysqli_real_escape_string($conn,$_POST["showCorrectness"]);
$proctorMakesAvailable = mysqli_real_escape_string($conn,$_POST["proctorMakesAvailable"]);
$autoSubmit = mysqli_real_escape_string($conn,$_POST["autoSubmit"]);
if ($timeLimit == ''){$timeLimit = 'NULL';} else {$timeLimit = "'$timeLimit'"; }
if ($dueDate == ''){$dueDate = 'NULL';} else {$dueDate = "'$dueDate'"; }
if ($assignedDate == ''){$assignedDate = 'NULL';} else {$assignedDate = "'$assignedDate'"; }
if ($individualize){ $individualize = '1'; } else { $individualize = '0'; }
if ($showSolution){ $showSolution = '1'; } else { $showSolution = '0'; }
if ($showSolutionInGradebook){ $showSolutionInGradebook = '1'; } else { $showSolutionInGradebook = '0'; }
if ($showFeedback){ $showFeedback = '1'; } else { $showFeedback = '0'; }
if ($showHints){ $showHints = '1'; } else { $showHints = '0'; }
if ($showCorrectness){ $showCorrectness = '1'; } else { $showCorrectness = '0'; }
if ($proctorMakesAvailable){ $proctorMakesAvailable = '1'; } else { $proctorMakesAvailable = '0'; }
if ($autoSubmit){ $autoSubmit = '1'; } else { $autoSubmit = '0'; }

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

// TODO: Test Assignment Variables
// if ($type === 'DoenetML'){
// }

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
                    'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku';
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
                  (doenetId,versionId,cid,title,timestamp,isDraft,removedFlag,public)
                  VALUES
                  ('$doenetId','$versionId','$emptyContentId','Draft',NOW(),'1','0','1')
                  ";
            }
            $result = $conn->query($sql);

            //Assignment
            $sql="
            INSERT INTO assignment
            (
            doenetId,
            cid,
            driveId,
            assignedDate,
            dueDate,
            timeLimit,
            numberOfAttemptsAllowed,
            attemptAggregation,
            totalPointsOrPercent,
            gradeCategory,
            individualize,
            showSolution,
            showSolutionInGradebook,
            showFeedback,
            showHints,
            showCorrectness,
            proctorMakesAvailable,
            autoSubmit)
            VALUES
            (
            '$doenetId',
            '$cid',
            '$driveId',
            $assignedDate,
            $dueDate,
            $timeLimit,
            '$numberOfAttemptsAllowed',
            '$attemptAggregation',
            '$totalPointsOrPercent',
            '$gradeCategory',
            '$individualize',
            '$showSolution',
            '$showSolutionInGradebook',
            '$showFeedback',
            '$showHints',
            '$showCorrectness',
            '$proctorMakesAvailable',
            '$autoSubmit')
            ";
          
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
                  (doenetId,versionId,cid,title,timestamp,isDraft,removedFlag,public)
                  VALUES
                  ('$doenetId','$versionId','$emptyContentId','Draft',NOW(),'1','0','1')
                  ";
            }
            $result = $conn->query($sql);

            //Assignment
            $sql="
                INSERT INTO assignment
                (
                doenetId,
                cid,
                driveId,
                assignedDate,
                dueDate,
                timeLimit,
                numberOfAttemptsAllowed,
                attemptAggregation,
                totalPointsOrPercent,
                gradeCategory,
                individualize,
                showSolution,
                showSolutionInGradebook,
                showFeedback,
                showHints,
                showCorrectness,
                proctorMakesAvailable,
                autoSubmit)
                VALUES
                (
                '$doenetId',
                '$cid',
                '$driveId',
                $assignedDate,
                $dueDate,
                $timeLimit,
                '$numberOfAttemptsAllowed',
                '$attemptAggregation',
                '$totalPointsOrPercent',
                '$gradeCategory',
                '$individualize',
                '$showSolution',
                '$showSolutionInGradebook',
                '$showFeedback',
                '$showHints',
                '$showCorrectness',
                '$proctorMakesAvailable',
                '$autoSubmit')
            ";

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
