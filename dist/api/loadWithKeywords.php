<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
/*
in order to load createDate and UpdateDate info
i modify this file by having $sql1 and $result1
*/
include "db_connection.php";

/*$sql = "
SELECT c.id as id,
 c.branchId as branchId,
 c.title,
 c.contentId,
 c.doenetML,
 k.keyword
 FROM content AS c
  LEFT JOIN keyword AS k
 ON c.branchId = k.branchId 
 WHERE c.removedFlag = 0 AND c.draft = 1
 ORDER BY c.id
";*/

$sql="
SELECT c.id as id,
 c.branchId as branchId,
 c.title,
 c.contentId,
 c.doenetML,
 c.keyword,
 cb.creationDate,
 cb.updateDate
FROM (SELECT c.id as id,
 c.branchId as branchId,
 c.title,
 c.contentId,
 c.doenetML,
 k.keyword
 FROM content AS c
  LEFT JOIN keyword AS k
 ON c.branchId = k.branchId 
 WHERE c.removedFlag = 0 AND c.draft = 1
 ORDER BY c.id) as c , content_branch as cb
 WHERE cb.branchId = c.branchId
";

$result = $conn->query($sql); 
$response_arr = array();
         
if ($result->num_rows > 0){

    while($row = $result->fetch_assoc()){ 
	$docTags = array();
	if ($row["keyword"] !== NULL){
	  array_push($docTags,$row["keyword"]);
	}
        $row_arr = array( 
            "branchId" => $row["branchId"],
            "title" => $row["title"],
            "doenetML" => $row["doenetML"],
	    "docTags" => $docTags,
            "contentId" => $row["contentId"],
            "creationDate" => $row["creationDate"],//newly added
            "updateDate" => $row["updateDate"]//newly added
           );
	if ($row["branchId"] === end($response_arr)["branchId"]){
        $previous = array_pop($response_arr);   
	$docTags = array_merge($previous["docTags"],$docTags);
        $updated_row_arr = array(  
            "branchId" => $row["branchId"],
            "title" => $row["title"],
            "doenetML" => $row["doenetML"],
            "docTags" => $docTags,
            "creationDate" => $row["creationDate"], //newly added 
            "updateDate" => $row["updateDate"]//newly added
           );   
        array_push($response_arr,$updated_row_arr);
	}else{
	//next content so add to the response 
        array_push($response_arr,$row_arr);
	} 
    }
}
    
 // set response code - 200 OK
 http_response_code(200);
     

 // make it json format
 echo json_encode($response_arr);
$conn->close();


?>
           
