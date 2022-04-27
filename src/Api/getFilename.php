<?php

function getFileName($cid,$fileType){
  if ($fileType == 'image/jpeg'){
    return "$cid.jpg";
  }else if ($fileType == 'image/png'){
    return "$cid.png";
  }else if ($fileType == 'text/doenetML'){
    //consider munged XML as the mimetype
    return "$cid.doenet";
  }
}

?>
