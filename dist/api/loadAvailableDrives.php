<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

// $type = mysqli_real_escape_string($conn,$_REQUEST["type"]);

$success = true;
$message = '';
$driveIdsAndLabels = [];
$newRoleData = [];
$newDriveIdArr = [];
$finalDrivesArray = [];

if ($userId == '') {
    $success = false;
    $message = 'You need to be signed in to view drives';
}
$driveIdArr = [];

if ($success) {
    //Gather matching drive ids for author
    $sqlnew = " SELECT DISTINCT 
  d.driveId AS driveId
   FROM drive AS d
  LEFT JOIN drive_user AS du
  ON d.driveId = du.driveId
  WHERE du.userId='devuserid'  AND d.isDeleted = '0'
  ";

    $result = $conn->query($sqlnew);

    while ($row = $result->fetch_assoc()) {
        $newdriveId = $row['driveId'];
        array_push($driveIdArr, $newdriveId);

        $sql = "
  SELECT
  d.driveId AS driveId,
  d.label AS label,
  d.driveType AS driveType,
  d.isShared AS isShared,
  d.isPublic AS isPublic,
  d.image AS image,
  d.color AS color,
  du.role AS role
  FROM drive AS d
  LEFT JOIN drive_user AS du
  ON d.driveId = du.driveId
  WHERE du.userId='$userId' AND du.driveId = '$newdriveId'
  AND d.isDeleted = '0'
  ";
        $resultnew = $conn->query($sql);
        while ($rownew = $resultnew->fetch_assoc()) {
            $driveAndLabel = [
                'driveId' => $rownew['driveId'],
                'label' => $rownew['label'],
                'type' => $rownew['driveType'],
                'subType' => 'Administrator',
                'isShared' => $rownew['isShared'],
                'isPublic' => $rownew['isPublic'],
                'image' => $rownew['image'],
                'color' => $rownew['color'],
                'role' => $rownew['role'],
            ];
            array_push($driveIdsAndLabels, $driveAndLabel);
        }
    }

    for ($x = 0; $x < count($driveIdArr); $x++) {
        $dId = $driveIdArr[$x];
        $roleArr = [];
        for ($y = 0; $y < count($driveIdsAndLabels); $y++) {
            if ($driveIdsAndLabels[$y]['driveId'] == $dId) {
                array_push($roleArr, $driveIdsAndLabels[$y]['role']);

                $roleArrUpdate = $driveIdsAndLabels[$y];
                $roleArrUpdate['role'] = $roleArr;
                array_push($newDriveIdArr, $roleArrUpdate);
            }
        }
    }
              for ($z = 0; $z < count($newDriveIdArr); $z++) {
                  foreach ($newDriveIdArr as $key => $value) {
                      if ($value['driveId'] === $newDriveIdArr[$z]['driveId']) {
                          unset($finalDrivesArray[$key]);
                          array_push($finalDrivesArray, $newDriveIdArr[$z]);
                      } 
                  } 
              }
      // $finalDriveIdsandLabelsArr = [];
      //         for($s = 0; $s < count($finalDrivesArray); $s++){
      //           echo $finalDrivesArray[$s];
      //             array_push($finalDriveIdsandLabelsArr, $finalDrivesArray[$s]);
      //         }


}

$response_arr = [
    'success' => $success,
    'driveIdsAndLabels' => $finalDrivesArray,
    'message' => $message,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
