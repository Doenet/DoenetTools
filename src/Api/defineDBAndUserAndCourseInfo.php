<?php
//TODO: Kevin, Emilio – discus True / False vs '1' / '0' returns

include "db_connection.php";
error_reporting(E_ERROR | E_PARSE);


// $jwtArray = include "jwtArray.php"; //TODO: migrate to this one 

$key = $ini_array['key'];
use \Firebase\JWT\JWT;
require_once "vendor/autoload.php";


$jwt =  mysqli_real_escape_string($conn,$_COOKIE["JWT"]);
$jwt_array = array();

if ($jwt != ""){
    $jwt_array = (array) JWT::decode($jwt, $key, array('HS256'));
    $userId = array_key_exists("userId",$jwt_array) ? $jwt_array['userId'] : "";
}

$ejwt_array = array();
if (array_key_exists("EJWT",$_COOKIE)){
  //Keep euserId and userId separate keys so we know the source
  $ejwt =  mysqli_real_escape_string($conn,$_COOKIE["EJWT"]);

  if ($ejwt != ""){
    $ejwt_array = (array) JWT::decode($ejwt, $key, array('HS256'));
    $examUserId = array_key_exists("examineeUserId",$ejwt_array) ? $ejwt_array['examineeUserId'] : "";
    $examDoenetId = array_key_exists("doenetId",$ejwt_array) ? $ejwt_array['doenetId'] : "";
    $examPasscode = array_key_exists("examPasscode",$ejwt_array) ? $ejwt_array['examPasscode'] : "";
  }
}


// echo "userId -$userId-\n";
// echo "examUserId -$examUserId-\n";
// echo "examDoenetId -$examDoenetId-\n";
// echo "examPasscode -$examPasscode-\n";


//Test course's passcode if it matches the courseId for that doenetId 
//then allow userId to be defined as exam userId
//If examUserId is defined at all and doesn't match then return empty info
//If it does match then return student permissions.

$permissionsAndSettings = [];

if (array_key_exists("examineeUserId",$ejwt_array)){

    //TODO: code should be by proctor
    //TEST the examcode
    $sql = "
    SELECT c.courseId
    FROM course_content AS cc
    INNER JOIN course AS c
    ON c.courseId = cc.courseId
    WHERE cc.doenetId = '$examDoenetId'
    AND c.examPasscode = '$examPasscode'
    ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {

    $sql = "SELECT
    c.courseId,
    c.label,
    c.isPublic,
    c.image,
    c.color,
    c.defaultRoleId
    FROM course_content AS cc
    LEFT JOIN course AS c
    ON c.courseId = cc.courseId
    WHERE cc.doenetId = '$examDoenetId'
    AND c.isDeleted = '0'
    ";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        $oneCourse = [
            'courseId' => $row['courseId'],
            'label' => $row['label'],
            'isPublic' => $row['isPublic'],
            'image' => $row['image'],
            'color' => $row['color'],
            'defaultRoleId' => $row['defaultRoleId'],
            'roleId' => $row['roleId'],
            'roleLabel' => $row['roleLabel'],
            'isIncludedInGradebook' => '1',
            'canViewContentSource' => '0',
            'canEditContent' => '0',
            'canPublishContent' => '0',
            'canViewUnassignedContent' => '0',
            'canProctor' => '0',
            'canViewAndModifyGrades' => '0',
            'canViewActivitySettings' => '0',
            'canModifyActivitySettings' => '0',
            'canModifyCourseSettings' => '0',
            'canViewUsers' => '0',
            'canManageUsers' => '0',
            'isAdmin' => '0',
            'dataAccessPermission' => '0',
            'isOwner' => '0',
        ];
        array_push($permissionsAndSettings, $oneCourse);
    }
    }

}else{


    $sql = "SELECT
    c.courseId,
    c.label,
    c.isPublic,
    c.image,
    c.color,
    c.defaultRoleId,
    cr.roleId,
    cr.label AS roleLabel,
    cr.isIncludedInGradebook,
    cr.canViewContentSource,
    cr.canEditContent,
    cr.canPublishContent,
    cr.canViewUnassignedContent,
    cr.canProctor,
    cr.canViewAndModifyGrades,
    cr.canViewActivitySettings,
    cr.canModifyActivitySettings,
    cr.canModifyCourseSettings,
    cr.canViewUsers,
    cr.canManageUsers,
    cr.isAdmin,
    cr.dataAccessPermission,
    cr.isOwner
    FROM course_role AS cr
    LEFT JOIN course_user as cu
    ON cu.roleId = cr.roleId
    RIGHT JOIN course AS c
    ON c.courseId = cu.courseId
    WHERE cu.userId = '$userId'
    AND c.isDeleted = '0'
    ORDER BY c.id DESC
    ";


    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $oneCourse = [
                'courseId' => $row['courseId'],
                'label' => $row['label'],
                'isPublic' => $row['isPublic'],
                'image' => $row['image'],
                'color' => $row['color'],
                'defaultRoleId' => $row['defaultRoleId'],
                'roleId' => $row['roleId'],
                'roleLabel' => $row['roleLabel'],
                'isIncludedInGradebook' => $row['isIncludedInGradebook'],
                'canViewContentSource' => $row['canViewContentSource'],
                'canEditContent' => $row['canEditContent'],
                'canPublishContent' => $row['canPublishContent'],
                'canViewUnassignedContent' => $row['canViewUnassignedContent'],
                'canProctor' => $row['canProctor'],
                'canViewAndModifyGrades' => $row['canViewAndModifyGrades'],
                'canViewActivitySettings' => $row['canViewActivitySettings'],
                'canModifyActivitySettings' =>
                    $row['canModifyActivitySettings'],
                'canModifyCourseSettings' => $row['canModifyCourseSettings'],
                'canViewUsers' => $row['canViewUsers'],
                'canManageUsers' => $row['canManageUsers'],
                'isAdmin' => $row['isAdmin'],
                'dataAccessPermission' => $row['dataAccessPermission'],
                'isOwner' => $row['isOwner'],
            ];
            array_push($permissionsAndSettings, $oneCourse);
        }
    }
}


?>
