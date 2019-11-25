<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');


include "db_connection.php";


$sql = "SELECT code.id as id,
	   code.branchId as branchId,
	   documentName,
	   code,
	   tagName
 FROM code LEFT JOIN tag ON code.branchId = tag.branchId ORDER BY code.id";

$result = $conn->query($sql); 
$response_arr = array();
         
if ($result->num_rows > 0){

    while($row = $result->fetch_assoc()){ 
	$docTags = array();
	if ($row["tagName"] !== ""){
	  array_push($docTags,$row["tagName"]);
	}
        $row_arr = array( 
            "branchId" => $row["branchId"],
            "documentName" => $row["documentName"],
            "code" => $row["code"],
	    "docTags" => $docTags,
           );
	if ($row["branchId"] === end($response_arr)["branchId"]){
        $previous = array_pop($response_arr);   
	$docTags = array_merge($previous["docTags"],$docTags);
        $updated_row_arr = array(  
            "branchId" => $row["branchId"],
            "documentName" => $row["documentName"],
            "code" => $row["code"],
            "docTags" => $docTags,
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
           
