<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include "db_connection.php";


$_POST = json_decode(file_get_contents("php://input"),true);
$number_filters = count($_POST["filters"]);
$folderOnly =  mysqli_real_escape_string($conn,$_POST["folderOnly"]);
$contentOnly = mysqli_real_escape_string($conn,$_POST["contentOnly"]);


// get all folders that satisfy conditions -> folderList
// get children of folders (rootId in folderList)

// get all content -> contentList

$folder_info_arr = array();
$fi_array = array();
$all_fi_array = array();
$branchId_info_arr = array();
$sort_order_arr = array();
$ci_array = array();

if (!$contentOnly) {
  
  // $filter_sql="
  // SELECT  -- get all matched folders 
  //   f.folderId as folderId,
  //   f.title as title,
  //   f.parentId as parentId,
  //   f.creationDate as creationDate,
  //   f.isRepo as isRepo,
  //   f.public as isPublic,
  //   f.folderId as rootId
  // FROM folder AS f
  // WHERE f.public=1";

  // for ($i = 0; $i < $number_filters; $i++) {
  //   // append filter to query
  //   $nextFilter =  stripslashes(mysqli_real_escape_string($conn,$_POST["filters"][$i]));
  //   $filter_sql .= " AND $nextFilter";
  // }

  // echo $filter_sql;

  // $result = $conn->query($filter_sql); 
  // $response_arr = array();
  // if ($result->num_rows > 0){
  //   while($row = $result->fetch_assoc()){ 
  //     array_push($fi_array, $row["folderId"]);
  //     array_push($all_fi_array, $row["folderId"]);
  //     $folder_info_arr[$row["folderId"]] = array(
  //           "title" => $row["title"],
  //           "publishDate" => $row["creationDate"],
  //           "parentId" => $row["parentId"],
  //           "rootId" => $row["rootId"],
  //           "childContent" => array(),
  //           "childFolders" => array(),
  //           "isRepo" => ($row["isRepo"] == 1),
  //           "isPublic" => ($row["isPublic"] == 1)
  //     );
  //   }
  // }

  // $filter_sql="
  // SELECT f.folderId as folderId
  // FROM folder AS f
  // WHERE f.public=1";

  // for ($i = 0; $i < $number_filters; $i++) {
  //   // append filter to query
  //   $nextFilter =  stripslashes(mysqli_real_escape_string($conn,$_POST["filters"][$i]));
  //   $filter_sql .= " AND $nextFilter";
  // }

  // $sql="
  // SELECT  -- get all nested folders
  //   f.folderId as folderId,
  //   f.title as title,
  //   f.parentId as parentId,
  //   f.creationDate as creationDate,
  //   f.isRepo as isRepo,
  //   f.public as isPublic,
  //   fc.rootId as rootId
  // FROM folder_content AS fc
  // LEFT JOIN folder f ON fc.childId = f.folderId
  // WHERE fc.removedFlag=0 AND rootId IN (" . 
  // $filter_sql . ") AND fc.childType='folder'";

  // $result = $conn->query($sql); 
  // if ($result->num_rows > 0){
  //   while($row = $result->fetch_assoc()){ 
  //     array_push($all_fi_array, $row["folderId"]);
  //     $folder_info_arr[$row["folderId"]] = array(
  //           "title" => $row["title"],
  //           "publishDate" => $row["creationDate"],
  //           "parentId" => $row["parentId"],
  //           "rootId" => $row["rootId"],
  //           "childContent" => array(),
  //           "childFolders" => array(),
  //           "isRepo" => ($row["isRepo"] == 1),
  //           "isPublic" => ($row["isPublic"] == 1)
  //     );
  //   }
  // }

  // // get children content and folders
  // $sql="
  // SELECT 
  // fc.folderId as folderId,
  // fc.childId as childId,
  // fc.childType as childType,
  // fc.timestamp as creationDate,
  // f.public as public
  // FROM folder_content AS fc
  // LEFT JOIN folder f ON fc.childId = f.folderId
  // WHERE fc.removedFlag=0 AND f.public=1 AND fc.folderId IN ('".implode("','",$all_fi_array)."')
  // ORDER BY fc.folderId
  // ";

  // $result = $conn->query($sql); 

  // if ($result->num_rows > 0){
  //   while($row = $result->fetch_assoc()){ 
  //     if ($row["childType"] == "content") {
  //       array_push($folder_info_arr[$row["folderId"]]["childContent"], $row["childId"]);
  //     } else if ($row["childType"] == "folder"){
  //       array_push($folder_info_arr[$row["folderId"]]["childFolders"], $row["childId"]);
  //     }
  //   }
  // }

  // $sql = "
  // SELECT  -- get children content 
  //   c.branchId as branchId,
  //   c.title as title,
  //   c.contentId as contentId,
  //   c.timestamp as publishDate,
  //   c.removedFlag as removedFlag,
  //   c.draft as draft,
  //   fc.rootId as rootId, 
  //   fc.folderId as parentId,
  //   c.public as public
  // FROM content AS c
  // LEFT JOIN folder_content fc ON fc.childId = c.branchId
  // WHERE fc.childType='content' AND c.removedFlag=0
  // AND rootId IN ("
  // . $filter_sql .   
  // ")
  // ORDER BY branchId, publishDate DESC
  // ";

          
  // if ($result->num_rows > 0){
  //   while($row = $result->fetch_assoc()){ 
            
  //       $end_bi = end($sort_order_arr);
  //       $bi = $row["branchId"]; 
        
  //       $ci = array(
  //               "contentId"=> $row["contentId"],
  //               "publishDate"=> $row["publishDate"],
  //               "draft"=> $row["draft"]
  //       );
        
  //       //     echo "$bi\n";
  //       //     echo $row["contentId"]."\n";
  //       //     var_dump($ci);
  //       //     echo "\n----\n\n";
  //       if ($bi != $end_bi){
  //               if ($end_bi !== false){ //Only add when we have a branchId
  //                       $branchId_info_arr[$end_bi]["contentIds"] = $ci_array;
  //                       $ci_array = array();
  //               }
  //               $branchId_info_arr[$bi] = array(
  //               "title"=>$row["title"],
  //               "publishDate" => "",
  //               "draftDate" => "",
  //               "parentId" => $row["parentId"]
  //               );
  //               array_push($sort_order_arr,$bi);
  //       }
  //       if ($row["draft"] == 1) {
  //               $branchId_info_arr[$bi]["draftDate"] = $row["publishDate"];       
  //       }
  //       else if ($row["draft"] == 0) {
  //               if ($branchId_info_arr[$bi]["publishDate"] <= $row["publishDate"]) {
  //                       $branchId_info_arr[$bi]["publishDate"] = $row["publishDate"];               
  //               }                        
  //       }
  //       array_push($ci_array,$ci);
  //   }
  //   if ($end_bi !== false){ //Only add when we have a branchId
  //       $branchId_info_arr[$end_bi]["contentIds"] = $ci_array;
  //   }
  // }  
}

