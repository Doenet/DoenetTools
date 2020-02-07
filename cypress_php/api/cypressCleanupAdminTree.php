<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

include 'db_connection.php';
// TODO in the future: check permission
// make sure you use dev DB when running this test !
$_POST = json_decode(file_get_contents('php://input'),true);
$sql="DELETE FROM course_heading WHERE courseid='aI8sK4vmEhC5sdeSP3vNW'";
$conn->query($sql);

$sql="INSERT INTO course_heading (courseHeadingId,headingText,parentId,childrenId,courseId) VALUES ('UltimateHeader','','','W0wTw4cG2klV1nS51BPSm','aI8sK4vmEhC5sdeSP3vNW'),
('UltimateHeader','','','3oSXu2L31eZBlZKKc4F7X','aI8sK4vmEhC5sdeSP3vNW'),
('UltimateHeader','','','kwpKwEwW144tqROdo9dl5','aI8sK4vmEhC5sdeSP3vNW'),
('3oSXu2L31eZBlZKKc4F7X','header3','UltimateHeader','iaROshxrgaz63vZ5xFdxE','aI8sK4vmEhC5sdeSP3vNW'),('qAgAnGbEblNmlebe3sJOh','header4','kwpKwEwW144tqROdo9dl5','mBUlzP63SK38l7XrWpyC','aI8sK4vmEhC5sdeSP3vNW'),
('5RdWCHX3Z-zHGi3-rupzq','header5','Sj7wQR-L2xFIxmS6QFMKn','fm3-3BxtVsMA0vqCyAOMA','aI8sK4vmEhC5sdeSP3vNW'),('W0wTw4cG2klV1nS51BPSm','header6','UltimateHeader','','aI8sK4vmEhC5sdeSP3vNW'),('kwpKwEwW144tqROdo9dl5','header1','UltimateHeader','qAgAnGbEblNmlebe3sJOh','aI8sK4vmEhC5sdeSP3vNW'),('kwpKwEwW144tqROdo9dl5','header1','UltimateHeader','Sj7wQR-L2xFIxmS6QFMKn','aI8sK4vmEhC5sdeSP3vNW'),('kwpKwEwW144tqROdo9dl5','header1','UltimateHeader','4P7WK6V4HvxS9fIT8IY4i','aI8sK4vmEhC5sdeSP3vNW'),('kwpKwEwW144tqROdo9dl5','header1','UltimateHeader','yfP_Pslr-WC1D8g2rEqhF','aI8sK4vmEhC5sdeSP3vNW'),
('Sj7wQR-L2xFIxmS6QFMKn','header2','kwpKwEwW144tqROdo9dl5','5RdWCHX3Z-zHGi3-rupzq','aI8sK4vmEhC5sdeSP3vNW'),
('Sj7wQR-L2xFIxmS6QFMKn','header2','kwpKwEwW144tqROdo9dl5','VffOCH1I0h_ymB9KQHR24','aI8sK4vmEhC5sdeSP3vNW'),
('Sj7wQR-L2xFIxmS6QFMKn','header2','kwpKwEwW144tqROdo9dl5','zxVi-pXiUtf3PodIXm45n','aI8sK4vmEhC5sdeSP3vNW')";
$conn->query($sql);

$sql = "DELETE FROM assignment WHERE courseId='aI8sK4vmEhC5sdeSP3vNW'";
$conn->query($sql);

