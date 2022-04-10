<?php

function getCourseItemFunction($conn,$type,$doenetId){

  if ($type == 'page'){
    $sql = "
				SELECT 
				doenetId,
				containingDoenetId,
				cid,
				draftCid,
				label
				FROM pages
				WHERE doenetId = '$doenetId'
				";
				$result = $conn->query($sql);
        $row = $result->fetch_assoc();
    $item = array(
      "type"=>"page",
      "doenetId"=>$row['doenetId'],
      "containingDoenetId"=>$row['containingDoenetId'],
      "cid"=>$row['cid'],
      "draftCid"=>$row['draftCid'],
      "label"=>$row['label']
    );
    $item['isSelected'] = false; //Note: no isOpen
  }else{

    $sql = "
    SELECT 
    doenetId,
    type,
    parentDoenetId,
    label,
    creationDate,
    isAssigned,
    isGloballyAssigned,
    isPublic,
    CAST(jsonDefinition as CHAR) AS json
    FROM course_content
    WHERE doenetId = '$doenetId'
    ";
    $result = $conn->query($sql); 
    $row = $result->fetch_assoc();
    
    
    $item = array(
      "doenetId"=>$row['doenetId'],
      "type"=>$row['type'],
      "parentDoenetId"=>$row['parentDoenetId'],
      "label"=>$row['label'],
      "creationDate"=>$row['creationDate'],
      "isAssigned"=>$row['isAssigned'],
      "isGloballyAssigned"=>$row['isGloballyAssigned'],
      "isPublic"=>$row['isPublic'],
    );
    
    $json = json_decode($row['json'],true);
    // var_dump($json);
    $item = array_merge($json,$item);
    
    
    $item['isOpen'] = false;
    $item['isSelected'] = false;
    
  }

  return $item;
}

?>