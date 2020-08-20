<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$_POST = json_decode(file_get_contents("php://input"),true);
var_dump($_POST);
// $courseId = mysqli_real_escape_string($conn,$_POST["courseId"]);
// $branchIds = array_map(function($branchId) use($conn) {
// return mysqli_real_escape_string($conn, $branchId);
// }, $_POST['branchIds']);

// $sql = "
// SELECT userId,
// firstName,
// lastName,
// email,
// empId,
// dateEnrolled,
// section
// FROM course_enrollment
// WHERE withdrew = '0'
// AND courseId = '$courseId'
// ORDER BY firstName
// ";
// $result = $conn->query($sql);

// $enrollmentArray = array();
// 		while ($row = $result->fetch_assoc()){
// 			$learner = array(
// 				"userId"=>$row["userId"],
// 				"firstName"=>$row["firstName"],
// 				"lastName"=>$row["lastName"],
// 				"email"=>$row["email"],
// 				"empId"=>$row["empId"],
// 				"dateEnrolled"=>$row["dateEnrolled"],
// 				"section"=>$row["section"]
// 			);
// 			array_push($enrollmentArray,$learner);
// 		}
// $response_arr = array(
// 	"success" => 1,
// 	"enrollmentArray" => $enrollmentArray,
// );
         

//  http_response_code(200);

//  // make it json format
//  echo json_encode($response_arr);

$conn->close();

?>

