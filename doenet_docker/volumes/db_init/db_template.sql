# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.29)
# Database: doenet_local
# Generation Time: 2021-08-26 18:16:17 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table user_assignment_attempt_item_submission
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_assignment_attempt_item_submission`;

CREATE TABLE `user_assignment_attempt_item_submission` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `doenetId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contentId` char(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `userId` char(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `attemptNumber` int(11) DEFAULT NULL,
  `itemNumber` int(11) DEFAULT NULL,
  `submissionNumber` int(11) DEFAULT NULL,
  `stateVariables` mediumtext COLLATE utf8_unicode_ci COMMENT 'JSON used to persist state of user''s experience',
  `credit` float DEFAULT NULL,
  `submittedDate` datetime NOT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Past the due date. When the assesment wasn''t open.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique rows` (`doenetId`,`attemptNumber`,`itemNumber`,`submissionNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
