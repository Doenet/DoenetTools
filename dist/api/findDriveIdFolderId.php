<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];
$examUserId = array_key_exists("examineeUserId",$jwtArray) ? $jwtArray['examineeUserId'] : "";
$examDoenetId = array_key_exists("doenetId",$jwtArray) ? $jwtArray['doenetId'] : "";

$allowed = false;
$success = true;
$response_code = 200;
$message = '';

$doenetId = mysqli_real_escape_string($conn, $_REQUEST['doenetId']);


if ($doenetId == ""){
    $success = FALSE;
    $message = 'Internal Error: missing doenetId';
}else if ($userId == ""){
	if ($examUserId == ""){
		$success = FALSE;
		$message = "No access - Need to sign in";
	}else if ($examDoenetId != $doenetId){
		$success = FALSE;
		$message = "No access for doenetId: $doenetId";
	}else{
		$userId = $examUserId;
	}

}

if ($success) {
    

    //get driveId from doenetId
    //TODO: should be a sql join query with userId
    $sql = "
        SELECT driveId, parentFolderId, itemId
        FROM drive_content
        WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $driveId = $row['driveId'];
        $parentFolderId = $row['parentFolderId'];
        $itemId = $row['itemId'];
    }

    if (
        array_key_exists('driveId', get_defined_vars()) &&
        array_key_exists('parentFolderId', get_defined_vars())
    ) {
        //check user has permission to view
        $sql = "
            SELECT canViewDrive
            FROM drive_user
            WHERE userId = '$userId'
            AND driveId = '$driveId'
        ";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $allowed = $row['canViewDrive'];
            if (!$allowed) {
                http_response_code(403); //User if forbidden from operation
                echo json_encode([
                    'message' => 'User lacks permission',
                ]);
            }
        } else {
            //Fail because there is no DB row for the user on this drive so we shouldn't allow an add
            http_response_code(401); //User has bad auth
            echo json_encode([
                'message' => 'User Unauthorized',
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'doenetId Invalid']);
    }
}


if ($success) {
    http_response_code($response_code);

    echo json_encode([
        'allowed' => $allowed,
        'success' => $success,
        'message' => $message,
        'driveId' => $driveId,
        'itemId' => $itemId,
        'parentFolderId' => $parentFolderId,
    ]);
}

$conn->close();
?>
