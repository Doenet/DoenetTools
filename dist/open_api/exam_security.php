<?php

$browserKey = $_SERVER[ 'HTTP_X_SAFEEXAMBROWSER_REQUESTHASH' ];
$full_url = "https://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";

$sql = "
SELECT browserExamKeys
FROM course
WHERE courseId = '$courseId'
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$examKeys = explode("\n",$row["browserExamKeys"]);

$legitAccessKey = 0;

foreach ($examKeys as $examKey){
  $source = $full_url . trim($examKey);
  $newhash = hash("sha256",$source);
  if ($newhash == $browserKey){
    $legitAccessKey = 1;
    break;
  }
}

//bypass security by uncommenting this line
// $legitAccessKey = 1;

?>
