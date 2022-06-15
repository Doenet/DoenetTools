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

DROP TABLE IF EXISTS `activity_state`;

DROP TABLE IF EXISTS `assignment`;

DROP TABLE IF EXISTS `class_times`;

DROP TABLE IF EXISTS `collection`;

DROP TABLE IF EXISTS `collection_groups`;

DROP TABLE IF EXISTS `content`;

DROP TABLE IF EXISTS `content_interactions`;

DROP TABLE IF EXISTS `course`;

DROP TABLE IF EXISTS `course_content`;

DROP TABLE IF EXISTS `course_grade_category`;

DROP TABLE IF EXISTS `course_user`;

DROP TABLE IF EXISTS `drive`;

DROP TABLE IF EXISTS `drive_content`;

DROP TABLE IF EXISTS `drive_user`;

DROP TABLE IF EXISTS `enrollment`;

DROP TABLE IF EXISTS `event`;

DROP TABLE IF EXISTS `experiment`;

DROP TABLE IF EXISTS `initial_renderer_state`;

DROP TABLE IF EXISTS `ipfs_to_upload`;

DROP TABLE IF EXISTS `page_state`;

DROP TABLE IF EXISTS `pages`;

DROP TABLE IF EXISTS `support_files`;

DROP TABLE IF EXISTS `user`;

DROP TABLE IF EXISTS `user_assignment`;

DROP TABLE IF EXISTS `user_assignment_attempt`;

DROP TABLE IF EXISTS `user_assignment_attempt_item`;

DROP TABLE IF EXISTS `user_assignment_attempt_item_submission`;

DROP TABLE IF EXISTS `user_device`;