$sql = "INSERT INTO `assignment` (`id`, `assignmentId`, `parentId`, `courseHeadingId`, `assignmentName`, `sourceBranchId`, `contentId`, `courseId`, `private`, `creationDate`, `assignedDate`, `dueDate`, `timeLimit`, `numberOfAttemptsAllowed`, `sortOrder`, `attemptAggregation`, `totalPointsOrPercent`, `gradeCategory`, `individualize`, `multipleAttempts`, `showSolution`, `showFeedback`, `showHints`, `showCorrectness`, `proctorMakesAvailable`, `examCoverHTML`)
VALUES
	(90, '4P7WK6V4HvxS9fIT8IY4i', 'kwpKwEwW144tqROdo9dl5', 'Sj7wQR-L2xFIxmS6QFMKn', 'Gateway exam practice', '9gBr0dW6tFqqA1UyLEBVD', '268edfaf6999ea0182e6ac360854c7d739e35eccbb6384dd193b301de845b707', 'aI8sK4vmEhC5sdeSP3vNW', 0, '2019-08-19 13:42:53', NULL, NULL, NULL, 3, 100, NULL, NULL, 'Gateway', 1, 1, 1, 1, 1, 1, 0, ''),
	(91, 'yfP_Pslr-WC1D8g2rEqhF', 'kwpKwEwW144tqROdo9dl5', 'Sj7wQR-L2xFIxmS6QFMKn', 'Gateway exam', '9gBr0dW6tFqqA1UyLEBVD', '268edfaf6999ea0182e6ac360854c7d739e35eccbb6384dd193b301de845b707', 'aI8sK4vmEhC5sdeSP3vNW', 0, '2019-08-19 13:42:56', '2019-09-05 11:45:00', '2019-10-11 10:30:00', '00:51:00', 3, 200, NULL, 100, 'Gateway', 1, 1, 0, 0, 0, 0, 1, '<p>The Math 1241 gateway exam is designed to verify that you have master based algebra skills and so are poised to succeed with Math 1241.  The exam is at a slightly higher level than the placement exam that was taken to qualify to take calculus, except without trigonometry. It emphasizes functions, variables, parameters, and inequalities.</p>\n\n<p>The main components of the gateway exam are:</p>\n<ol>\n   <li>Composition of functions</li>\n   <li>Exponentiation</li>\n   <li>Logarithms</li>\n   <li>Linear equations</lI>\n   <li>Quadratic equations and other simple polynomial equations</li>\n   <li>Inequalities</li>\n</ol>\n\n<p>You can practice the problems from the Gateway exam by taking the Gateway exam practice.</p>\n\n<h4>Exam logistics</h4>\n\n<p>The Gateway exam can be taken in Tate Hall B20 on the following Thursdays between 11:15AM and 2:15PM:</p>\n<ul class=\"no_skip\">\n   <li>September 5 (Please, plan to take the exam during the time that you are officially registered)</li>\n   <li>September 12</li>\n   <li>September 19</li>\n   <li>October 10</li>\n</ul>\n<p>Note: you must reach 60% by September 12 and 80% by October 10.</p>\n\n<p>Calculator policy: a scientific calculator is allowed, but no graphing calculator.<br/>\nNo notes, textbook, or other electronic equipment (such as phones) allowed.</p>'),
	(481, 'VffOCH1I0h_ymB9KQHR24', 'Sj7wQR-L2xFIxmS6QFMKn', 'heading_a_id', 'Assignment 3', 'a1branchid', 'a1contentid', 'aI8sK4vmEhC5sdeSP3vNW', 0, '2019-08-20 13:42:56', '2019-08-21 13:42:56', '2019-08-24 13:42:56', NULL, 3, 100, NULL, NULL, NULL, 0, 0, 1, 1, 1, 1, 0, NULL),
	(482, 'iaROshxrgaz63vZ5xFdxE', '3oSXu2L31eZBlZKKc4F7X', 'heading_a_id', 'Assignment 4', 'a2branchid', 'a2contentid', 'aI8sK4vmEhC5sdeSP3vNW', 0, '2019-08-19 13:42:56', '2019-08-22 13:42:56', '2019-08-23 13:42:56', NULL, 3, 200, NULL, NULL, NULL, 0, 0, 1, 1, 1, 1, 0, NULL),
	(483, 'zxVi-pXiUtf3PodIXm45n', 'Sj7wQR-L2xFIxmS6QFMKn', 'heading_a_id', 'Assignment 5', 'a3branchid', 'a3contentid', 'aI8sK4vmEhC5sdeSP3vNW', 0, '2019-08-18 13:42:56', '2019-08-23 13:42:56', '2019-08-22 13:42:56', NULL, 3, 300, NULL, NULL, NULL, 0, 0, 1, 1, 1, 1, 0, NULL),
	(485, 'fm3-3BxtVsMA0vqCyAOMA', '5RdWCHX3Z-zHGi3-rupzq', 'heading_b_id', 'Assignment B2', 'b2branchid', 'b2contentid', 'aI8sK4vmEhC5sdeSP3vNW', 0, '2019-08-26 13:42:56', '2019-08-28 13:42:56', '2019-08-30 13:42:56', NULL, 3, 200, NULL, NULL, NULL, 0, 0, 1, 1, 1, 1, 0, NULL),
	(484, 'mBUlzP63SK38l7XrWpyC', 'qAgAnGbEblNmlebe3sJOh', 'heading_b_id', 'Assignment 6', 'b3branchid', 'b3contentid', 'aI8sK4vmEhC5sdeSP3vNW', 0, '2019-08-25 13:42:56', '2019-08-27 13:42:56', '2019-08-29 13:42:56', NULL, 3, 100, NULL, NULL, NULL, 0, 0, 1, 1, 1, 1, 0, NULL);";
$conn->query($sql);
http_response_code(200);

 $conn->close();
?>