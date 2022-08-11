<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';

$resuslts = [];

$results['alter enrollment'] = $conn->query(
    "ALTER TABLE enrollment 
    MODIFY `id` INT, 
    DROP PRIMARY KEY, 
    ADD PRIMARY KEY(courseId, userId), 
    ADD roleId VARCHAR(255),
    DROP firstName,
    DROP lastName,
    DROP email,
    DROP forTesting,
    DROP userName,
    CHANGE empId externalId VARCHAR(32),
    MODIFY dateEnrolled DATETIME DEFAULT CURRENT_TIMESTAMP"
);

$results['alter user'] = $conn->query(
    "ALTER TABLE user DROP roleStudent,
    DROP roleInstructor,
    DROP roleCourseDesigner,
    DROP roleWatchdog,
    DROP roleCommunityTA,
    DROP roleLiveDataCommunity"
);

$results['alter course'] = $conn->query(
    "ALTER TABLE course 
    ADD defaultRoleId VARCHAR(255)"
);

$results['create course_role'] = $conn->query(
    "CREATE TABLE `course_role` (
        `courseId` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        `roleId` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        `label` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Untitled Role',
        `isIncludedInGradebook` tinyint(1) NOT NULL DEFAULT '0',
        `canViewUnassignedContent` tinyint(1) NOT NULL DEFAULT '0',
        `canViewContentSource` tinyint(1) NOT NULL DEFAULT '0',
        `canEditContent` tinyint(1) NOT NULL DEFAULT '0',
        `canPublishContent` tinyint(1) NOT NULL DEFAULT '0',
        `canProctor` tinyint(1) NOT NULL DEFAULT '0',
        `canViewAndModifyGrades` tinyint(1) NOT NULL DEFAULT '0',
        `canViewActivitySettings` tinyint(1) NOT NULL DEFAULT '0',
        `canModifyActivitySettings` tinyint(1) NOT NULL DEFAULT '0',
        `canModifyCourseSettings` tinyint(1) NOT NULL DEFAULT '0',
        `dataAccessPermission` varchar(15) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'None',
        `canViewUsers` tinyint(1) NOT NULL DEFAULT '0',
        `canManageUsers` tinyint(1) NOT NULL DEFAULT '0',
        `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
        `isOwner` tinyint(1) NOT NULL DEFAULT '0',
        `sectionPermissionOnly` int(255) DEFAULT NULL,
        PRIMARY KEY (`courseId`,`roleId`),
        UNIQUE KEY `roleId` (`roleId`),
        CONSTRAINT `course_role_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `course` (`courseId`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci"
);

$results['select users'] = $conn->query(
    "SELECT courseId, userId, isOwner
    FROM course_user"
);

$results['cache by courseId'] = [];
while ($row = $results['select users']->fetch_assoc()) {
    if (!is_array($results['cache by courseId'][$row['courseId']])) {
        $results['cache by courseId'][$row['courseId']] = [];
    }
    array_push($results['cache by courseId'][$row['courseId']], [
        'userId' => $row['userId'],
        'isOwner' => $row['isOwner'],
    ]);
}

foreach ($results['cache by courseId'] as $courseId => $courseUsers) {
    $ownerRoleId = include 'randomId.php';
    $studentRoleId = include 'randomId.php';
    $results['insert roles'][$courseId] = $conn->query(
        "INSERT INTO course_role
        (
            courseId, 
            roleId, 
            label, 
            isIncludedInGradebook,
            canViewUnassignedContent,
            canViewContentSource,
            canEditContent,
            canPublishContent,
            canProctor,
            canViewAndModifyGrades,
            canViewActivitySettings,
            canModifyActivitySettings,
            canModifyCourseSettings,
            dataAccessPermisson,
            canViewUsers,
            canManageUsers,
            isAdmin,
            isOwner
        )
        VALUES
        ('$courseId', '$ownerRoleId', 'Owner', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', 'Identified', '1', '1', '1', '1'),
        ('$courseId', '$studentRoleId', 'Student','1','0','0','0','0','0','0','0','0','0', 'None', '0','0','0','0')"
    );
    $results['update defaultRoleId'][$courseId] = $conn->query(
        "UPDATE course SET defaultRoleId = '$studentRoleId' WHERE courseId = '$courseId'"
    );

    foreach ($courseUsers as $userData) {
        $userId = $userData['userId'];
        $updatedRoleId = $studentRoleId;
        if ($userData['isOwner']) {
            $updatedRoleId = $ownerRoleId;
        }

        $results['update enrollment'][$courseId][$userId] = $conn->query(
            "INSERT INTO enrollment
            SET
            courseId = '$courseId',
            userId = '$userId',
            roleId = '$updatedRoleId'
            ON DUPLICATE KEY UPDATE
            roleId = '$updatedRoleId'"
        );
    }
}

$results['drop course_user'] = $conn->query('DROP TABLE course_user');

$results['rename enrollment to course_user'] = $conn->query(
    'RENAME TABLE enrollment TO course_user'
);

http_response_code(200);
echo json_encode($results);
$conn->close();
?>
