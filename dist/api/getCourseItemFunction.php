<?php

function nullishCoalesce(&$value, $default) {
	return isset($value) ? $value : $default;
}

function getCourseItemFunction($conn,$type,$doenetId){

  if ($type == 'page'){
    $sql = "
				SELECT 
				doenetId,
				containingDoenetId,
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
      "label"=>$row['label']
    );
    //Note: no isOpen as pages don't open
    //also no parentDoenetId as we transverse activities on the browser side
    $item['isSelected'] = false; 

  }else{

    $sql = "
    SELECT 
    cc.doenetId,
    cc.type,
    cc.parentDoenetId,
    cc.label,
    cc.creationDate,
    cc.isAssigned,
    cc.isGloballyAssigned,
    cc.isPublic,
    CAST(cc.jsonDefinition as CHAR) AS json,
    a.timeLimit,
    a.assignedDate,
    a.dueDate,
    a.showCorrectness,
    a.showCreditAchievedMenu,
    a.paginate,
    a.showFinishButton,
    a.showFeedback,
    a.showHints,
    a.showSolution,
    a.proctorMakesAvailable,
    a.numberOfAttemptsAllowed
    FROM course_content AS cc
    LEFT JOIN
    assignment AS a
    ON cc.doenetId=a.doenetId
    WHERE cc.doenetId = '$doenetId'
    AND cc.isDeleted = '0'
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
      "assignedDate" => $row['assignedDate'],
      "dueDate" => $row['dueDate'],
      "timeLimit" => $row['timeLimit'],
      "numberOfAttemptsAllowed" => $row['numberOfAttemptsAllowed'],
      "showSolution" => nullishCoalesce($row['showSolution'], "1") == '1' ? true : false,
      "showFeedback" => nullishCoalesce($row['showFeedback'], '1') == '1' ? true : false,
      "showHints" => nullishCoalesce($row['showHints'], '1') == '1' ? true : false,
      "showCorrectness" => nullishCoalesce($row['showCorrectness'], '1') == '1' ? true : false,
      "showCreditAchievedMenu" => nullishCoalesce($row['showCreditAchievedMenu'], '1') == '1' ? true : false,
      "paginate" => nullishCoalesce($row['paginate'], '1') == '1' ? true : false,
      "showFinishButton" => nullishCoalesce($row['showFinishButton'], '0') == '1' ? true : false,
      "proctorMakesAvailable" => nullishCoalesce($row['proctorMakesAvailable'], '0') == '1' ? true : false,
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