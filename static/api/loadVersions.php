<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

$branchId =  mysqli_real_escape_string($conn,$_REQUEST["branchId"]);

$sql="
SELECT 
 c.contentId AS contentId,
 c.title AS title,
 c.timestamp AS timestamp,
 c.isDraft AS isDraft
FROM content AS c
WHERE removedFlag = 0
AND branchId = '$branchId'
ORDER BY c.timestamp ASC
";

$result = $conn->query($sql); 
$versions_arr = array();         
if ($result->num_rows > 0){

    while($row = $result->fetch_assoc()){ 
        $version = array(
                "title"=>$row['title'],
                "contentId"=>$row['contentId'],
                "timestamp"=>$row['timestamp'],
                "isDraft"=>$row['isDraft']
        );
        array_push($versions_arr,$version);
    }
}

$response_arr = array(
        "success"=>true,
        "versions"=>$versions_arr
);
    
 // set response code - 200 OK
 http_response_code(200);
     

 // make it json format
 echo json_encode($response_arr);
$conn->close();


?>
           
