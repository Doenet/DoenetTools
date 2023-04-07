# ************************************************************
# Sequel Ace SQL dump
# Version 20046
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 8.0.32)
# Database: doenet_local
# Generation Time: 2023-04-07 18:02:13 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table activity_state
# ------------------------------------------------------------

DROP TABLE IF EXISTS `activity_state`;

CREATE TABLE `activity_state` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `attemptNumber` int NOT NULL,
  `saveId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `cid` char(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `deviceName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `variantIndex` int NOT NULL,
  `activityInfo` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `activityState` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId-doenetId-attemptNumber` (`userId`,`doenetId`,`attemptNumber`),
  KEY `saveId` (`saveId`),
  KEY `cid` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `activity_state` WRITE;
/*!40000 ALTER TABLE `activity_state` DISABLE KEYS */;

INSERT INTO `activity_state` (`id`, `userId`, `doenetId`, `attemptNumber`, `saveId`, `cid`, `deviceName`, `variantIndex`, `activityInfo`, `activityState`)
VALUES
	(1,'cyuserId','_Ga07DeeWjhH6Y4UpWlakE',1,'StbBhgrC0UT1kf31HTUzI','bafkreieszxhhjdhin3wbdvaudhiumb2ygqbnd6cfwyz4hqjdcbgrw6cebq','Salix caprea',379,'{\"orderWithCids\":[{\"type\":\"page\",\"cid\":\"bafkreiemblagflvpgbvw2zgurtswwcltj6mkolerhebcymztdmrsoabz6a\"}],\"variantsByPage\":[1],\"itemWeights\":[1],\"numberOfVariants\":1000}','{\"currentPage\":1}');

/*!40000 ALTER TABLE `activity_state` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table assignment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `assignment`;

CREATE TABLE `assignment` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `courseId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `assignedDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means open until the dueDate. If dueDate is also NULL then open all the time.',
  `pinnedAfterDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means shows immediately',
  `pinnedUntilDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means never stops being pinned',
  `dueDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means never closes',
  `timeLimit` int DEFAULT NULL COMMENT 'NULL means it''s not timed',
  `numberOfAttemptsAllowed` int DEFAULT NULL COMMENT 'NULL means infinite, Assignment Level Number Of Attempts',
  `attemptAggregation` char(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT 'm',
  `totalPointsOrPercent` float DEFAULT '10',
  `gradeCategory` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `individualize` tinyint(1) NOT NULL DEFAULT '0',
  `showSolution` tinyint(1) NOT NULL DEFAULT '1',
  `showSolutionInGradebook` tinyint(1) NOT NULL DEFAULT '1',
  `showFeedback` tinyint(1) NOT NULL DEFAULT '1',
  `showHints` tinyint(1) NOT NULL DEFAULT '1',
  `showCorrectness` tinyint(1) NOT NULL DEFAULT '1',
  `showCreditAchievedMenu` tinyint(1) NOT NULL DEFAULT '1',
  `paginate` tinyint(1) NOT NULL DEFAULT '1',
  `showFinishButton` tinyint(1) NOT NULL DEFAULT '0',
  `proctorMakesAvailable` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Released by proctor or instructor',
  `autoSubmit` tinyint(1) NOT NULL DEFAULT '0',
  `canViewAfterCompleted` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Can''t navigate back to view and don''t show in gradebook',
  PRIMARY KEY (`id`),
  UNIQUE KEY `doenetId` (`doenetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;

INSERT INTO `assignment` (`id`, `doenetId`, `courseId`, `assignedDate`, `pinnedAfterDate`, `pinnedUntilDate`, `dueDate`, `timeLimit`, `numberOfAttemptsAllowed`, `attemptAggregation`, `totalPointsOrPercent`, `gradeCategory`, `individualize`, `showSolution`, `showSolutionInGradebook`, `showFeedback`, `showHints`, `showCorrectness`, `showCreditAchievedMenu`, `paginate`, `showFinishButton`, `proctorMakesAvailable`, `autoSubmit`, `canViewAfterCompleted`)
VALUES
	(1,'_Ga07DeeWjhH6Y4UpWlakE','_KwRMyq2rLo3B0dhVXgh6R',NULL,NULL,NULL,NULL,NULL,NULL,'m',10,NULL,0,1,1,1,1,1,1,1,0,0,0,1),
	(2,'_8m0E80RwrSvSLuCo6w1oW','_6Ih49jCBQQJwXPxymf4aE',NULL,NULL,NULL,NULL,NULL,NULL,'m',10,'exams',0,1,1,1,1,1,1,1,0,0,0,1),
	(4,'_xfKpaXhtreiMtaBB2cayx','n2bEhi8v3mgfNnjIeMyK0',NULL,NULL,NULL,NULL,NULL,NULL,'m',10,NULL,0,1,1,1,1,1,1,1,0,0,0,1),
	(6,'_A8U07ENIYi2g8wSZuYrxs','n2bEhi8v3mgfNnjIeMyK0',NULL,NULL,NULL,NULL,NULL,NULL,'m',10,NULL,0,1,1,1,1,1,1,1,0,0,0,1),
	(7,'_EHo02ENCyv55HgZFVN7xH','n2bEhi8v3mgfNnjIeMyK0',NULL,NULL,NULL,NULL,NULL,NULL,'m',10,NULL,0,1,1,1,1,1,1,1,0,0,0,1),
	(8,'_tf79lyxNKY8kZ2Fl6TEbx','kDtzuV8rkZHGqo5NQPUAS',NULL,NULL,NULL,NULL,NULL,NULL,'m',10,NULL,0,1,1,1,1,1,1,1,0,0,0,1),
	(10,'_DN1ERHEfjjP5XXYKp5DaX','n2bEhi8v3mgfNnjIeMyK0',NULL,NULL,NULL,NULL,NULL,NULL,'m',10,NULL,0,1,1,1,1,1,1,1,0,0,0,1);

/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table class_times
# ------------------------------------------------------------

DROP TABLE IF EXISTS `class_times`;

CREATE TABLE `class_times` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `courseId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `dotwIndex` int NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `sortOrder` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table collection
# ------------------------------------------------------------

DROP TABLE IF EXISTS `collection`;

CREATE TABLE `collection` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `entryId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `entryDoenetId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `entryContentId` char(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `entryVariant` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table collection_groups
# ------------------------------------------------------------

DROP TABLE IF EXISTS `collection_groups`;

CREATE TABLE `collection_groups` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `minStudents` int NOT NULL DEFAULT '1',
  `maxStudents` int NOT NULL DEFAULT '1',
  `preferredStudents` int NOT NULL DEFAULT '1',
  `preAssigned` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table content
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content`;

CREATE TABLE `content` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `cid` char(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT '0',
  `versionId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT '0',
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `isDraft` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'When this is true (1) is the running draft version between published versions',
  `isNamed` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'When this is true (1) is the running draft version between published versions',
  `isReleased` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'When this is true (1) is the running draft version between published versions',
  `isAssigned` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'When this is true (1) is the running draft version between published versions',
  `removedFlag` tinyint(1) NOT NULL DEFAULT '0',
  `public` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `cid` (`cid`),
  KEY `doenetId` (`doenetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table content_interactions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content_interactions`;

CREATE TABLE `content_interactions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `deviceName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `contentId` char(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `stateVariables` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `variant` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `attemptNumber` int DEFAULT NULL,
  `interactionSource` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `should_be_unique` (`userId`,`doenetId`,`attemptNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table course
# ------------------------------------------------------------

DROP TABLE IF EXISTS `course`;

CREATE TABLE `course` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `courseId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `label` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT 'Untitled Course',
  `isPublic` tinyint(1) DEFAULT '0' COMMENT 'Course is findable in search and drive_content isPublic content is available',
  `isDeleted` tinyint(1) DEFAULT '0',
  `image` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `color` char(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT 'none',
  `defaultRoleId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `examPasscode` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `browserExamKeys` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `lastSeenExamKey` varchar(66) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `canAutoEnroll` tinyint(1) NOT NULL DEFAULT '0',
  `portfolioCourseForUserId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `driveId` (`courseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;

INSERT INTO `course` (`id`, `courseId`, `label`, `isPublic`, `isDeleted`, `image`, `color`, `defaultRoleId`, `examPasscode`, `browserExamKeys`, `lastSeenExamKey`, `canAutoEnroll`, `portfolioCourseForUserId`)
VALUES
	(3,'umnMathPlacement','UMN Placement Exams',0,0,'picture11.jpg','none','7VhPa3uv4pClP0WNyEDQJ',NULL,NULL,NULL,1,NULL);

/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table course_content
# ------------------------------------------------------------

DROP TABLE IF EXISTS `course_content`;

CREATE TABLE `course_content` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `courseId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `parentDoenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `label` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'Untitled',
  `creationDate` timestamp NULL DEFAULT NULL,
  `isDeleted` int NOT NULL DEFAULT '0',
  `isAssigned` int NOT NULL DEFAULT '0' COMMENT 'The content or folder shows to the student',
  `isGloballyAssigned` int NOT NULL DEFAULT '1' COMMENT 'The content from cid shows to all students without a cidOverride',
  `isPublic` int NOT NULL DEFAULT '0' COMMENT 'The course is available to search for and this content is available',
  `userCanViewSource` int NOT NULL DEFAULT '0',
  `sortOrder` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `jsonDefinition` json DEFAULT NULL,
  `imagePath` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `learningOutcomes` json DEFAULT NULL,
  `addToPrivatePortfolioDate` timestamp NULL DEFAULT NULL,
  `addToPublicPortfolioDate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doenetId` (`doenetId`),
  KEY `courseId` (`courseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table course_grade_category
# ------------------------------------------------------------

DROP TABLE IF EXISTS `course_grade_category`;

CREATE TABLE `course_grade_category` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `courseId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `gradeCategory` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `totalPointsOrPercent` float NOT NULL DEFAULT '0',
  `numberToDrop` int NOT NULL DEFAULT '0',
  `assignmentsInPercent` bit(11) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `course_grade_category` (`courseId`,`gradeCategory`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table course_role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `course_role`;

CREATE TABLE `course_role` (
  `courseId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `roleId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `label` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'Untitled Role',
  `isIncludedInGradebook` tinyint(1) NOT NULL DEFAULT '0',
  `canViewCourse` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'This is to hide the course from navigation initially for placement exams',
  `canViewUnassignedContent` tinyint(1) NOT NULL DEFAULT '0',
  `canViewContentSource` tinyint(1) NOT NULL DEFAULT '0',
  `canEditContent` tinyint(1) NOT NULL DEFAULT '0',
  `canPublishContent` tinyint(1) NOT NULL DEFAULT '0',
  `canProctor` tinyint(1) NOT NULL DEFAULT '0',
  `canViewAndModifyGrades` tinyint(1) NOT NULL DEFAULT '0',
  `canViewActivitySettings` tinyint(1) NOT NULL DEFAULT '0',
  `canModifyActivitySettings` tinyint(1) NOT NULL DEFAULT '0',
  `canModifyCourseSettings` tinyint(1) NOT NULL DEFAULT '0',
  `dataAccessPermission` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'None',
  `canViewUsers` tinyint(1) NOT NULL DEFAULT '0',
  `canManageUsers` tinyint(1) NOT NULL DEFAULT '0',
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `isOwner` tinyint(1) NOT NULL DEFAULT '0',
  `sectionPermissionOnly` int DEFAULT NULL,
  PRIMARY KEY (`courseId`,`roleId`),
  UNIQUE KEY `roleId` (`roleId`),
  CONSTRAINT `course_role_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `course` (`courseId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `course_role` WRITE;
/*!40000 ALTER TABLE `course_role` DISABLE KEYS */;

INSERT INTO `course_role` (`courseId`, `roleId`, `label`, `isIncludedInGradebook`, `canViewCourse`, `canViewUnassignedContent`, `canViewContentSource`, `canEditContent`, `canPublishContent`, `canProctor`, `canViewAndModifyGrades`, `canViewActivitySettings`, `canModifyActivitySettings`, `canModifyCourseSettings`, `dataAccessPermission`, `canViewUsers`, `canManageUsers`, `isAdmin`, `isOwner`, `sectionPermissionOnly`)
VALUES
	('umnMathPlacement','7VhPa3uv4pClP0WNyEDQJ','Student',1,0,0,0,0,0,0,0,0,0,0,'None',0,0,0,0,NULL),
	('umnMathPlacement','dx39LHmbs6dzvU4aVdJHr','Author',0,1,1,1,1,1,0,0,0,0,0,'Aggregate',0,0,0,0,NULL),
	('umnMathPlacement','JCrC2g6iRxFN55OZPj3eL','Owner',0,1,1,1,1,1,1,1,1,1,1,'Identified',1,1,1,1,NULL);

/*!40000 ALTER TABLE `course_role` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table course_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `course_user`;

CREATE TABLE `course_user` (
  `courseId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `userId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `externalId` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `dateEnrolled` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'UTC DateTime',
  `section` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `withdrew` bit(1) DEFAULT b'0',
  `dateWithdrew` datetime DEFAULT NULL COMMENT 'UTC DateTime',
  `courseCredit` double DEFAULT NULL,
  `courseGrade` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `overrideCourseGrade` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `timeLimitMultiplier` float NOT NULL DEFAULT '1',
  `roleId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`courseId`,`userId`),
  KEY `course_user_ibfk_1` (`roleId`),
  CONSTRAINT `course_user_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `course_role` (`roleId`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `course_user` WRITE;
/*!40000 ALTER TABLE `course_user` DISABLE KEYS */;

INSERT INTO `course_user` (`courseId`, `userId`, `externalId`, `dateEnrolled`, `section`, `withdrew`, `dateWithdrew`, `courseCredit`, `courseGrade`, `overrideCourseGrade`, `timeLimitMultiplier`, `roleId`)
VALUES
	('umnMathPlacement','devuserid',NULL,'2022-10-21 18:36:28',NULL,b'0',NULL,NULL,NULL,NULL,1,'JCrC2g6iRxFN55OZPj3eL');

/*!40000 ALTER TABLE `course_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table drive
# ------------------------------------------------------------

DROP TABLE IF EXISTS `drive`;

CREATE TABLE `drive` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `driveId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `label` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `driveType` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `isShared` tinyint(1) DEFAULT '0',
  `isPublic` tinyint(1) DEFAULT '0' COMMENT 'Course is findable in search and drive_content isPublic content is available',
  `isDeleted` tinyint(1) DEFAULT '0',
  `image` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `color` char(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `examPasscode` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `browserExamKeys` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `driveId` (`driveId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table drive_content
# ------------------------------------------------------------

DROP TABLE IF EXISTS `drive_content`;

CREATE TABLE `drive_content` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `driveId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `itemId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `parentFolderId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `label` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `creationDate` timestamp NULL DEFAULT NULL,
  `isDeleted` int NOT NULL DEFAULT '0',
  `isReleased` int NOT NULL DEFAULT '0' COMMENT 'The content or folder shows to the instructor in course',
  `isAssigned` int NOT NULL DEFAULT '0' COMMENT 'The content or folder shows to the student',
  `isPublic` int NOT NULL DEFAULT '0' COMMENT 'The course is available to search for and this content is available',
  `itemType` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `doenetId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `sourceDoenetId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL COMMENT 'Filled after a copy of drive, folder or doenetML',
  `sortOrder` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `folderId` (`itemId`),
  UNIQUE KEY `doenetId` (`doenetId`),
  KEY `driveId` (`driveId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table drive_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `drive_user`;

CREATE TABLE `drive_user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `driveId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `canEditContent` tinyint(1) DEFAULT '0',
  `canViewDrive` tinyint(1) DEFAULT '0',
  `canDeleteDrive` tinyint(1) DEFAULT '0',
  `canShareDrive` tinyint(1) DEFAULT '0',
  `canUpload` tinyint(1) DEFAULT '0',
  `canAddItemsAndFolders` tinyint(1) DEFAULT '0',
  `canDeleteItemsAndFolders` tinyint(1) DEFAULT '0',
  `canMoveItemsAndFolders` tinyint(1) DEFAULT '0',
  `canRenameItemsAndFolders` tinyint(1) DEFAULT '0',
  `canPublishItemsAndFolders` tinyint(1) DEFAULT '0',
  `canViewUnreleasedItemsAndFolders` tinyint(1) DEFAULT '0',
  `canViewUnassignedItemsAndFolders` tinyint(1) DEFAULT '0',
  `canChangeAllDriveSettings` tinyint(1) DEFAULT '0',
  `role` char(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userDrive` (`userId`,`driveId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table event
# ------------------------------------------------------------

DROP TABLE IF EXISTS `event`;

CREATE TABLE `event` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `verb` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `activityCid` char(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `pageCid` char(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `pageNumber` int DEFAULT NULL,
  `attemptNumber` int DEFAULT NULL,
  `activityVariantIndex` int DEFAULT NULL,
  `pageVariantIndex` int DEFAULT NULL,
  `object` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `context` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `result` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `timestamp` timestamp NULL DEFAULT NULL,
  `version` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;

INSERT INTO `event` (`id`, `userId`, `verb`, `doenetId`, `activityCid`, `pageCid`, `pageNumber`, `attemptNumber`, `activityVariantIndex`, `pageVariantIndex`, `object`, `context`, `result`, `timestamp`, `version`)
VALUES
	(530,'cyuserId','experienced','_Ga07DeeWjhH6Y4UpWlakE','bafkreieszxhhjdhin3wbdvaudhiumb2ygqbnd6cfwyz4hqjdcbgrw6cebq','bafkreiemblagflvpgbvw2zgurtswwcltj6mkolerhebcymztdmrsoabz6a',1,1,379,1,'{\"componentName\":\"/_document1\",\"componentType\":\"document\"}','{}','{}','2022-08-04 03:32:49','0.1.1'),
	(531,'cyuserId','submitted','_Ga07DeeWjhH6Y4UpWlakE','bafkreieszxhhjdhin3wbdvaudhiumb2ygqbnd6cfwyz4hqjdcbgrw6cebq','bafkreiemblagflvpgbvw2zgurtswwcltj6mkolerhebcymztdmrsoabz6a',1,1,379,1,'{\"componentName\":\"/_answer1\",\"componentType\":\"answer\"}','{\"item\":1,\"itemCreditAchieved\":1,\"pageCreditAchieved\":1}','{\"response\":[42],\"responseText\":[\"42\"],\"creditAchieved\":1}','2022-08-04 03:32:52','0.1.1'),
	(532,'cyuserId','answered','_Ga07DeeWjhH6Y4UpWlakE','bafkreieszxhhjdhin3wbdvaudhiumb2ygqbnd6cfwyz4hqjdcbgrw6cebq','bafkreiemblagflvpgbvw2zgurtswwcltj6mkolerhebcymztdmrsoabz6a',1,1,379,1,'{\"componentName\":\"/__mathinput_KXh6glTyP5\",\"componentType\":\"mathInput\"}','{\"answerAncestor\":\"/_answer1\"}','{\"response\":42,\"responseText\":\"42\"}','2022-08-04 03:32:52','0.1.1');

/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table experiment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `experiment`;

CREATE TABLE `experiment` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `experimentId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `waitingCid` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `creationDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means open until the dueDate. If dueDate is also NULL then open all the time.',
  `assignedDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means open until the dueDate. If dueDate is also NULL then open all the time.',
  `hasBegun` int DEFAULT '0',
  `numberOfGroups` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table homepage_carousel
# ------------------------------------------------------------

DROP TABLE IF EXISTS `homepage_carousel`;

CREATE TABLE `homepage_carousel` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `section` int DEFAULT '0',
  `position` int DEFAULT '0',
  `imagePath` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `label` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `link` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `homepage_carousel` WRITE;
/*!40000 ALTER TABLE `homepage_carousel` DISABLE KEYS */;

INSERT INTO `homepage_carousel` (`id`, `section`, `position`, `imagePath`, `label`, `link`)
VALUES
	(1,0,1,'https://www.doenet.org/media/bafkreiam4krvixrkppyucgwxwvsqugdnu744fetsjfpaik42e6garyliui.png','Sketching the Derivative of a Function','https://www.doenet.org/public?&doenetId=_2vI5BPzPpy2xIgIdeeT58#page1'),
	(2,2,1,'https://www.doenet.org/media/bafkreihtu6ojja2rqu7h7ozwgo6wxfaxcbjhfl72qrk35gkyvewkfkdpm4.png','The Distance Formula','https://www.doenet.org/public/?&doenetId=_Nx4JdF9H01nevilBVcpH7&pageId=_2Q0GSCRjcOXzsG2XqkxIy'),
	(3,1,1,'https://www.doenet.org/media/bafkreibscqr4xqdtzluhxqpq2b5te6aee5klhih5a7gyepbhzg5ef7a4dy.png','Gravity Pendulum','https://www.doenet.org/public?&doenetId=_9yltFP7xicXUxc5zn47kV&pageId=_R01B4y1aIIAhUUMJ1kS4h'),
	(4,0,2,'https://www.doenet.org/media/bafkreifp3vvgjzyauwcz4sgv3ufnhgt73wgjxeo526bxrc42dy5z7ptdk4.png','Using Critical Points to Graph a Function','https://www.doenet.org/public?&pageId=_nndyecDUVhrBxRSVEsIks&doenetId=_xFp9q8N0M5ZmndOdNoCdV#page1'),
	(5,0,3,'https://www.doenet.org/media/bafkreidaba7xob6ttqtmrlhxc3tac4ndbyspxyjgdkrum7kqennbbhiksq.png','Cobwebbing as a Graphical Solution Technique','https://www.doenet.org/public?&pageId=_dZtsQukSqUSyj1zpjjKmR&doenetId=_Zhp8bgIK4cH1rmC2qbmZ1#page1'),
	(6,0,4,'https://www.doenet.org/media/bafkreiaxmhuwpaysgexfyi52u227wjue7sdupuhca5fclc6vz5s75i43gi.png','Finding Equilibria of Dynamical Systems Graphically','https://www.doenet.org/public?&doenetId=_mSq0VF5YtzU1G6O8yKmH3&pageId=_xaxKwgl5eoIW5jSkER4dL'),
	(7,0,5,'https://www.doenet.org/media/bafkreieiacouqdzeocyuf73nrd2spwnfjt24ttpgbzx3xuex7ma7qkaje4.png','Average Rate of Change of f(x)','https://www.doenet.org/public?&doenetId=_Tr6eNIi78wbhqPbWNrMxz&pageId=_D4swdtGCu05CX9zGHWoeX'),
	(8,0,6,'https://www.doenet.org/media/bafkreigezuzjy2jm6afsbzt2bz6aibxibebynhq5m6tgu5q2vx46ptqk4y.png','Retinal Neuron in Response to Light','https://www.doenet.org/public?&doenetId=_0tyHTDbSrC99yN3Dcxatt&pageId=_iDhjQ8aQc3rvRZo4ahMDH'),
	(9,0,7,'https://www.doenet.org/media/bafkreifdwgupm3bls3oaswjgjdmsdribbnapnoj6vmztssfdhkmewcejiq.png','Sketching Riemann Sums','https://www.doenet.org/public?&doenetId=_szVX6GxaRlNjE85iPorIX&pageId=_I8W0aJ0d29wR4tykHzcTm'),
	(10,0,8,'https://www.doenet.org/media/bafkreif53m74qbeaaxf6ox7x45vidz77fxluuzgwuxyvkpdhm3aesa7fem.png','Graphical Solution to Autonomous Differential Equation','https://www.doenet.org/public?tool=editor&doenetId=_PdrivZGPIuLsu0yNYgTh1&pageId=_xyXzlFeOcnDf5M043pmOa'),
	(11,1,2,'https://www.doenet.org/media/bafkreibbljj4oae2mrbmupcnr7a62wjmxgrspgkn6pp2nygsl6vaab2ulq.png','Force Polygon and Free-body Diagram','https://www.doenet.org/public?&doenetId=_oLrDBHvAQ6km8U8oW8n8F&pageId=_bir2xQiClURXl58TRjJyu'),
	(12,1,3,'https://www.doenet.org/media/bafkreidfgtqqf4pomt2yk7e2n3b2ozgqnspgz34bsydajauy6jc3f3q2ym.png','The Parallel Axis Theorem','https://www.doenet.org/public?&doenetId=_nQhMzFgVSHKdQLYHZdqSi&pageId=_9egpTeOQ7CeyKQOzXJsE4'),
	(13,1,4,'https://www.doenet.org/media/bafkreidziwruo6ew34pcxucdgjshuwyvtn4yxfe3klm24zipl7qekzn2ji.png','Parametric Curves and the Fibonacci Spiral','https://www.doenet.org/public?&doenetId=_YHXi5AZ50HpDaiDpqY5i4'),
	(14,1,5,'https://www.doenet.org/media/bafkreiesq4ovdbrbbzwtelrzqi55y5cn77hg2hzdvpka6lzkivgavgs7pm.png','Mohr\'s Circle Construction','https://www.doenet.org/public?&doenetId=_2GQLzLQk720Xtp0IQQlsP'),
	(15,2,2,'https://www.doenet.org/media/bafkreigbsq22gtn6cyjowbct6yfvmdubxvbbbpcg3w7lb7diwiuedp66wi.png','Parabola in Vertex Form','https://www.doenet.org/public?&doenetId=_Tx6tHFlAjEkwI2JqobpJb&pageId=_xsXSITMkeoe2Kxk09K9nU'),
	(16,2,3,'https://www.doenet.org/media/bafkreigaqyhy7jozong5oy6d6tazum36koslg737hqpbtvrr6fuvxgl3zu.png','The Unit Circle','https://www.doenet.org/public?&doenetId=_6694ERXlB01d4O02Y6Ss4&pageId=_MKp8wrCuf6RBfwqXt29KU'),
	(17,2,4,'https://www.doenet.org/media/bafkreie7wydzahclczanva3jvntado4jbn7v57ijjxyyahc34z7k3cwgpa.png','Radioactive Decay','https://www.doenet.org/public?&doenetId=_djqyy5l6czkNhT1WfNfG8&pageId=_O1pgjFfTntXw9vLe7shW3'),
	(18,2,5,'https://www.doenet.org/media/bafkreiezrefj2verba4vwcl7jwa3nyulazeo736daw57kkp7j7q4ihihy4.png','Rational Functions','https://www.doenet.org/public?&doenetId=_TGnpVEefcj59zLjsnULqK&pageId=_nBhukue9G82wLIs0Nx2XT'),
	(19,2,6,'https://www.doenet.org/media/bafkreid6r7fcpgqlv32q3lxqsnmt47daicrdjcnws5annfqtwg4qnsrepu.png','Verify Algebraic Simplification','https://www.doenet.org/public?&doenetId=_BrVjSspzU5pdew3DOBlXP&pageId=_Svl7QVdDJFpaByTUDsOi8'),
	(20,2,7,'https://www.doenet.org/media/bafkreih5kbfwmtkifdfskchyiuekinlx7zo6lsvoozxrboxyyeygspwe2q.png','Transform Trigonometric Functions','https://www.doenet.org/public?&doenetId=_9o97WpLVp3FRYyjwDqpDY'),
	(21,2,8,'https://www.doenet.org/media/bafkreienne7x5iiq2qr4ca7pct6ngl4omdxv6pkzmrvtwn2nyamybnscyi.png','Integer Practice on the Coordinate Plane','https://www.doenet.org/public?&doenetId=_5kggLH0irOmDTBvrOcDK3'),
	(22,3,1,'https://www.doenet.org/media/bafkreigezuzjy2jm6afsbzt2bz6aibxibebynhq5m6tgu5q2vx46ptqk4y.png','Retinal Neuron in Response to Light','https://www.doenet.org/public?&doenetId=_0tyHTDbSrC99yN3Dcxatt&pageId=_iDhjQ8aQc3rvRZo4ahMDH'),
	(23,3,2,'https://www.doenet.org/media/bafkreiezrefj2verba4vwcl7jwa3nyulazeo736daw57kkp7j7q4ihihy4.png','Rational Functions','https://www.doenet.org/public?&doenetId=_TGnpVEefcj59zLjsnULqK&pageId=_nBhukue9G82wLIs0Nx2XT'),
	(24,3,3,'https://www.doenet.org/media/bafkreienne7x5iiq2qr4ca7pct6ngl4omdxv6pkzmrvtwn2nyamybnscyi.png','Integer Practice on the Coordinate Plane','https://www.doenet.org/public?&doenetId=_5kggLH0irOmDTBvrOcDK3');

/*!40000 ALTER TABLE `homepage_carousel` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table initial_renderer_state
# ------------------------------------------------------------

DROP TABLE IF EXISTS `initial_renderer_state`;

CREATE TABLE `initial_renderer_state` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cid` char(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `variantIndex` int NOT NULL,
  `showCorrectness` tinyint(1) NOT NULL DEFAULT '1',
  `solutionDisplayMode` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'button',
  `showFeedback` tinyint(1) NOT NULL DEFAULT '1',
  `showHints` tinyint(1) NOT NULL DEFAULT '1',
  `autoSubmit` tinyint(1) NOT NULL DEFAULT '0',
  `rendererState` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `coreInfo` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniquekey` (`cid`,`variantIndex`,`showCorrectness`,`solutionDisplayMode`,`showFeedback`,`showHints`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table ipfs_to_upload
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ipfs_to_upload`;

CREATE TABLE `ipfs_to_upload` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cid` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `fileType` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `sizeInBytes` int DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `ipfs_to_upload` WRITE;
/*!40000 ALTER TABLE `ipfs_to_upload` DISABLE KEYS */;

INSERT INTO `ipfs_to_upload` (`id`, `cid`, `fileType`, `sizeInBytes`, `timestamp`)
VALUES
	(5,'bafkreihdiajsgbhupojlk7ml6i7ilsdsmcr6fxmktw4qryxzdqzutbecl4','image/jpeg',10610,'2023-03-15 22:43:53'),
	(6,'bafkreietqictwqhbbova4vhfoqa2rp7no5jozyjekxiho7fadmvtsscbvm','image/jpeg',6608,'2023-03-15 22:44:21'),
	(7,'bafkreievsb6idm7evpjgprvu3ceja5y4vwyni77weiwed5eygaj2dav5vi','image/jpeg',5739,'2023-03-15 22:44:26'),
	(8,'bafkreidysbfe7p5moekfd26azzpbzf2b6utfyicdpbeudot5qmnrbufr4y','image/jpeg',8511,'2023-03-15 22:44:29'),
	(9,'bafkreih6vklqhyv4fw4quwm26sdienhu52jsbfnb4w5jdl5x5kqxl5vnte','image/jpeg',6699,'2023-03-15 22:44:33'),
	(10,'bafkreife5ldiga34mx7jjkqgwe2xswjzmmp6re3vz4nk6hl7niiabpaxfu','image/jpeg',9424,'2023-03-17 21:18:01'),
	(11,'bafkreidjzfrzg2oehhojpsiuuumfup4dxpi342pmyqlln57tydp7oqax6m','image/png',814762,'2023-03-20 22:05:54'),
	(12,'bafkreibf24rzls4rzohickwrnobotyc3u44wpmygs2e7qce4mjmt5acpum','image/png',258190,'2023-03-20 22:08:14'),
	(13,'bafkreiett6gelwhmhdkpxtsesmlxe5yntj4ioexkstba4qthseuecxgfnm','image/png',171905,'2023-03-21 02:38:46'),
	(14,'bafkreifaryyciltqgjg5dnunsenxvjk67kofjpaf7oxttdm2zrdexrnvg4','image/jpeg',9212,'2023-03-21 13:25:43'),
	(15,'bafkreidyxsusqkjz4ypnosd5vbiawdvnmxx2bxurbq6hb4273mxm7wkcqy','image/jpeg',4945,'2023-03-21 21:13:08'),
	(16,'bafkreifxuld3xnlpvddltafyskzzicpu3kaw2akkgxgev5noojplwes5dy','image/jpeg',7858,'2023-03-21 21:31:51'),
	(17,'bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','image/jpeg',5850,'2023-03-21 21:44:32'),
	(18,'bafkreifrwlxh43k46lo6n6sbsnt3jxnqcxktvz5r7uvbgrxfojujarqoia','image/png',142384,'2023-03-24 15:08:00'),
	(19,'bafkreiehm6cgxoejakdkbphzbxs6he6tqx6cwkzjpwcac5njag55lbeepi','image/jpeg',6434,'2023-03-25 17:27:33'),
	(20,'bafkreifawl5n6y7gxfn45kckewqzttu7xsruzebvset6wd7ylvinqhbcyq','image/jpeg',6072,'2023-03-25 18:58:45'),
	(21,'bafkreiarj6u3uumh5gytgzkckczasc6cwugrygf4ovylwllier7iyiml3m','image/jpeg',9541,'2023-03-26 02:47:57'),
	(22,'bafkreieuqm4lnkplq2nyho7pxcwhgh4qljlka7i343rxiceuf3xyuzphwy','image/jpeg',7370,'2023-03-26 02:50:47'),
	(23,'bafkreidelofypp53wasdsbbbn7exvwckfaw6xhiczsj23qyy2yaaqjfhxa','image/jpeg',7171,'2023-03-26 02:51:44'),
	(24,'bafkreigd5qr3hq5ciyhy7df5iwowdkzglymv65tjko4idhtj2itbzhbnxa','image/jpeg',6724,'2023-03-26 02:53:08'),
	(25,'bafkreiaj5i4grgkfrhao36mbvwmziltonhv6rcp5xttwdfx2gqpyvqsc6e','image/jpeg',8919,'2023-03-26 02:57:36'),
	(26,'bafkreie6sil52ks5cnqdyu2a5ngrmbia3lt7nbwmmrn76cths7dq47f3cu','image/jpeg',6060,'2023-03-26 02:59:54'),
	(27,'bafkreidr2hgoo4qinvlzq4yqjhotaul3lbbveu2cym2czsi5cqbh36tiae','image/jpeg',6951,'2023-03-26 03:01:09'),
	(28,'bafkreighmusd7asqcvo4yy4wcw4mxylfbxkidyzksgklr3pjvxk3mvo3by','image/jpeg',6309,'2023-03-26 03:06:07'),
	(29,'bafkreih3me5gl7atlq45uwmvvp3vthvtaaoqlz3ts52m56qdpdhczbw25u','image/jpeg',10643,'2023-03-27 15:33:29'),
	(30,'bafkreig5lhv2bwixipe7mo5vteyg24gqgutg4sbddfehlo3qr6nlb32o2a','image/jpeg',7579,'2023-03-27 20:40:55'),
	(31,'bafkreigkik4wporve7whbfyh7oeihncxqax2rzkprqnb2q5u4phmhdguda','image/jpeg',6984,'2023-03-28 19:44:50');

/*!40000 ALTER TABLE `ipfs_to_upload` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table link_pages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `link_pages`;

CREATE TABLE `link_pages` (
  `courseId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `containingDoenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `parentDoenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `sourceCollectionDoenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `sourcePageDoenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `label` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `timeOfLastUpdate` datetime DEFAULT NULL,
  PRIMARY KEY (`doenetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table page_state
# ------------------------------------------------------------

DROP TABLE IF EXISTS `page_state`;

CREATE TABLE `page_state` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `deviceName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `cid` char(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `pageNumber` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `attemptNumber` int DEFAULT NULL,
  `saveId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `coreInfo` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `coreState` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `rendererState` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId-doenetId-pageNumber-attemptNumber` (`userId`,`doenetId`,`pageNumber`,`attemptNumber`),
  KEY `saveId` (`saveId`),
  KEY `cid` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `page_state` WRITE;
/*!40000 ALTER TABLE `page_state` DISABLE KEYS */;

INSERT INTO `page_state` (`id`, `userId`, `deviceName`, `doenetId`, `cid`, `pageNumber`, `attemptNumber`, `saveId`, `coreInfo`, `coreState`, `rendererState`, `timestamp`)
VALUES
	(1,'cyuserId','Salix caprea','_Ga07DeeWjhH6Y4UpWlakE','bafkreiemblagflvpgbvw2zgurtswwcltj6mkolerhebcymztdmrsoabz6a','1',1,'anojAO9sUJ7oWVu9tcBiY','{\"generatedVariantString\":\"{\\\"index\\\":1,\\\"name\\\":\\\"a\\\",\\\"meta\\\":{\\\"createdBy\\\":\\\"/_document1\\\"},\\\"subvariants\\\":[{\\\"seed\\\":\\\"526047095656395\\\",\\\"meta\\\":{\\\"createdBy\\\":\\\"/_problem1\\\"},\\\"subvariants\\\":[]}]}\",\"allPossibleVariants\":[\"a\"],\"variantIndicesToIgnore\":[],\"rendererTypesInDocument\":[\"section\",\"answer\",\"mathInput\"],\"documentToRender\":{\"componentName\":\"/_document1\",\"effectiveName\":\"/_document1\",\"componentType\":\"document\",\"rendererType\":\"section\",\"actions\":{\"submitAllAnswers\":{\"actionName\":\"submitAllAnswers\",\"componentName\":\"/_document1\"},\"recordVisibilityChange\":{\"actionName\":\"recordVisibilityChange\",\"componentName\":\"/_document1\"}}}}','{\"/__mathinput_KXh6glTyP5\":{\"immediateValue\":42,\"rawRendererValue\":\"42\",\"lastValueForDisplay\":42,\"dontUpdateRawValueInDefinition\":false,\"value\":42},\"/__math_d9bmzOvKly\":{\"expressionWithCodes\":42},\"/_answer1\":{\"justSubmitted\":true,\"hasBeenCorrect\":true,\"creditAchieved\":1,\"responseHasBeenSubmitted\":true,\"nSubmittedResponses\":1,\"submittedResponses\":{\"0\":42,\"mergeObject\":true},\"submittedResponsesComponentType\":[\"math\"],\"creditAchievedDependenciesAtSubmit\":\"qmmMhdXJTsIHF6t66L3Xf4WYknc=\",\"nSubmissions\":1},\"/__award_XTZPmlFGuS\":{\"awarded\":true,\"creditAchieved\":1,\"fractionSatisfied\":1}}','{\"/__mathinput_KXh6glTyP5\":{\"stateValues\":{\"hidden\":false,\"disabled\":false,\"fixed\":false,\"includeCheckWork\":true,\"creditAchieved\":1,\"valueHasBeenValidated\":true,\"showCorrectness\":true,\"numberOfAttemptsLeft\":{\"objectType\":\"special-numeric\",\"stringValue\":\"Infinity\"},\"valueForDisplay\":42,\"rawRendererValue\":\"42\"},\"childrenInstructions\":[]},\"/_answer1\":{\"stateValues\":{\"submitLabel\":\"Check Work\",\"submitLabelNoCorrectness\":\"Submit Response\",\"hidden\":false,\"fixed\":false,\"disabledOriginal\":false,\"showCorrectness\":true,\"inputChildren\":[{\"componentType\":\"mathInput\",\"componentName\":\"/__mathinput_KXh6glTyP5\"}],\"inputChildrenWithValues\":[{\"componentType\":\"mathInput\",\"componentName\":\"/__mathinput_KXh6glTyP5\",\"stateValues\":{\"value\":42,\"immediateValue\":42}}],\"delegateCheckWork\":true,\"creditAchieved\":1,\"justSubmitted\":true,\"numberOfAttemptsLeft\":{\"objectType\":\"special-numeric\",\"stringValue\":\"Infinity\"},\"disabled\":false},\"childrenInstructions\":[{\"componentName\":\"/__mathinput_KXh6glTyP5\",\"effectiveName\":\"/__mathinput_KXh6glTyP5\",\"componentType\":\"mathInput\",\"rendererType\":\"mathInput\",\"actions\":{\"updateRawValue\":{\"actionName\":\"updateRawValue\",\"componentName\":\"/__mathinput_KXh6glTyP5\"},\"updateValue\":{\"actionName\":\"updateValue\",\"componentName\":\"/__mathinput_KXh6glTyP5\"},\"submitAnswer\":{\"actionName\":\"submitAnswer\",\"componentName\":\"/_answer1\"}}}]},\"/_problem1\":{\"stateValues\":{\"submitLabel\":\"Check Work\",\"submitLabelNoCorrectness\":\"Submit Response\",\"boxed\":false,\"hidden\":false,\"disabled\":false,\"fixed\":false,\"enumeration\":[1],\"titleChildName\":null,\"title\":\"Problem 1\",\"containerTag\":\"section\",\"level\":3,\"justSubmitted\":true,\"showCorrectness\":true,\"creditAchieved\":1,\"collapsible\":false,\"open\":true,\"createSubmitAllButton\":false,\"suppressAnswerSubmitButtons\":false},\"childrenInstructions\":[{\"componentName\":\"/_answer1\",\"effectiveName\":\"/_answer1\",\"componentType\":\"answer\",\"rendererType\":\"answer\",\"actions\":{\"submitAnswer\":{\"actionName\":\"submitAnswer\",\"componentName\":\"/_answer1\"}}}]},\"/_document1\":{\"stateValues\":{\"submitLabel\":\"Check Work\",\"submitLabelNoCorrectness\":\"Submit Response\",\"hidden\":false,\"disabled\":false,\"fixed\":false,\"titleChildName\":null,\"title\":\"\",\"level\":0,\"justSubmitted\":true,\"showCorrectness\":true,\"creditAchieved\":1,\"createSubmitAllButton\":false,\"suppressAnswerSubmitButtons\":false},\"childrenInstructions\":[{\"componentName\":\"/_problem1\",\"effectiveName\":\"/_problem1\",\"componentType\":\"problem\",\"rendererType\":\"section\",\"actions\":{\"submitAllAnswers\":{\"actionName\":\"submitAllAnswers\",\"componentName\":\"/_problem1\"},\"revealSection\":{\"actionName\":\"revealSection\",\"componentName\":\"/_problem1\"},\"closeSection\":{\"actionName\":\"closeSection\",\"componentName\":\"/_problem1\"},\"recordVisibilityChange\":{\"actionName\":\"recordVisibilityChange\",\"componentName\":\"/_problem1\"}}}]}}',NULL);

/*!40000 ALTER TABLE `page_state` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table pages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `pages`;

CREATE TABLE `pages` (
  `courseId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `containingDoenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `label` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'Untitled',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`containingDoenetId`,`doenetId`),
  KEY `doenetId` (`doenetId`),
  CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`containingDoenetId`) REFERENCES `course_content` (`doenetId`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;



# Dump of table support_files
# ------------------------------------------------------------

DROP TABLE IF EXISTS `support_files`;

CREATE TABLE `support_files` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT '0',
  `cid` char(80) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT '0',
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `fileType` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `description` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `asFileName` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `sizeInBytes` mediumint DEFAULT NULL,
  `widthPixels` int DEFAULT NULL,
  `heightPixels` int DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `isListed` tinyint(1) NOT NULL DEFAULT '0',
  `isPublic` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `support_files` WRITE;
/*!40000 ALTER TABLE `support_files` DISABLE KEYS */;

INSERT INTO `support_files` (`id`, `userId`, `cid`, `doenetId`, `fileType`, `description`, `asFileName`, `sizeInBytes`, `widthPixels`, `heightPixels`, `timestamp`, `isListed`, `isPublic`)
VALUES
	(1,'devuserid','bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku','BhTh7z7WLCMEVZSZ51629','','','biggest.jpg',0,0,0,'2023-03-15 21:24:55',0,0),
	(2,'devuserid','bafkreighjgwddstonoixxw6ucsfhyd7mn7vcvkqdmiiscg657dlk4tbt6q','_CwP4UtNIc2hYRN4Sl29o5','image/jpeg','test','QmcRD4wkPPi6dig81r5sLj9Zm1gDCL4zgpEj9CfuRrGbzF.jpg',8967,220,187,'2023-03-15 22:02:53',0,0),
	(3,'devuserid','bafkreighjgwddstonoixxw6ucsfhyd7mn7vcvkqdmiiscg657dlk4tbt6q','BhTh7z7WLCMEVZSZ51629','image/jpeg','','QmcRD4wkPPi6dig81r5sLj9Zm1gDCL4zgpEj9CfuRrGbzF.jpg',8967,220,187,'2023-03-15 22:07:36',0,0),
	(4,'devuserid','bafkreig2znzqe34zkrfjrgyi5bbylk2je6tyjswl4qnffpvfwylczp6vja','BhTh7z7WLCMEVZSZ51629','image/png','','Screen Shot 2022-09-15 at 12.52.09 PM.png',303032,1350,1036,'2023-03-15 22:15:03',0,0),
	(5,'devuserid','bafkreiesh5g7tycm3imgt5ydz5wjijvcmw5htqydceq4ksu6ebxreofgby','BhTh7z7WLCMEVZSZ51629','image/jpeg','','example.jpg',160598,1350,1036,'2023-03-15 22:16:00',0,0),
	(6,'devuserid','bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku','vZP5GkvYvUlnNTgBFsxWx','','','biggest.jpg',0,0,0,'2023-03-15 22:34:44',0,0),
	(7,'devuserid','bafkreihdiajsgbhupojlk7ml6i7ilsdsmcr6fxmktw4qryxzdqzutbecl4','vZP5GkvYvUlnNTgBFsxWx','image/jpeg','','blob',10610,238,119,'2023-03-15 22:43:53',0,0),
	(8,'devuserid','bafkreietqictwqhbbova4vhfoqa2rp7no5jozyjekxiho7fadmvtsscbvm','vZP5GkvYvUlnNTgBFsxWx','image/jpeg','','blob',6608,157,122,'2023-03-15 22:44:21',0,0),
	(9,'devuserid','bafkreievsb6idm7evpjgprvu3ceja5y4vwyni77weiwed5eygaj2dav5vi','vZP5GkvYvUlnNTgBFsxWx','image/jpeg','','blob',5739,158,122,'2023-03-15 22:44:26',0,0),
	(10,'devuserid','bafkreidysbfe7p5moekfd26azzpbzf2b6utfyicdpbeudot5qmnrbufr4y','vZP5GkvYvUlnNTgBFsxWx','image/jpeg','','blob',8511,143,122,'2023-03-15 22:44:29',0,0),
	(11,'devuserid','bafkreih6vklqhyv4fw4quwm26sdienhu52jsbfnb4w5jdl5x5kqxl5vnte','vZP5GkvYvUlnNTgBFsxWx','image/jpeg','','blob',6699,238,113,'2023-03-15 22:44:33',0,0),
	(12,'devuserid','bafkreihdiajsgbhupojlk7ml6i7ilsdsmcr6fxmktw4qryxzdqzutbecl4','8QvmHAxjedxvOuJKf3Mzv','image/jpeg','','blob',10610,238,119,'2023-03-15 22:49:14',0,0),
	(13,'devuserid','bafkreidysbfe7p5moekfd26azzpbzf2b6utfyicdpbeudot5qmnrbufr4y','KnLHsnMdcQir9fJhaoIgK','image/jpeg','','blob',8511,143,122,'2023-03-15 22:50:16',0,0),
	(14,'devuserid','bafkreihdiajsgbhupojlk7ml6i7ilsdsmcr6fxmktw4qryxzdqzutbecl4','tUNHK0SsKldYWKqk7uny2','image/jpeg','','blob',10610,238,119,'2023-03-15 22:51:24',0,0),
	(15,'devuserid','bafkreievsb6idm7evpjgprvu3ceja5y4vwyni77weiwed5eygaj2dav5vi','2d9hGVtbyQc8IbVNY8Jlw','image/jpeg','','blob',5739,158,122,'2023-03-16 13:44:52',0,0),
	(16,'devuserid','bafkreidysbfe7p5moekfd26azzpbzf2b6utfyicdpbeudot5qmnrbufr4y','2d9hGVtbyQc8IbVNY8Jlw','image/jpeg','','blob',8511,143,122,'2023-03-16 13:45:11',0,0),
	(17,'devuserid','bafkreife5ldiga34mx7jjkqgwe2xswjzmmp6re3vz4nk6hl7niiabpaxfu','l3vCLJRItpnU1cWv3kh97','image/jpeg','','blob',9424,237,78,'2023-03-17 21:18:01',0,0),
	(18,'devuserid','bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku','','','','Screenshot 2023-03-17 at 2.38.37 PM.png',0,0,0,'2023-03-17 21:45:56',0,0),
	(19,'devuserid','bafkreidjzfrzg2oehhojpsiuuumfup4dxpi342pmyqlln57tydp7oqax6m','_9h6s1LRN23HvKDdjplVVB','image/png','cool chart','Screenshot 2023-03-16 at 11.30.57 AM.png',814762,2608,1896,'2023-03-20 22:05:54',0,0),
	(20,'devuserid','bafkreibf24rzls4rzohickwrnobotyc3u44wpmygs2e7qce4mjmt5acpum','_9h6s1LRN23HvKDdjplVVB','image/png','correct answer','Screenshot 2023-03-16 at 11.44.05 AM.png',258190,2222,1714,'2023-03-20 22:08:14',0,0),
	(21,'devuserid','bafkreiett6gelwhmhdkpxtsesmlxe5yntj4ioexkstba4qthseuecxgfnm','_zn5SCM8rjqZBY8qM764HS','image/png','top 10','Screenshot 2023-03-20 at 10.36.04 AM.png',171905,662,262,'2023-03-21 02:38:46',0,0),
	(22,'devuserid','bafkreifaryyciltqgjg5dnunsenxvjk67kofjpaf7oxttdm2zrdexrnvg4','_DWRUIz0ngtbZCm4MJuYu9','image/jpeg','','blob',9212,238,94,'2023-03-21 13:25:43',0,0),
	(28,'devuserid','bafkreihdiajsgbhupojlk7ml6i7ilsdsmcr6fxmktw4qryxzdqzutbecl4','_jyBQ8oDQxwS3lLFV477Ru','image/jpeg','','blob',10610,238,119,'2023-03-21 21:38:24',0,0),
	(29,'devuserid','bafkreidysbfe7p5moekfd26azzpbzf2b6utfyicdpbeudot5qmnrbufr4y','_yLqBDOFOlO4cVGn5XnupY','image/jpeg','','blob',8511,143,122,'2023-03-21 21:43:07',0,0),
	(30,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_yLqBDOFOlO4cVGn5XnupY','image/jpeg','','blob',5850,144,81,'2023-03-21 21:44:32',0,0),
	(31,'devuserid','bafkreietqictwqhbbova4vhfoqa2rp7no5jozyjekxiho7fadmvtsscbvm','_yLqBDOFOlO4cVGn5XnupY','image/jpeg','','blob',6608,157,122,'2023-03-21 22:11:10',0,0),
	(32,'devuserid','bafkreiett6gelwhmhdkpxtsesmlxe5yntj4ioexkstba4qthseuecxgfnm','_8m0E80RwrSvSLuCo6w1oW','image/png','famous ed devs','Screenshot 2023-03-20 at 10.36.04 AM.png',171905,662,262,'2023-03-23 14:55:00',0,0),
	(33,'devuserid','bafkreifrwlxh43k46lo6n6sbsnt3jxnqcxktvz5r7uvbgrxfojujarqoia','_EHo02ENCyv55HgZFVN7xH','image/png','code','Screenshot 2023-03-23 at 10.08.48 AM.png',142384,864,290,'2023-03-24 15:08:00',0,0),
	(34,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_EHo02ENCyv55HgZFVN7xH','image/jpeg','','blob',5850,144,81,'2023-03-24 15:09:03',0,0),
	(35,'devuserid','bafkreiehm6cgxoejakdkbphzbxs6he6tqx6cwkzjpwcac5njag55lbeepi','_gdgXJwqjCRM4TfH8WYZ4J','image/jpeg','','blob',6434,166,121,'2023-03-25 17:27:33',0,0),
	(36,'devuserid','bafkreifawl5n6y7gxfn45kckewqzttu7xsruzebvset6wd7ylvinqhbcyq','_mSN2sMOgIrjbxJLDADg3z','image/jpeg','','blob',6072,86,121,'2023-03-25 18:58:45',0,0),
	(37,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',5850,144,81,'2023-03-26 02:07:23',0,0),
	(38,'devuserid','bafkreihdiajsgbhupojlk7ml6i7ilsdsmcr6fxmktw4qryxzdqzutbecl4','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',10610,238,119,'2023-03-26 02:07:34',0,0),
	(39,'devuserid','bafkreievsb6idm7evpjgprvu3ceja5y4vwyni77weiwed5eygaj2dav5vi','_DWRUIz0ngtbZCm4MJuYu9','image/jpeg','','blob',5739,158,122,'2023-03-26 02:47:40',0,0),
	(40,'devuserid','bafkreiarj6u3uumh5gytgzkckczasc6cwugrygf4ovylwllier7iyiml3m','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',9541,209,122,'2023-03-26 02:47:57',0,0),
	(41,'devuserid','bafkreieuqm4lnkplq2nyho7pxcwhgh4qljlka7i343rxiceuf3xyuzphwy','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',7370,176,102,'2023-03-26 02:50:47',0,0),
	(42,'devuserid','bafkreidelofypp53wasdsbbbn7exvwckfaw6xhiczsj23qyy2yaaqjfhxa','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',7171,180,105,'2023-03-26 02:51:44',0,0),
	(43,'devuserid','bafkreigd5qr3hq5ciyhy7df5iwowdkzglymv65tjko4idhtj2itbzhbnxa','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',6724,91,129,'2023-03-26 02:53:08',0,0),
	(44,'devuserid','bafkreiaj5i4grgkfrhao36mbvwmziltonhv6rcp5xttwdfx2gqpyvqsc6e','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',8919,149,126,'2023-03-26 02:57:36',0,0),
	(45,'devuserid','bafkreie6sil52ks5cnqdyu2a5ngrmbia3lt7nbwmmrn76cths7dq47f3cu','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',6060,176,88,'2023-03-26 02:59:54',0,0),
	(46,'devuserid','bafkreidr2hgoo4qinvlzq4yqjhotaul3lbbveu2cym2czsi5cqbh36tiae','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',6951,164,127,'2023-03-26 03:01:09',0,0),
	(47,'devuserid','bafkreighmusd7asqcvo4yy4wcw4mxylfbxkidyzksgklr3pjvxk3mvo3by','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',6309,165,127,'2023-03-26 03:06:07',0,0),
	(48,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',5850,144,81,'2023-03-26 03:12:09',0,0),
	(49,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',5850,144,81,'2023-03-26 03:12:11',0,0),
	(50,'devuserid','bafkreiaj5i4grgkfrhao36mbvwmziltonhv6rcp5xttwdfx2gqpyvqsc6e','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',8919,149,126,'2023-03-26 03:16:47',0,0),
	(51,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',5850,144,81,'2023-03-26 03:17:37',0,0),
	(52,'devuserid','bafkreidr2hgoo4qinvlzq4yqjhotaul3lbbveu2cym2czsi5cqbh36tiae','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',6951,164,127,'2023-03-26 03:18:11',0,0),
	(53,'devuserid','bafkreie6sil52ks5cnqdyu2a5ngrmbia3lt7nbwmmrn76cths7dq47f3cu','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',6060,176,88,'2023-03-26 03:18:37',0,0),
	(54,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',5850,144,81,'2023-03-26 03:19:18',0,0),
	(55,'devuserid','bafkreighmusd7asqcvo4yy4wcw4mxylfbxkidyzksgklr3pjvxk3mvo3by','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',6309,165,127,'2023-03-26 03:20:45',0,0),
	(56,'devuserid','bafkreidr2hgoo4qinvlzq4yqjhotaul3lbbveu2cym2czsi5cqbh36tiae','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',6951,164,127,'2023-03-26 03:22:19',0,0),
	(57,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',5850,144,81,'2023-03-26 03:23:45',0,0),
	(58,'devuserid','bafkreidr2hgoo4qinvlzq4yqjhotaul3lbbveu2cym2czsi5cqbh36tiae','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',6951,164,127,'2023-03-26 03:31:21',0,0),
	(59,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',5850,144,81,'2023-03-26 03:32:14',0,0),
	(60,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',5850,144,81,'2023-03-26 03:33:01',0,0),
	(61,'devuserid','bafkreighmusd7asqcvo4yy4wcw4mxylfbxkidyzksgklr3pjvxk3mvo3by','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',6309,165,127,'2023-03-26 03:33:03',0,0),
	(62,'devuserid','bafkreiaj5i4grgkfrhao36mbvwmziltonhv6rcp5xttwdfx2gqpyvqsc6e','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',8919,149,126,'2023-03-26 03:35:07',0,0),
	(63,'devuserid','bafkreighmusd7asqcvo4yy4wcw4mxylfbxkidyzksgklr3pjvxk3mvo3by','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',6309,165,127,'2023-03-26 03:36:18',0,0),
	(64,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',5850,144,81,'2023-03-26 03:39:01',0,0),
	(65,'devuserid','bafkreiaj5i4grgkfrhao36mbvwmziltonhv6rcp5xttwdfx2gqpyvqsc6e','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',8919,149,126,'2023-03-26 03:39:23',0,0),
	(66,'devuserid','bafkreigxdya2c3coltpxswawp3i5fxqbflpguhw4bq6eaocwrrijxhl64u','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',5850,144,81,'2023-03-26 03:39:57',0,0),
	(67,'devuserid','bafkreiaj5i4grgkfrhao36mbvwmziltonhv6rcp5xttwdfx2gqpyvqsc6e','_zdgXtX9aLTbq5LH6OJtKX','image/jpeg','','blob',8919,149,126,'2023-03-26 03:40:56',0,0),
	(68,'devuserid','bafkreiaj5i4grgkfrhao36mbvwmziltonhv6rcp5xttwdfx2gqpyvqsc6e','_A8U07ENIYi2g8wSZuYrxs','image/jpeg','','blob',8919,149,126,'2023-03-26 22:15:36',0,0),
	(69,'devuserid','bafkreih3me5gl7atlq45uwmvvp3vthvtaaoqlz3ts52m56qdpdhczbw25u','_xfKpaXhtreiMtaBB2cayx','image/jpeg','','blob',10643,0,0,'2023-03-27 15:33:29',0,0),
	(70,'devuserid','bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku','_xfKpaXhtreiMtaBB2cayx','image/jpeg','','blob',10643,176,109,'2023-03-27 15:33:29',0,0),
	(71,'devuserid','bafkreie6sil52ks5cnqdyu2a5ngrmbia3lt7nbwmmrn76cths7dq47f3cu','_xfKpaXhtreiMtaBB2cayx','image/jpeg','','blob',6060,176,88,'2023-03-27 20:04:15',0,0),
	(72,'devuserid','bafkreig5lhv2bwixipe7mo5vteyg24gqgutg4sbddfehlo3qr6nlb32o2a','_DN1ERHEfjjP5XXYKp5DaX','image/jpeg','','blob',7579,176,109,'2023-03-27 20:40:55',0,0),
	(73,'devuserid','bafkreigkik4wporve7whbfyh7oeihncxqax2rzkprqnb2q5u4phmhdguda','_A8U07ENIYi2g8wSZuYrxs','image/jpeg','','blob',6984,176,87,'2023-03-28 19:44:50',0,0),
	(74,'devuserid','bafkreie6sil52ks5cnqdyu2a5ngrmbia3lt7nbwmmrn76cths7dq47f3cu','_A8U07ENIYi2g8wSZuYrxs','image/jpeg','','blob',6060,176,88,'2023-03-28 21:44:23',0,0),
	(75,'devuserid','bafkreie6sil52ks5cnqdyu2a5ngrmbia3lt7nbwmmrn76cths7dq47f3cu','_A8U07ENIYi2g8wSZuYrxs','image/jpeg','','blob',6060,176,88,'2023-03-28 21:44:41',0,0);

/*!40000 ALTER TABLE `support_files` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table temp_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `temp_log`;

CREATE TABLE `temp_log` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `doenetIds` varchar(255) DEFAULT NULL,
  `secretCodeRecieved` char(21) DEFAULT NULL,
  `secretCodeMatches` int DEFAULT '0',
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `temp_log` WRITE;
/*!40000 ALTER TABLE `temp_log` DISABLE KEYS */;

INSERT INTO `temp_log` (`id`, `doenetIds`, `secretCodeRecieved`, `secretCodeMatches`, `timestamp`)
VALUES
	(1,'_Ga07DeeWjhH6Y4UpWlakE','JaEPCQym36Uzx6vDNHVP7',1,'2022-08-04 03:34:12'),
	(2,'_Ga07DeeWjhH6Y4UpWlakE','ScZNrWZsgDUHwEnc5Qpnk',1,'2022-08-04 14:40:32'),
	(3,'_Ga07DeeWjhH6Y4UpWlakE','ScZNrWZsgDUHwEnc5Qp',0,'2022-08-04 14:41:05'),
	(4,'_Ga07DeeWjhH6Y4UpWlakE','ScZNrWZsgDUHwEnc5Qp',0,'2022-08-04 14:50:22'),
	(5,'_Ga07DeeWjhH6Y4UpWlakE','wAo9CJ0RWBusDDQCJKEw7',1,'2022-08-04 14:50:34');

/*!40000 ALTER TABLE `temp_log` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `screenName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT 'New User',
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL COMMENT 'full email address',
  `lastName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT '',
  `firstName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT '',
  `profilePicture` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `trackingConsent` tinyint(1) DEFAULT '0',
  `canUpload` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `userId`, `screenName`, `email`, `lastName`, `firstName`, `profilePicture`, `trackingConsent`, `canUpload`)
VALUES
	(1,'devuserid','DEV','devuser@example.com','User','Dev','quokka',0,1),
	(2,'s1userid','S1','s1@example.com','User','Student1','quokka',1,0),
	(26,'s2userid','S2','s2@example.com','User','Student2','ALSDKFJLKASDJFKASJDFLKAJSDFK.png',1,0),
	(27,'t1LsUo14It9GJIWAs9xnB','maple bacon','kevin@doenet.org','Charles','Kevin','bird',0,0);

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_assignment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_assignment`;

CREATE TABLE `user_assignment` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `userId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `dueDateOverride` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means no override',
  `numberOfAttemptsAllowedAdjustment` int DEFAULT NULL,
  `groupId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL COMMENT 'NULL means no group',
  `groupName` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL COMMENT 'NULL means no group',
  `completed` bit(1) DEFAULT NULL COMMENT 'For ToDo list',
  `completedDate` datetime DEFAULT NULL,
  `credit` double NOT NULL DEFAULT '0' COMMENT 'Overwritten by metric used to calculate it from other tables. Always 0-1 scale.',
  `creditOverride` double DEFAULT NULL COMMENT 'if not NULL then credit field will be set to this',
  `isUnassigned` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `doenetId-userId` (`doenetId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `user_assignment` WRITE;
/*!40000 ALTER TABLE `user_assignment` DISABLE KEYS */;

INSERT INTO `user_assignment` (`id`, `doenetId`, `userId`, `dueDateOverride`, `numberOfAttemptsAllowedAdjustment`, `groupId`, `groupName`, `completed`, `completedDate`, `credit`, `creditOverride`, `isUnassigned`)
VALUES
	(1,'_Ga07DeeWjhH6Y4UpWlakE','cyuserId',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,b'0');

/*!40000 ALTER TABLE `user_assignment` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_assignment_attempt
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_assignment_attempt`;

CREATE TABLE `user_assignment_attempt` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `userId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `attemptNumber` int NOT NULL DEFAULT '1',
  `credit` double DEFAULT NULL,
  `creditOverride` double DEFAULT NULL,
  `began` datetime DEFAULT NULL,
  `finished` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid-doenetId-attemptNumber` (`userId`,`doenetId`,`attemptNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `user_assignment_attempt` WRITE;
/*!40000 ALTER TABLE `user_assignment_attempt` DISABLE KEYS */;

INSERT INTO `user_assignment_attempt` (`id`, `doenetId`, `userId`, `attemptNumber`, `credit`, `creditOverride`, `began`, `finished`)
VALUES
	(1,'_Ga07DeeWjhH6Y4UpWlakE','cyuserId',1,1,NULL,'2022-08-04 03:32:48',NULL);

/*!40000 ALTER TABLE `user_assignment_attempt` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_assignment_attempt_item
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_assignment_attempt_item`;

CREATE TABLE `user_assignment_attempt_item` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `userId` char(21) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `attemptNumber` int NOT NULL,
  `itemNumber` int NOT NULL COMMENT 'The number of the scored item found in the Doenet code.',
  `credit` double DEFAULT NULL COMMENT 'maximum credit',
  `creditOverride` double DEFAULT NULL,
  `weight` float NOT NULL DEFAULT '1' COMMENT 'Weight comes from Doenet code.',
  `viewedSolution` tinyint(1) DEFAULT '0',
  `viewedSolutionDate` datetime DEFAULT NULL COMMENT 'Datetime when they first viewed the solution',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_rows` (`userId`,`doenetId`,`attemptNumber`,`itemNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

LOCK TABLES `user_assignment_attempt_item` WRITE;
/*!40000 ALTER TABLE `user_assignment_attempt_item` DISABLE KEYS */;

INSERT INTO `user_assignment_attempt_item` (`id`, `doenetId`, `userId`, `attemptNumber`, `itemNumber`, `credit`, `creditOverride`, `weight`, `viewedSolution`, `viewedSolutionDate`)
VALUES
	(1,'_Ga07DeeWjhH6Y4UpWlakE','cyuserId',1,1,1,NULL,1,0,NULL);

/*!40000 ALTER TABLE `user_assignment_attempt_item` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_device
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_device`;

CREATE TABLE `user_device` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `signInCode` decimal(9,0) DEFAULT NULL,
  `timestampOfSignInCode` datetime DEFAULT NULL,
  `deviceName` varchar(255) DEFAULT NULL,
  `signedIn` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `user_device` WRITE;
/*!40000 ALTER TABLE `user_device` DISABLE KEYS */;

INSERT INTO `user_device` (`id`, `userId`, `email`, `signInCode`, `timestampOfSignInCode`, `deviceName`, `signedIn`)
VALUES
	(1,'t1LsUo14It9GJIWAs9xnB','kevin@doenet.org',664273265,'2023-03-27 14:22:08','Sycamore',1),
	(2,'t1LsUo14It9GJIWAs9xnB','kevin@doenet.org',280186330,'2023-03-28 21:51:38','Beech',1);

/*!40000 ALTER TABLE `user_device` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
