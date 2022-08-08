-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: localhost    Database: doenet_local
-- ------------------------------------------------------
-- Server version	5.7.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `doenet_local`
--

/*!40000 DROP DATABASE IF EXISTS `doenet_local`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `doenet_local` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `doenet_local`;

--
-- Table structure for table `activity_state`
--

DROP TABLE IF EXISTS `activity_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_state` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `doenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `attemptNumber` int(11) NOT NULL,
  `saveId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cid` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `deviceName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `variantIndex` int(11) NOT NULL,
  `activityInfo` mediumtext COLLATE utf8_unicode_ci,
  `activityState` mediumtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId-doenetId-attemptNumber` (`userId`,`doenetId`,`attemptNumber`),
  KEY `saveId` (`saveId`),
  KEY `cid` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_state`
--

LOCK TABLES `activity_state` WRITE;
/*!40000 ALTER TABLE `activity_state` DISABLE KEYS */;
INSERT INTO `activity_state` VALUES (1,'cyuserId','_Ga07DeeWjhH6Y4UpWlakE',1,'StbBhgrC0UT1kf31HTUzI','bafkreieszxhhjdhin3wbdvaudhiumb2ygqbnd6cfwyz4hqjdcbgrw6cebq','Salix caprea',379,'{\"orderWithCids\":[{\"type\":\"page\",\"cid\":\"bafkreiemblagflvpgbvw2zgurtswwcltj6mkolerhebcymztdmrsoabz6a\"}],\"variantsByPage\":[1],\"itemWeights\":[1],\"numberOfVariants\":1000}','{\"currentPage\":1}');
/*!40000 ALTER TABLE `activity_state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assignment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `courseId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `assignedDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means open until the dueDate. If dueDate is also NULL then open all the time.',
  `pinnedAfterDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means shows immediately',
  `pinnedUntilDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means never stops being pinned',
  `dueDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means never closes',
  `timeLimit` int(11) DEFAULT NULL COMMENT 'NULL means it''s not timed',
  `numberOfAttemptsAllowed` int(11) DEFAULT NULL COMMENT 'NULL means infinite, Assignment Level Number Of Attempts',
  `attemptAggregation` char(1) COLLATE utf8_unicode_ci DEFAULT 'm',
  `totalPointsOrPercent` float DEFAULT '10',
  `gradeCategory` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `individualize` tinyint(1) NOT NULL DEFAULT '0',
  `showSolution` tinyint(1) NOT NULL DEFAULT '1',
  `showSolutionInGradebook` tinyint(1) NOT NULL DEFAULT '1',
  `showFeedback` tinyint(1) NOT NULL DEFAULT '1',
  `showHints` tinyint(1) NOT NULL DEFAULT '1',
  `showCorrectness` tinyint(1) NOT NULL DEFAULT '1',
  `showCreditAchievedMenu` tinyint(1) NOT NULL DEFAULT '1',
  `proctorMakesAvailable` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Released by proctor or instructor',
  PRIMARY KEY (`id`),
  UNIQUE KEY `doenetId` (`doenetId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
INSERT INTO `assignment` VALUES (1,'_Ga07DeeWjhH6Y4UpWlakE','_KwRMyq2rLo3B0dhVXgh6R',NULL,NULL,NULL,NULL,NULL,NULL,'m',10,NULL,0,1,1,1,1,1,1,0);
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_times`
--

DROP TABLE IF EXISTS `class_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `class_times` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `driveId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `dotwIndex` int(1) NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `sortOrder` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_times`
--

LOCK TABLES `class_times` WRITE;
/*!40000 ALTER TABLE `class_times` DISABLE KEYS */;
/*!40000 ALTER TABLE `class_times` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collection`
--

DROP TABLE IF EXISTS `collection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `collection` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) DEFAULT '',
  `entryId` char(21) NOT NULL,
  `entryDoenetId` char(21) NOT NULL DEFAULT '',
  `entryContentId` char(64) NOT NULL DEFAULT '',
  `entryVariant` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collection`
--

LOCK TABLES `collection` WRITE;
/*!40000 ALTER TABLE `collection` DISABLE KEYS */;
/*!40000 ALTER TABLE `collection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collection_groups`
--

DROP TABLE IF EXISTS `collection_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `collection_groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) NOT NULL DEFAULT '',
  `minStudents` int(11) NOT NULL DEFAULT '1',
  `maxStudents` int(11) NOT NULL DEFAULT '1',
  `preferredStudents` int(11) NOT NULL DEFAULT '1',
  `preAssigned` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collection_groups`
--

LOCK TABLES `collection_groups` WRITE;
/*!40000 ALTER TABLE `collection_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `collection_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `content` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `cid` char(64) COLLATE utf8_unicode_ci DEFAULT '0',
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
  KEY `cid` (`cid`),
  KEY `doenetId` (`doenetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_interactions`
--

DROP TABLE IF EXISTS `content_interactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `content_interactions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `deviceName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `doenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `contentId` char(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `stateVariables` mediumtext COLLATE utf8_unicode_ci,
  `variant` text COLLATE utf8_unicode_ci NOT NULL,
  `attemptNumber` int(11) DEFAULT NULL,
  `interactionSource` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `should_be_unique` (`userId`,`doenetId`,`attemptNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_interactions`
--

LOCK TABLES `content_interactions` WRITE;
/*!40000 ALTER TABLE `content_interactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_interactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `courseId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `label` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'Untitled Course',
  `isPublic` tinyint(1) DEFAULT '0' COMMENT 'Course is findable in search and drive_content isPublic content is available',
  `isDeleted` tinyint(1) DEFAULT '0',
  `image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `color` char(6) COLLATE utf8_unicode_ci DEFAULT 'none',
  PRIMARY KEY (`id`),
  UNIQUE KEY `driveId` (`courseId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'_KwRMyq2rLo3B0dhVXgh6R','Untitled Course',0,0,'picture1.jpg','none');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_content`
--

DROP TABLE IF EXISTS `course_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_content` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `courseId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `doenetId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parentDoenetId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `label` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Untitled',
  `creationDate` timestamp NULL DEFAULT NULL,
  `isDeleted` int(1) NOT NULL DEFAULT '0',
  `isAssigned` int(1) NOT NULL DEFAULT '0' COMMENT 'The content or folder shows to the student',
  `isGloballyAssigned` int(1) NOT NULL DEFAULT '1' COMMENT 'The content from cid shows to all students without a cidOverride',
  `isPublic` int(1) NOT NULL DEFAULT '0' COMMENT 'The course is available to search for and this content is available',
  `userCanViewSource` int(1) NOT NULL DEFAULT '0',
  `sortOrder` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `jsonDefinition` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doenetId` (`doenetId`),
  KEY `courseId` (`courseId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_content`
--

LOCK TABLES `course_content` WRITE;
/*!40000 ALTER TABLE `course_content` DISABLE KEYS */;
INSERT INTO `course_content` VALUES (1,'activity','_KwRMyq2rLo3B0dhVXgh6R','_Ga07DeeWjhH6Y4UpWlakE','_KwRMyq2rLo3B0dhVXgh6R','Untitled Activity','2022-08-04 03:32:22',0,1,1,0,0,'n','{\"type\": \"activity\", \"files\": [], \"content\": [\"_CAIJ5GQDmIuniRQmWNwd5\"], \"version\": \"0.1.0\", \"draftCid\": null, \"assignedCid\": \"bafkreieszxhhjdhin3wbdvaudhiumb2ygqbnd6cfwyz4hqjdcbgrw6cebq\", \"itemWeights\": [1], \"isSinglePage\": true}');
/*!40000 ALTER TABLE `course_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_grade_category`
--

DROP TABLE IF EXISTS `course_grade_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_grade_category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `courseId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `gradeCategory` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `totalPointsOrPercent` float NOT NULL DEFAULT '0',
  `numberToDrop` int(11) NOT NULL DEFAULT '0',
  `assignmentsInPercent` bit(11) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `course_grade_category` (`courseId`,`gradeCategory`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_grade_category`
--

LOCK TABLES `course_grade_category` WRITE;
/*!40000 ALTER TABLE `course_grade_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_grade_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_user`
--

DROP TABLE IF EXISTS `course_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `courseId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `canViewCourse` tinyint(1) DEFAULT '0',
  `canViewContentSource` tinyint(1) DEFAULT '0',
  `canEditContent` tinyint(1) DEFAULT '0',
  `canPublishContent` tinyint(1) DEFAULT '0',
  `canViewUnassignedContent` tinyint(1) DEFAULT '0',
  `canProctor` tinyint(1) DEFAULT '0',
  `canViewAndModifyGrades` tinyint(1) DEFAULT '0',
  `canViewActivitySettings` tinyint(1) DEFAULT '0',
  `canModifyCourseSettings` tinyint(1) DEFAULT '0',
  `canViewUsers` tinyint(1) DEFAULT '0',
  `canManageUsers` tinyint(1) DEFAULT '0',
  `canModifyRoles` tinyint(1) DEFAULT '0',
  `isOwner` tinyint(1) DEFAULT '0',
  `sectionPermissionOnly` int(255) DEFAULT NULL,
  `roleLabels` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userDrive` (`userId`,`courseId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_user`
--

LOCK TABLES `course_user` WRITE;
/*!40000 ALTER TABLE `course_user` DISABLE KEYS */;
INSERT INTO `course_user` VALUES (1,'cyuserId','_KwRMyq2rLo3B0dhVXgh6R',1,1,1,1,1,1,1,1,1,1,1,1,1,NULL,'[\"Owner\"]');
/*!40000 ALTER TABLE `course_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drive`
--

DROP TABLE IF EXISTS `drive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `drive` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `driveId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `label` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `driveType` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `isShared` tinyint(1) DEFAULT '0',
  `isPublic` tinyint(1) DEFAULT '0' COMMENT 'Course is findable in search and drive_content isPublic content is available',
  `isDeleted` tinyint(1) DEFAULT '0',
  `image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `color` char(6) COLLATE utf8_unicode_ci DEFAULT NULL,
  `examPasscode` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `browserExamKeys` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `driveId` (`driveId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drive`
--

LOCK TABLES `drive` WRITE;
/*!40000 ALTER TABLE `drive` DISABLE KEYS */;
/*!40000 ALTER TABLE `drive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drive_content`
--

DROP TABLE IF EXISTS `drive_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `drive_content` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `driveId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `itemId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parentFolderId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
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
  UNIQUE KEY `folderId` (`itemId`),
  UNIQUE KEY `doenetId` (`doenetId`),
  KEY `driveId` (`driveId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drive_content`
--

LOCK TABLES `drive_content` WRITE;
/*!40000 ALTER TABLE `drive_content` DISABLE KEYS */;
/*!40000 ALTER TABLE `drive_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drive_user`
--

DROP TABLE IF EXISTS `drive_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `drive_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `driveId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
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
  `role` char(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userDrive` (`userId`,`driveId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drive_user`
--

LOCK TABLES `drive_user` WRITE;
/*!40000 ALTER TABLE `drive_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `drive_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enrollment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `courseId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
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
  KEY `driveId_userId` (`courseId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `verb` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `doenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `activityCid` char(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pageCid` char(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pageNumber` int(11) DEFAULT NULL,
  `attemptNumber` int(11) DEFAULT NULL,
  `activityVariantIndex` int(11) DEFAULT NULL,
  `pageVariantIndex` int(11) DEFAULT NULL,
  `object` mediumtext COLLATE utf8_unicode_ci,
  `context` mediumtext COLLATE utf8_unicode_ci,
  `result` mediumtext COLLATE utf8_unicode_ci,
  `timestamp` timestamp NULL DEFAULT NULL,
  `version` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=533 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (530,'cyuserId','experienced','_Ga07DeeWjhH6Y4UpWlakE','bafkreieszxhhjdhin3wbdvaudhiumb2ygqbnd6cfwyz4hqjdcbgrw6cebq','bafkreiemblagflvpgbvw2zgurtswwcltj6mkolerhebcymztdmrsoabz6a',1,1,379,1,'{\"componentName\":\"/_document1\",\"componentType\":\"document\"}','{}','{}','2022-08-04 03:32:49','0.1.1'),(531,'cyuserId','submitted','_Ga07DeeWjhH6Y4UpWlakE','bafkreieszxhhjdhin3wbdvaudhiumb2ygqbnd6cfwyz4hqjdcbgrw6cebq','bafkreiemblagflvpgbvw2zgurtswwcltj6mkolerhebcymztdmrsoabz6a',1,1,379,1,'{\"componentName\":\"/_answer1\",\"componentType\":\"answer\"}','{\"item\":1,\"itemCreditAchieved\":1,\"pageCreditAchieved\":1}','{\"response\":[42],\"responseText\":[\"42\"],\"creditAchieved\":1}','2022-08-04 03:32:52','0.1.1'),(532,'cyuserId','answered','_Ga07DeeWjhH6Y4UpWlakE','bafkreieszxhhjdhin3wbdvaudhiumb2ygqbnd6cfwyz4hqjdcbgrw6cebq','bafkreiemblagflvpgbvw2zgurtswwcltj6mkolerhebcymztdmrsoabz6a',1,1,379,1,'{\"componentName\":\"/__mathinput_KXh6glTyP5\",\"componentType\":\"mathInput\"}','{\"answerAncestor\":\"/_answer1\"}','{\"response\":42,\"responseText\":\"42\"}','2022-08-04 03:32:52','0.1.1');
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventSecretCodes`
--

DROP TABLE IF EXISTS `eventSecretCodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `eventSecretCodes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) DEFAULT NULL,
  `secretCode` char(21) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventSecretCodes`
--

LOCK TABLES `eventSecretCodes` WRITE;
/*!40000 ALTER TABLE `eventSecretCodes` DISABLE KEYS */;
INSERT INTO `eventSecretCodes` VALUES (2,'cyuserId','ScZNrWZsgDUHwEnc5Qpnk','2022-08-04 14:37:14'),(3,'cyuserId','2vct8YgUcCNeCAw89FEn9','2022-08-04 14:39:14'),(4,'cyuserId','jbTo0AMEZEx0F819nXDxj','2022-08-04 14:39:19'),(5,'cyuserId','wAo9CJ0RWBusDDQCJKEw7','2022-08-04 14:50:12');
/*!40000 ALTER TABLE `eventSecretCodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experiment`
--

DROP TABLE IF EXISTS `experiment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `experiment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `experimentId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `waitingCid` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `creationDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means open until the dueDate. If dueDate is also NULL then open all the time.',
  `assignedDate` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means open until the dueDate. If dueDate is also NULL then open all the time.',
  `hasBegun` int(1) DEFAULT '0',
  `numberOfGroups` int(11) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiment`
--

LOCK TABLES `experiment` WRITE;
/*!40000 ALTER TABLE `experiment` DISABLE KEYS */;
/*!40000 ALTER TABLE `experiment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `initial_renderer_state`
--

DROP TABLE IF EXISTS `initial_renderer_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `initial_renderer_state` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cid` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `variantIndex` int(11) NOT NULL,
  `rendererState` mediumtext COLLATE utf8_unicode_ci,
  `coreInfo` mediumtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cid-variantIndex` (`cid`,`variantIndex`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `initial_renderer_state`
--

LOCK TABLES `initial_renderer_state` WRITE;
/*!40000 ALTER TABLE `initial_renderer_state` DISABLE KEYS */;
/*!40000 ALTER TABLE `initial_renderer_state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ipfs_to_upload`
--

DROP TABLE IF EXISTS `ipfs_to_upload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ipfs_to_upload` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cid` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fileType` varchar(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sizeInBytes` int(11) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ipfs_to_upload`
--

LOCK TABLES `ipfs_to_upload` WRITE;
/*!40000 ALTER TABLE `ipfs_to_upload` DISABLE KEYS */;
/*!40000 ALTER TABLE `ipfs_to_upload` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `page_state`
--

DROP TABLE IF EXISTS `page_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `page_state` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `deviceName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `doenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `cid` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `pageNumber` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `attemptNumber` int(11) DEFAULT NULL,
  `saveId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `coreInfo` mediumtext COLLATE utf8_unicode_ci,
  `coreState` mediumtext COLLATE utf8_unicode_ci,
  `rendererState` mediumtext COLLATE utf8_unicode_ci,
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId-doenetId-pageNumber-attemptNumber` (`userId`,`doenetId`,`pageNumber`,`attemptNumber`),
  KEY `saveId` (`saveId`),
  KEY `cid` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page_state`
--

LOCK TABLES `page_state` WRITE;
/*!40000 ALTER TABLE `page_state` DISABLE KEYS */;
INSERT INTO `page_state` VALUES (1,'cyuserId','Salix caprea','_Ga07DeeWjhH6Y4UpWlakE','bafkreiemblagflvpgbvw2zgurtswwcltj6mkolerhebcymztdmrsoabz6a','1',1,'anojAO9sUJ7oWVu9tcBiY','{\"generatedVariantString\":\"{\\\"index\\\":1,\\\"name\\\":\\\"a\\\",\\\"meta\\\":{\\\"createdBy\\\":\\\"/_document1\\\"},\\\"subvariants\\\":[{\\\"seed\\\":\\\"526047095656395\\\",\\\"meta\\\":{\\\"createdBy\\\":\\\"/_problem1\\\"},\\\"subvariants\\\":[]}]}\",\"allPossibleVariants\":[\"a\"],\"variantIndicesToIgnore\":[],\"rendererTypesInDocument\":[\"section\",\"answer\",\"mathInput\"],\"documentToRender\":{\"componentName\":\"/_document1\",\"effectiveName\":\"/_document1\",\"componentType\":\"document\",\"rendererType\":\"section\",\"actions\":{\"submitAllAnswers\":{\"actionName\":\"submitAllAnswers\",\"componentName\":\"/_document1\"},\"recordVisibilityChange\":{\"actionName\":\"recordVisibilityChange\",\"componentName\":\"/_document1\"}}}}','{\"/__mathinput_KXh6glTyP5\":{\"immediateValue\":42,\"rawRendererValue\":\"42\",\"lastValueForDisplay\":42,\"dontUpdateRawValueInDefinition\":false,\"value\":42},\"/__math_d9bmzOvKly\":{\"expressionWithCodes\":42},\"/_answer1\":{\"justSubmitted\":true,\"hasBeenCorrect\":true,\"creditAchieved\":1,\"responseHasBeenSubmitted\":true,\"nSubmittedResponses\":1,\"submittedResponses\":{\"0\":42,\"mergeObject\":true},\"submittedResponsesComponentType\":[\"math\"],\"creditAchievedDependenciesAtSubmit\":\"qmmMhdXJTsIHF6t66L3Xf4WYknc=\",\"nSubmissions\":1},\"/__award_XTZPmlFGuS\":{\"awarded\":true,\"creditAchieved\":1,\"fractionSatisfied\":1}}','{\"/__mathinput_KXh6glTyP5\":{\"stateValues\":{\"hidden\":false,\"disabled\":false,\"fixed\":false,\"includeCheckWork\":true,\"creditAchieved\":1,\"valueHasBeenValidated\":true,\"showCorrectness\":true,\"numberOfAttemptsLeft\":{\"objectType\":\"special-numeric\",\"stringValue\":\"Infinity\"},\"valueForDisplay\":42,\"rawRendererValue\":\"42\"},\"childrenInstructions\":[]},\"/_answer1\":{\"stateValues\":{\"submitLabel\":\"Check Work\",\"submitLabelNoCorrectness\":\"Submit Response\",\"hidden\":false,\"fixed\":false,\"disabledOriginal\":false,\"showCorrectness\":true,\"inputChildren\":[{\"componentType\":\"mathInput\",\"componentName\":\"/__mathinput_KXh6glTyP5\"}],\"inputChildrenWithValues\":[{\"componentType\":\"mathInput\",\"componentName\":\"/__mathinput_KXh6glTyP5\",\"stateValues\":{\"value\":42,\"immediateValue\":42}}],\"delegateCheckWork\":true,\"creditAchieved\":1,\"justSubmitted\":true,\"numberOfAttemptsLeft\":{\"objectType\":\"special-numeric\",\"stringValue\":\"Infinity\"},\"disabled\":false},\"childrenInstructions\":[{\"componentName\":\"/__mathinput_KXh6glTyP5\",\"effectiveName\":\"/__mathinput_KXh6glTyP5\",\"componentType\":\"mathInput\",\"rendererType\":\"mathInput\",\"actions\":{\"updateRawValue\":{\"actionName\":\"updateRawValue\",\"componentName\":\"/__mathinput_KXh6glTyP5\"},\"updateValue\":{\"actionName\":\"updateValue\",\"componentName\":\"/__mathinput_KXh6glTyP5\"},\"submitAnswer\":{\"actionName\":\"submitAnswer\",\"componentName\":\"/_answer1\"}}}]},\"/_problem1\":{\"stateValues\":{\"submitLabel\":\"Check Work\",\"submitLabelNoCorrectness\":\"Submit Response\",\"boxed\":false,\"hidden\":false,\"disabled\":false,\"fixed\":false,\"enumeration\":[1],\"titleChildName\":null,\"title\":\"Problem 1\",\"containerTag\":\"section\",\"level\":3,\"justSubmitted\":true,\"showCorrectness\":true,\"creditAchieved\":1,\"collapsible\":false,\"open\":true,\"createSubmitAllButton\":false,\"suppressAnswerSubmitButtons\":false},\"childrenInstructions\":[{\"componentName\":\"/_answer1\",\"effectiveName\":\"/_answer1\",\"componentType\":\"answer\",\"rendererType\":\"answer\",\"actions\":{\"submitAnswer\":{\"actionName\":\"submitAnswer\",\"componentName\":\"/_answer1\"}}}]},\"/_document1\":{\"stateValues\":{\"submitLabel\":\"Check Work\",\"submitLabelNoCorrectness\":\"Submit Response\",\"hidden\":false,\"disabled\":false,\"fixed\":false,\"titleChildName\":null,\"title\":\"\",\"level\":0,\"justSubmitted\":true,\"showCorrectness\":true,\"creditAchieved\":1,\"createSubmitAllButton\":false,\"suppressAnswerSubmitButtons\":false},\"childrenInstructions\":[{\"componentName\":\"/_problem1\",\"effectiveName\":\"/_problem1\",\"componentType\":\"problem\",\"rendererType\":\"section\",\"actions\":{\"submitAllAnswers\":{\"actionName\":\"submitAllAnswers\",\"componentName\":\"/_problem1\"},\"revealSection\":{\"actionName\":\"revealSection\",\"componentName\":\"/_problem1\"},\"closeSection\":{\"actionName\":\"closeSection\",\"componentName\":\"/_problem1\"},\"recordVisibilityChange\":{\"actionName\":\"recordVisibilityChange\",\"componentName\":\"/_problem1\"}}}]}}',NULL);
/*!40000 ALTER TABLE `page_state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
  `courseId` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `containingDoenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `doenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Untitled',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`containingDoenetId`,`doenetId`),
  KEY `doenetId` (`doenetId`),
  CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`containingDoenetId`) REFERENCES `course_content` (`doenetId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES ('_KwRMyq2rLo3B0dhVXgh6R','_Ga07DeeWjhH6Y4UpWlakE','_CAIJ5GQDmIuniRQmWNwd5','Untitled',0);
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_files`
--

DROP TABLE IF EXISTS `support_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `support_files` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci DEFAULT '0',
  `cid` char(80) COLLATE utf8_unicode_ci DEFAULT '0',
  `doenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `fileType` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `asFileName` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sizeInBytes` mediumint(11) DEFAULT NULL,
  `widthPixels` int(11) DEFAULT NULL,
  `heightPixels` int(11) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `isListed` tinyint(1) NOT NULL DEFAULT '0',
  `isPublic` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_files`
--

LOCK TABLES `support_files` WRITE;
/*!40000 ALTER TABLE `support_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temp_log`
--

DROP TABLE IF EXISTS `temp_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temp_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetIds` varchar(255) DEFAULT NULL,
  `secretCodeRecieved` char(21) DEFAULT NULL,
  `secretCodeMatches` int(1) DEFAULT '0',
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temp_log`
--

LOCK TABLES `temp_log` WRITE;
/*!40000 ALTER TABLE `temp_log` DISABLE KEYS */;
INSERT INTO `temp_log` VALUES (1,'_Ga07DeeWjhH6Y4UpWlakE','JaEPCQym36Uzx6vDNHVP7',1,'2022-08-04 03:34:12'),(2,'_Ga07DeeWjhH6Y4UpWlakE','ScZNrWZsgDUHwEnc5Qpnk',1,'2022-08-04 14:40:32'),(3,'_Ga07DeeWjhH6Y4UpWlakE','ScZNrWZsgDUHwEnc5Qp',0,'2022-08-04 14:41:05'),(4,'_Ga07DeeWjhH6Y4UpWlakE','ScZNrWZsgDUHwEnc5Qp',0,'2022-08-04 14:50:22'),(5,'_Ga07DeeWjhH6Y4UpWlakE','wAo9CJ0RWBusDDQCJKEw7',1,'2022-08-04 14:50:34');
/*!40000 ALTER TABLE `temp_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL,
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
  `canUpload` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'devuserid','DEV','devuser@example.com','User','Dev','quokka',0,1,1,0,0,0,0,1),(2,'s1userid','S1','s1@example.com','User','Student1','quokka',1,1,0,0,0,0,0,0),(26,'s2userid','S2','s2@example.com','User','Student2','ALSDKFJLKASDJFKASJDFLKAJSDFK.png',1,1,0,0,0,0,0,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_assignment`
--

DROP TABLE IF EXISTS `user_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_assignment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `dueDateOverride` datetime DEFAULT NULL COMMENT 'UTC DATETIME NULL means no override',
  `numberOfAttemptsAllowedAdjustment` int(11) DEFAULT NULL,
  `groupId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'NULL means no group',
  `groupName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'NULL means no group',
  `completed` bit(1) DEFAULT NULL COMMENT 'For ToDo list',
  `completedDate` datetime DEFAULT NULL,
  `credit` double NOT NULL DEFAULT '0' COMMENT 'Overwritten by metric used to calculate it from other tables. Always 0-1 scale.',
  `creditOverride` double DEFAULT NULL COMMENT 'if not NULL then credit field will be set to this',
  `isUnassigned` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `doenetId-userId` (`doenetId`,`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_assignment`
--

LOCK TABLES `user_assignment` WRITE;
/*!40000 ALTER TABLE `user_assignment` DISABLE KEYS */;
INSERT INTO `user_assignment` VALUES (1,'_Ga07DeeWjhH6Y4UpWlakE','cyuserId',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,_binary '\0');
/*!40000 ALTER TABLE `user_assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_assignment_attempt`
--

DROP TABLE IF EXISTS `user_assignment_attempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_assignment_attempt` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL,
  `attemptNumber` int(11) NOT NULL DEFAULT '1',
  `credit` double DEFAULT NULL,
  `creditOverride` double DEFAULT NULL,
  `began` datetime DEFAULT NULL,
  `finished` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid-doenetId-attemptNumber` (`userId`,`doenetId`,`attemptNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_assignment_attempt`
--

LOCK TABLES `user_assignment_attempt` WRITE;
/*!40000 ALTER TABLE `user_assignment_attempt` DISABLE KEYS */;
INSERT INTO `user_assignment_attempt` VALUES (1,'_Ga07DeeWjhH6Y4UpWlakE','cyuserId',1,1,NULL,'2022-08-04 03:32:48',NULL);
/*!40000 ALTER TABLE `user_assignment_attempt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_assignment_attempt_item`
--

DROP TABLE IF EXISTS `user_assignment_attempt_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_assignment_attempt_item` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `userId` char(21) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `attemptNumber` int(11) NOT NULL,
  `itemNumber` int(11) NOT NULL COMMENT 'The number of the scored item found in the Doenet code.',
  `credit` double DEFAULT NULL COMMENT 'maximum credit',
  `creditOverride` double DEFAULT NULL,
  `weight` float NOT NULL DEFAULT '1' COMMENT 'Weight comes from Doenet code.',
  `viewedSolution` tinyint(1) DEFAULT '0',
  `viewedSolutionDate` datetime DEFAULT NULL COMMENT 'Datetime when they first viewed the solution',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_rows` (`userId`,`doenetId`,`attemptNumber`,`itemNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_assignment_attempt_item`
--

LOCK TABLES `user_assignment_attempt_item` WRITE;
/*!40000 ALTER TABLE `user_assignment_attempt_item` DISABLE KEYS */;
INSERT INTO `user_assignment_attempt_item` VALUES (1,'_Ga07DeeWjhH6Y4UpWlakE','cyuserId',1,1,1,NULL,1,0,NULL);
/*!40000 ALTER TABLE `user_assignment_attempt_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_device`
--

DROP TABLE IF EXISTS `user_device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_device`
--

LOCK TABLES `user_device` WRITE;
/*!40000 ALTER TABLE `user_device` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_device` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-04 14:54:43
