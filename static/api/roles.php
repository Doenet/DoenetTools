<?php
$roleAccessList = array(
  "roleStudent" => array("Chooser", "Course", "Profile"),
  "roleInstructor" => array("Chooser", "Course", "Documentation", "Gradebook", "Profile"),
  "roleCourseDesigner" => array("Chooser", "Course", "Documentation", "Profile"),
  "roleWatchdog" => array(/*???*/"Profile"),
  "roleCommunityTA" => array(/*???*/"Profile"),
  "roleLiveDataCommunity" => array(/*???*/"Profile")
);

$toolAccessList = [];
if ($roles != []) {
  for ($i = 0; $i < count($roles); $i++) {
    $toolAccessList = array_values(array_unique(array_merge($toolAccessList, $roleAccessList[$roles[$i]])));
  }
}