<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
//header('Content-Type: application/json');


include "db_connection.php";

$jwtArray = include "jwtArray.php";
// $userId = $jwtArray['userId'];


$doenetId = mysqli_real_escape_string($conn,$_REQUEST["doenetId"]);
$code = mysqli_real_escape_string($conn,$_REQUEST["code"]);
$paramUserId = mysqli_real_escape_string($conn,$_REQUEST["userId"]);

$success = TRUE;
$message = "";

if ($doenetId == ""){
$success = FALSE;
$message = 'Internal Error: missing doenetId';
}elseif ($code == ''){
$success = FALSE;
$message = 'Internal Error: missing code';    
}

//IF code is defined that indicates we can't trust the userId
if ($success){
  //Check if code is legit
  $sql = "
  SELECT cc.doenetId
FROM course_content AS cc
INNER JOIN course AS c
ON cc.courseId = c.courseId
WHERE cc.doenetId = '$doenetId'
AND c.examPasscode ='$code'
  ";
  $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        //We can trust this comes from staff
        $userId = $paramUserId;
    }else{
        $success = FALSE;
        $message = 'Error: doenetId or code are wrong';
    }

}

if ($success){

  $sql = "SELECT attemptNumber
        FROM user_assignment_attempt
        WHERE userId='$userId'
        AND doenetId='$doenetId'
        ORDER BY attemptNumber DESC
        LIMIT 1";


  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  $attemptNumber = $row['attemptNumber'] + 1;


    $sql = "INSERT INTO user_assignment_attempt
    SET doenetId='$doenetId', userId='$userId', attemptNumber='$attemptNumber'
    ";
    $result = $conn->query($sql);

    //Add info if it's missing from user_assignment
    $sql = "
    SELECT userId
    FROM user_assignment
    WHERE userId = '$userId'
    AND doenetId = '$doenetId'
    ";
    $result = $conn->query($sql); 

    if ($result->num_rows == 0){

      $sql = "INSERT INTO user_assignment
      SET doenetId='$doenetId', userId='$userId'
      ";
      $result = $conn->query($sql);
    }

  
}

$response_arr = array(
        "success"=>$success,
        "message"=>$message
);

http_response_code(200);

echo json_encode($response_arr);

$conn->close();

?>

