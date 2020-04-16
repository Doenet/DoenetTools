<?php
$roleAccessList = array(
  "roleStudent" => array("chooser", "course", "gradebook", "profile"),
  "roleInstructor" => array("chooser", "course", "documentation", "gradebook", "profile"),
  "roleCourseDesigner" => array("chooser", "course" /*?*/, "documentation", "profile"),
  "roleWatchdog" => array(/*???*/"profile"),
  "roleCommunityTA" => array(/*???*/"profile"),
  "roleLiveDataCommunity" => array(/*???*/"profile")
);

$toolAccessList = [];
if ($roles != []) {
  for ($i = 0; $i < count($roles); $i++) {
    $toolAccessList = array_values(array_unique(array_merge($toolAccessList, $roleAccessList[$roles[$i]])));
  }
}

