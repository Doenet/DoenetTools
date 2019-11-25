<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$sql="
SELECT 
 c.branchId as branchId,
 c.title as title,
 c.contentId as contentId,
 c.timestamp as publishDate
FROM content AS c
WHERE removedFlag = 0
AND draft = 0
ORDER BY c.branchId, c.timestamp DESC
";

$result = $conn->query($sql); 
$response_arr = array();
$branchId_info_arr = array();
$sort_order_arr = array();
$ci_array = array();

         
if ($result->num_rows > 0){

    while($row = $result->fetch_assoc()){ 
            
        $end_bi = end($sort_order_arr);
        $bi = $row["branchId"]; 
        $ci = array(
                "contentId"=> $row["contentId"],
                "publishDate"=> $row["publishDate"]
         );
        //     echo "$bi\n";
        //     echo $row["contentId"]."\n";
        //     var_dump($ci);
        //     echo "\n----\n\n";

        if ($bi != $end_bi){
                if ($end_bi !== false){ //Only add when we have a branchId
                        $branchId_info_arr[$end_bi]["contentIds"] = $ci_array;
                        $ci_array = array();
                }
                $branchId_info_arr[$bi] = array(
                "title"=>$row["title"],
                "publishDate" => $row["publishDate"],
                );
                array_push($sort_order_arr,$bi);

        }
        array_push($ci_array,$ci);


    }
    if ($end_bi !== false){ //Only add when we have a branchId
        $branchId_info_arr[$end_bi]["contentIds"] = $ci_array;
    }

}
$response_arr = array(
        "branchId_info"=>$branchId_info_arr,
        "sort_order"=>$sort_order_arr,
);
    
 // set response code - 200 OK
 http_response_code(200);
     

 // make it json format
 echo json_encode($response_arr);
$conn->close();


?>
           
