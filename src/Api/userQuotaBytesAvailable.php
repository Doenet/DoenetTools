<?php

function getBytesAvailable($conn,$userId){
  $quotaBytes = 1073741824; // 1 GB QUOTA

//Calculate quota remaining after change
//Based on unique contentIds, so bytes countent just once
$sql = "
SELECT SUM(sizeInBytes) AS totalBytes FROM
(SELECT DISTINCT(contentId), sizeInBytes
FROM support_files
WHERE userId='$userId'
AND NOT (isListed='1' AND isPublic='1')) T1
";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$userQuotaBytesAvailable = $quotaBytes - $row['totalBytes'];

return [$userQuotaBytesAvailable,$quotaBytes];
}

?>