$sort_order_arr = array();
$ci_array = array();

if (!$folderOnly) {
  $sql="
  SELECT   -- get personal content
    c.branchId as branchId,
    c.title as title,
    c.contentId as contentId,
    c.timestamp as publishDate,
    c.removedFlag as removedFlag,
    c.draft as draft,
    'root' as rootId, 
    'root' as parentId,
    c.public as public
  FROM content AS c
  WHERE c.removedFlag=0 AND c.public=1";

  for ($i = 0; $i < $number_filters; $i++) {
    // append filter to query
    $nextFilter =  stripslashes(mysqli_real_escape_string($conn,$_POST["filters"][$i]));
    $sql .= " AND $nextFilter";
  }
  
  $sql .= " ORDER BY branchId, publishDate DESC";

  $result = $conn->query($sql); 
  $response_arr = array();
  $ci_array = array();
          
  if ($result->num_rows > 0){
      while($row = $result->fetch_assoc()){ 
              
          $end_bi = end($sort_order_arr);
          $bi = $row["branchId"]; 
          
          $ci = array(
                  "contentId"=> $row["contentId"],
                  "publishDate"=> $row["publishDate"],
                  "draft"=> $row["draft"]
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
                  "publishDate" => "",
                  "draftDate" => "",
                  "parentId" => $row["parentId"]
                  );
                  array_push($sort_order_arr,$bi);
          }
          if ($row["draft"] == 1) {
                  $branchId_info_arr[$bi]["draftDate"] = $row["publishDate"];       
          }
          else if ($row["draft"] == 0) {
                  if ($branchId_info_arr[$bi]["publishDate"] <= $row["publishDate"]) {
                          $branchId_info_arr[$bi]["publishDate"] = $row["publishDate"];               
                  }                        
          }
          array_push($ci_array,$ci);
      }
      if ($end_bi !== false){ //Only add when we have a branchId
          $branchId_info_arr[$end_bi]["contentIds"] = $ci_array;
      }
  }
}

$response_arr = array(
  "folderInfo"=>$folder_info_arr,
  "folderIds"=>$fi_array,
  "branchId_info"=>$branchId_info_arr,
  "sort_order"=>$sort_order_arr,
);
    
// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();


?>