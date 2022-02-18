<?php

function getFileName($CID,$fileType){
  if ($fileType == 'image/jpeg'){
    return "$CID.jpg";
  }else if ($fileType == 'image/png'){
    return "$CID.png";
  }
}

?>
