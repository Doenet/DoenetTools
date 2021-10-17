# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.29)
# Database: doenet_local
# Generation Time: 2021-10-10 00:15:27 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table assignment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `assignment`;

CREATE TABLE `assignment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT 'matches code table contentId',
  `contentId` char(64) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'matches code table contentId',
  `driveId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `assignedDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means open until the dueDate. If dueDate is also NULL then open all the time.',
  `pinnedAfterDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means shows immediately',
  `pinnedUntilDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means never stops being pinned',
  `dueDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means never closes',
  `timeLimit` int(11) DEFAULT NULL COMMENT 'NULL means it''s not timed',
  `numberOfAttemptsAllowed` int(11) DEFAULT NULL COMMENT 'NULL means infinite, Assignment Level Number Of Attempts',
  `sortOrder` int(11) DEFAULT NULL,
  `attemptAggregation` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `totalPointsOrPercent` float DEFAULT NULL COMMENT 'Assignment level',
  `gradeCategory` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `individualize` tinyint(1) NOT NULL DEFAULT '0',
  `multipleAttempts` tinyint(1) NOT NULL DEFAULT '0',
  `showSolution` tinyint(1) NOT NULL DEFAULT '1',
  `showSolutionInGradebook` tinyint(1) NOT NULL DEFAULT '1',
  `showFeedback` tinyint(1) NOT NULL DEFAULT '1',
  `showHints` tinyint(1) NOT NULL DEFAULT '1',
  `showCorrectness` tinyint(1) NOT NULL DEFAULT '1',
  `proctorMakesAvailable` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Released by proctor or instructor',
  `examCoverHTML` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doenetId` (`doenetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;

INSERT INTO `assignment` (`id`, `doenetId`, `contentId`, `driveId`, `assignedDate`, `pinnedAfterDate`, `pinnedUntilDate`, `dueDate`, `timeLimit`, `numberOfAttemptsAllowed`, `sortOrder`, `attemptAggregation`, `totalPointsOrPercent`, `gradeCategory`, `individualize`, `multipleAttempts`, `showSolution`, `showSolutionInGradebook`, `showFeedback`, `showHints`, `showCorrectness`, `proctorMakesAvailable`, `examCoverHTML`)
VALUES
	(488,'doenetId',NULL,'driveId','2021-06-04 08:20:07',NULL,NULL,'2021-06-09 08:20:07',101000,2,NULL,'m',0,'l',0,0,1,1,1,1,1,0,NULL);

/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table class_times
# ------------------------------------------------------------

DROP TABLE IF EXISTS `class_times`;

CREATE TABLE `class_times` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `driveId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `dotwIndex` int(1) NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table collection
# ------------------------------------------------------------

DROP TABLE IF EXISTS `collection`;

CREATE TABLE `collection` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) DEFAULT '',
  `entryId` char(21) NOT NULL,
  `entryDoenetId` char(21) NOT NULL DEFAULT '',
  `entryContentId` char(64) NOT NULL DEFAULT '',
  `entryVariant` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table collection_groups
# ------------------------------------------------------------

DROP TABLE IF EXISTS `collection_groups`;

CREATE TABLE `collection_groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) NOT NULL DEFAULT '',
  `minStudents` int(11) NOT NULL DEFAULT '1',
  `maxStudents` int(11) NOT NULL DEFAULT '1',
  `preferredStudents` int(11) NOT NULL DEFAULT '1',
  `preAssigned` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table content
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content`;

CREATE TABLE `content` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `contentId` char(64) COLLATE utf8_unicode_ci DEFAULT '0',
  `versionId` char(21) COLLATE utf8_unicode_ci DEFAULT '0',
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `isDraft` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'When this is true (1) is the running draft version between published versions',
  `isNamed` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'When this is true (1) is the running draft version between published versions',
  `isReleased` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'When this is true (1) is the running draft version between published versions',
  `isAssigned` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'When this is true (1) is the running draft version between published versions',
  `removedFlag` tinyint(1) NOT NULL DEFAULT '0',
  `public` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `contentId` (`contentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table content_interactions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `content_interactions`;

