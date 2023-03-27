<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
// header('Content-Type: application/json');

include "db_connection.php";
include "getFilename.php";

$success = true;
$uploads_dir = '../media/';

$sql = "
SELECT cid,fileType,sizeInBytes
FROM ipfs_to_upload
ORDER BY timestamp
";
$result = $conn->query($sql);

$count_to_upload = $result->num_rows;
$count_uploaded = 0;
$array_of_cid_to_delete = [];

while($row = $result->fetch_assoc()) {
  $cid = $row['cid'];
  $type = $row['fileType'];

  $resource_path = $uploads_dir . getFileName($cid,$type);

  $thefileHandle = fopen($resource_path, 'r');
  $thefile = fread($thefileHandle,filesize($resource_path));
  fclose($thefileHandle);


  $url = "https://api.web3.storage/upload";
  $token = $ini_array['web3storagetoken'];

  $postField = array();
  $headers = array(
          "Authorization: Bearer $token",
          // "Content-Type: multipart/form-data"
  );

  $curl_handle = curl_init();
  curl_setopt($curl_handle, CURLOPT_URL, $url);
  curl_setopt($curl_handle, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($curl_handle, CURLOPT_POST, TRUE);
  curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $thefile);

  curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, TRUE);
  $cid_info_raw = curl_exec($curl_handle);
  curl_close($curl_handle);

  $cid_info = json_decode($cid_info_raw,true);

  if (array_key_exists("cid",$cid_info) && $cid_info['cid'] == $cid){
    //Upload success!  Delete row from table in db
    $count_uploaded = $count_uploaded + 1;
    array_push($array_of_cid_to_delete,$cid);
  }

}

foreach ($array_of_cid_to_delete as $cid){
  echo "uploaded $cid <br />";
  $sql = "
  DELETE FROM ipfs_to_upload
  WHERE cid = '$cid'
  ";
  $result = $conn->query($sql);
}


echo "Script complete: $count_uploaded/$count_to_upload uploaded. \n";

http_response_code(200);

$conn->close();
?>