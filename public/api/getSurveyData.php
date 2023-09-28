<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
include 'permissionsAndSettingsForOneCourseFunction.php';

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];

$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);


$response_arr;
try {

  $sql= "
  SELECT courseId,
  label
  FROM course_content
  WHERE doenetId='$doenetId'
  ";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  $courseId = $row['courseId'];
  $label = $row['label'];
}else{
  throw new Exception("Activity $doenetId not found.");
}

  $requestorPermissions = permissionsAndSettingsForOneCourseFunction(
    $conn,
    $userId,
    $courseId
);

if ($requestorPermissions['dataAccessPermission'] != 'Identified') {
    throw new Exception("You need to have Identified data access in order to view data.");
}

  $sql = "SELECT u.firstName,
  u.lastName,
  u.email,
  cu.externalId,
  ps.coreState
  FROM 
    (SELECT userId, MAX(id) AS max_id
    FROM page_state
    WHERE doenetId = '$doenetId'
    GROUP BY userId) AS max_ps
  JOIN page_state AS ps
    ON ps.userId = max_ps.userId AND ps.id = max_ps.max_id
  LEFT JOIN assignment AS a
    ON a.doenetId = ps.doenetId
  LEFT JOIN course_user AS cu
    ON cu.userId = ps.userId AND a.courseId = cu.courseId
  LEFT JOIN user As u
    ON ps.userId = u.userId
  WHERE ps.doenetId = '$doenetId'
  ORDER BY ps.id;
  ";

$result = $conn->query($sql); 
$responses = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()){
      array_push($responses,array(
                "firstName"=>$row['firstName'],
                "lastName"=>$row['lastName'],
                "studentId"=>$row['externalId'],
                "email"=>$row['email'],
                "stateVariables"=>$row['coreState'],
      ));
    }
}


$response_arr = [
  'success' => true,
  'courseId' => $courseId,
  'label' => $label,
  'responses' => $responses,
];

    // set response code - 200 OK
    http_response_code(200);

} catch (Exception $e) {
    $response_arr = [
        'success' => false,
        'message' => $e->getMessage(),
    ];
    http_response_code(400);

} finally {
    // make it json format
    echo json_encode($response_arr);
    $conn->close();
}
?>