CREATE TABLE `content_interactions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `deviceName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `doenetId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `contentId` char(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `stateVariables` mediumtext COLLATE utf8_unicode_ci,
  `variant` text COLLATE utf8_unicode_ci NOT NULL,
  `attemptNumber` int(11) DEFAULT NULL,
  `interactionSource` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table course_grade_category
# ------------------------------------------------------------

DROP TABLE IF EXISTS `course_grade_category`;

CREATE TABLE `course_grade_category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `courseId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `gradeCategory` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `totalPointsOrPercent` float NOT NULL DEFAULT '0',
  `numberToDrop` int(11) NOT NULL DEFAULT '0',
  `assignmentsInPercent` bit(11) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table drive
# ------------------------------------------------------------

DROP TABLE IF EXISTS `drive`;

CREATE TABLE `drive` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `driveId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `label` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `driveType` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `isShared` tinyint(1) DEFAULT '0',
  `isPublic` tinyint(1) DEFAULT '0' COMMENT 'Course is findable in search and drive_content isPublic content is available',
  `isDeleted` tinyint(1) DEFAULT '0',
  `image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `color` char(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  `examPasscode` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `browserExamKeys` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table drive_content
# ------------------------------------------------------------

DROP TABLE IF EXISTS `drive_content`;

CREATE TABLE `drive_content` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `driveId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `itemId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parentFolderId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `label` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creationDate` timestamp NULL DEFAULT NULL,
  `isDeleted` int(1) NOT NULL DEFAULT '0',
  `isReleased` int(1) NOT NULL DEFAULT '0' COMMENT 'The content or folder shows to the instructor in course',
  `isAssigned` int(1) NOT NULL DEFAULT '0' COMMENT 'The content or folder shows to the student',
  `isPublic` int(1) NOT NULL DEFAULT '0' COMMENT 'The course is available to search for and this content is available',
  `itemType` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `doenetId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sourceDoenetId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Filled after a copy of drive, folder or doenetML',
  `sortOrder` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `folderId` (`itemId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table drive_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `drive_user`;

