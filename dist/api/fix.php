<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
// header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
// header('Content-Type: application/json');

include 'db_connection.php';

$jwtArray = include 'jwtArray.php';



    //Gather DoenetIds
    $sql = "
    SELECT dc.doenetId as doenetId,
    dc.driveId as driveId
FROM drive_content as dc
LEFT JOIN assignment as a
ON a.doenetId = dc.doenetId
WHERE a.doenetId IS NULL
AND dc.itemType = 'DoenetML'
 ";

$doenetIds = array();
$driveIds = array();

$result = $conn->query($sql);
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
        array_push($doenetIds,$row['doenetId']);
        array_push($driveIds,$row['driveId']);
    }
}
// echo count($doenetIds);

for($i = 0; $i < count($doenetIds) ;$i++){
$doenetId = $doenetIds[$i];
$driveId = $driveIds[$i];
    $sql="
SELECT contentId
FROM content
WHERE doenetId = '$doenetId'
AND isDraft = '1'
";

$result = $conn->query($sql);
$row = $result->fetch_assoc();
$contentId = $row['contentId'];
echo ($i + 1) . ' - ' . $doenetId . "<br />";
// echo $driveId .  "<br />";
// echo $contentId .  "<br /><br />";


//Make Assignments
$sql="
INSERT INTO assignment
(
doenetId,
contentId,
driveId,
assignedDate,
dueDate,
timeLimit,
numberOfAttemptsAllowed,
attemptAggregation,
totalPointsOrPercent,
gradeCategory,
individualize,
multipleAttempts,
showSolution,
showFeedback,
showHints,
showCorrectness,
proctorMakesAvailable)
VALUES
(
'$doenetId',
'$contentId',
'$driveId',
NOW(),
NOW(),
'60',
'1',
'm',
'100',
'l',
'0',
'1',
'1',
'1',
'1',
'1',
'0')
";
$result = $conn->query($sql);


}


          

// set response code - 200 OK
http_response_code(200);

$conn->close();

?>