CREATE TABLE `drive_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `driveId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `canEditContent` tinyint(1) DEFAULT '0',
  `canViewDrive` tinyint(1) DEFAULT '0',
  `canDeleteDrive` tinyint(1) DEFAULT '0',
  `canShareDrive` tinyint(1) DEFAULT '0',
  `canAddItemsAndFolders` tinyint(1) DEFAULT '0',
  `canDeleteItemsAndFolders` tinyint(1) DEFAULT '0',
  `canMoveItemsAndFolders` tinyint(1) DEFAULT '0',
  `canRenameItemsAndFolders` tinyint(1) DEFAULT '0',
  `canPublishItemsAndFolders` tinyint(1) DEFAULT '0',
  `canViewUnreleasedItemsAndFolders` tinyint(1) DEFAULT '0',
  `canViewUnassignedItemsAndFolders` tinyint(1) DEFAULT '0',
  `canChangeAllDriveSettings` tinyint(1) DEFAULT '0',
  `role` char(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userDrive` (`userId`,`driveId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table enrollment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enrollment`;

CREATE TABLE `enrollment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `driveId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `userId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `firstName` varchar(127) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastName` varchar(127) COLLATE utf8_unicode_ci DEFAULT NULL,
  `username` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `empId` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dateEnrolled` datetime DEFAULT NULL COMMENT 'UTC DateTime',
  `section` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `withdrew` bit(1) DEFAULT b'0',
  `dateWithdrew` datetime DEFAULT NULL COMMENT 'UTC DateTime',
  `forTesting` bit(1) DEFAULT b'0' COMMENT 'Flags account to not to be included in course calculations',
  `courseCredit` double DEFAULT NULL,
  `courseGrade` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `overrideCourseGrade` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `timeLimitMultiplier` float NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_courseId` (`username`,`driveId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;

INSERT INTO `enrollment` (`id`, `driveId`, `userId`, `firstName`, `lastName`, `username`, `email`, `empId`, `dateEnrolled`, `section`, `withdrew`, `dateWithdrew`, `forTesting`, `courseCredit`, `courseGrade`, `overrideCourseGrade`, `timeLimitMultiplier`)
VALUES
	(1,'aI8sK4vmEhC5sdeSP3vNW','devuserid','generic','user','devuser',NULL,'1234567','2019-09-03 20:29:41','15',b'0',NULL,b'0',NULL,'A',NULL,1),
	(2,'fsa4214fasgag1512525f',NULL,'SHOULD NOT','BE LOADED','invalid',NULL,'5254243','2019-09-03 20:29:41','2',b'0',NULL,b'0',NULL,NULL,NULL,1),
	(4,'aI8sK4vmEhC5sdeSP3vNW','temp1','Anatole','Wickrath','awickrath0',NULL,'60',NULL,NULL,b'0',NULL,b'0',NULL,'B',NULL,1),
	(5,'aI8sK4vmEhC5sdeSP3vNW','temp2','Antony','Aylett','aaylett1',NULL,'7',NULL,NULL,b'0',NULL,b'0',NULL,'B-',NULL,1),
	(6,'aI8sK4vmEhC5sdeSP3vNW','temp3','Lindi','Rash','lrash2',NULL,'5',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(7,'aI8sK4vmEhC5sdeSP3vNW','temp4','Nicholas','Peteri','npeteri3',NULL,'119',NULL,NULL,b'0',NULL,b'0',NULL,'B+',NULL,1),
	(8,'aI8sK4vmEhC5sdeSP3vNW','temp5','Savina','Michin','smichin4',NULL,'852',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(9,'aI8sK4vmEhC5sdeSP3vNW','temp6','Gerry','Sallan','gsallan5',NULL,'89',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(10,'aI8sK4vmEhC5sdeSP3vNW','temp7','Wakefield','Bengle','wbengle6',NULL,'4786',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(11,'aI8sK4vmEhC5sdeSP3vNW','temp8','Patrice','Bavin','pbavin8',NULL,'75024',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(12,'aI8sK4vmEhC5sdeSP3vNW','temp9','Merrile','McGee','mmcgee9',NULL,'9240',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(13,'aI8sK4vmEhC5sdeSP3vNW','temp10','Ardath','Celler','acellera',NULL,'4522',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(14,'aI8sK4vmEhC5sdeSP3vNW','temp11','Ashleigh','Lothean','alotheanb',NULL,'259',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(15,'aI8sK4vmEhC5sdeSP3vNW','temp12','Salomon','Scorah','sscorahd',NULL,'2',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(16,'aI8sK4vmEhC5sdeSP3vNW','temp13','Xaviera','Kupec','xkupece',NULL,'4',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(17,'aI8sK4vmEhC5sdeSP3vNW','temp14','Pennie','Badder','pbadderg',NULL,'3931',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(18,'aI8sK4vmEhC5sdeSP3vNW','temp15','Travis','Sarrell','tsarrellh',NULL,'7947',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(19,'aI8sK4vmEhC5sdeSP3vNW','temp16','Eldin','Crosser','ecrosserj',NULL,'96895',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(20,'aI8sK4vmEhC5sdeSP3vNW','temp17','Ginger','Nijs','gnijsl',NULL,'60',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(21,'aI8sK4vmEhC5sdeSP3vNW','temp18','Petronille','Pidcock','ppidcockm',NULL,'381',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(22,'aI8sK4vmEhC5sdeSP3vNW','temp19','Arlee','Duggleby','adugglebyn',NULL,'5',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1),
	(23,'aI8sK4vmEhC5sdeSP3vNW','temp20','Ambur','Viant','avianto',NULL,'34',NULL,NULL,b'0',NULL,b'0',NULL,NULL,NULL,1);

/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table event
# ------------------------------------------------------------

DROP TABLE IF EXISTS `event`;

CREATE TABLE `event` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `verb` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contentId` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `doenetId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `attemptNumber` int(11) DEFAULT NULL,
  `variant` text COLLATE utf8_unicode_ci NOT NULL,
  `object` mediumtext COLLATE utf8_unicode_ci,
  `context` mediumtext COLLATE utf8_unicode_ci,
  `result` mediumtext COLLATE utf8_unicode_ci,
  `timestamp` timestamp NULL DEFAULT NULL,
  `timestored` timestamp NULL DEFAULT NULL,
  `version` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deviceName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table experiment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `experiment`;

CREATE TABLE `experiment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `experimentId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `waitingContentId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creationDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means open until the dueDate. If dueDate is also NULL then open all the time.',
  `assignedDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means open until the dueDate. If dueDate is also NULL then open all the time.',
  `hasBegun` int(1) DEFAULT '0',
  `numberOfGroups` int(11) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `screenName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'full email address',
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'full email address',
  `lastName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `firstName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `profilePicture` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trackingConsent` tinyint(1) DEFAULT '0',
  `roleStudent` tinyint(1) DEFAULT '1',
  `roleInstructor` tinyint(1) DEFAULT '0',
  `roleCourseDesigner` tinyint(1) DEFAULT '0',
  `roleWatchdog` tinyint(1) DEFAULT '0',
  `roleCommunityTA` tinyint(1) DEFAULT '0',
  `roleLiveDataCommunity` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `userId`, `screenName`, `email`, `lastName`, `firstName`, `profilePicture`, `trackingConsent`, `roleStudent`, `roleInstructor`, `roleCourseDesigner`, `roleWatchdog`, `roleCommunityTA`, `roleLiveDataCommunity`)
VALUES
	(1,'devuserid','DEV','devuser@example.com','User','Dev','quokka',0,1,1,0,0,0,0),
	(2,'s1userid','S1','s1@example.com','User','Student1','quokka',1,1,0,0,0,0,0),
	(26,'s2userid','S2','s2@example.com','User','Student2','ALSDKFJLKASDJFKASJDFLKAJSDFK.png',1,1,0,0,0,0,0);

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_assignment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_assignment`;

CREATE TABLE `user_assignment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `contentId` char(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT 'NULL means no group',
  `dueDateOverride` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means no override',
  `numberOfAttemptsAllowedOverride` int(11) DEFAULT NULL,
  `groupId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'NULL means no group',
  `groupName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'NULL means no group',
  `completed` bit(1) DEFAULT NULL COMMENT 'For ToDo list',
  `completedDate` datetime DEFAULT NULL,
  `credit` double NOT NULL DEFAULT '0' COMMENT 'Overwritten by metric used to calculate it from other tables. Always 0-1 scale.',
  `creditOverride` double DEFAULT NULL COMMENT 'if not NULL then credit field will be set to this',
  PRIMARY KEY (`id`),
  UNIQUE KEY `assignment-userId` (`doenetId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table user_assignment_attempt
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_assignment_attempt`;

CREATE TABLE `user_assignment_attempt` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `contentId` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `attemptNumber` int(11) NOT NULL DEFAULT '1',
  `credit` double DEFAULT NULL,
  `creditOverride` double DEFAULT NULL,
  `assignedVariant` text COLLATE utf8_unicode_ci COMMENT 'Like seed. Informs the selects what values to use for the content. NULL means didn''t view yet.',
  `generatedVariant` text COLLATE utf8_unicode_ci COMMENT 'Based on code',
  `began` datetime DEFAULT NULL,
  `finished` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid-assignmentid-attemptnum` (`userId`,`doenetId`,`attemptNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table user_assignment_attempt_item
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_assignment_attempt_item`;

CREATE TABLE `user_assignment_attempt_item` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `contentId` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `attemptNumber` int(11) NOT NULL,
  `itemNumber` int(11) NOT NULL COMMENT 'The number of the scored item found in the Doenet code.',
  `credit` double DEFAULT NULL COMMENT 'maximum credit',
  `creditOverride` double DEFAULT NULL,
  `weight` float NOT NULL DEFAULT '1' COMMENT 'Weight comes from Doenet code.',
  `generatedVariant` text COLLATE utf8_unicode_ci,
  `viewedSolution` tinyint(1) DEFAULT '0',
  `viewedSolutionDate` datetime DEFAULT NULL COMMENT 'Datetime when they first viewed the solution',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_rows` (`userId`,`doenetId`,`attemptNumber`,`itemNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table user_assignment_attempt_item_submission
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_assignment_attempt_item_submission`;

CREATE TABLE `user_assignment_attempt_item_submission` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `contentId` char(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `attemptNumber` int(11) NOT NULL,
  `itemNumber` int(11) NOT NULL,
  `submissionNumber` int(11) NOT NULL,
  `stateVariables` mediumtext COLLATE utf8_unicode_ci COMMENT 'JSON used to persist state of user''s experience',
  `credit` float DEFAULT NULL,
  `submittedDate` datetime NOT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Past the due date. When the assesment wasn''t open.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_rows` (`userId`,`doenetId`,`attemptNumber`,`itemNumber`,`submissionNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



# Dump of table user_device
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_device`;

CREATE TABLE `user_device` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `signInCode` decimal(9,0) DEFAULT NULL,
  `timestampOfSignInCode` datetime DEFAULT NULL,
  `deviceName` varchar(255) DEFAULT NULL,
  `signedIn` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
