<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db_connection.php";
include "permissionsAndSettingsForOneCourseFunction.php";
include "cidFromSHA.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];

$success = true;
$message = "";

//required unless data is passed in application/x-www-form-urlencoded or multipart/form-data
$_POST = json_decode(file_get_contents("php://input"), true);

if (!array_key_exists("courseId", $_POST)) {
    $success = false;
    $message = "Missing courseId";
} elseif (!array_key_exists("doenetId", $_POST)) {
    $success = false;
    $message = "Missing doenetId";
} elseif (!array_key_exists("activityDoenetML", $_POST)) {
    $success = false;
    $message = "Missing activityDoenetML";
}

//Test Permission to edit content
if ($success) {
    $courseId = mysqli_real_escape_string($conn, $_POST["courseId"]);
    $doenetId = mysqli_real_escape_string($conn, $_POST["doenetId"]);
    $isAssigned = mysqli_real_escape_string($conn, $_POST["isAssigned"]);
    $dangerousActivityDoenetML = $_POST["activityDoenetML"];
    $permissions = permissionsAndSettingsForOneCourseFunction(
        $conn,
        $userId,
        $courseId
    );
    if ($permissions["canEditContent"] != "1") {
        $success = false;
        $message = "You need edit permission to add a page or order.";
    }
}

if ($success) {
    $SHA = hash("sha256", $dangerousActivityDoenetML);
    $cid = cidFromSHA($SHA);
    $fileName = $cid;
    ($newfile = fopen("../media/$fileName.doenet", "w")) or
        die("Unable to open file!");

    fwrite($newfile, $dangerousActivityDoenetML);
    fclose($newfile);

    if ($isAssigned) {
        $sql = "
        UPDATE course_content
        SET isAssigned='1',
        jsonDefinition=JSON_SET(jsonDefinition,'$.assignedCid','$cid')
        WHERE doenetId='$doenetId'
        AND courseId='$courseId'
        ";
        $result = $conn->query($sql);
        $sql = "
        INSERT INTO assignment
        (doenetId,courseId)
        VALUES
        ('$doenetId','$courseId')
        ";
        $result = $conn->query($sql);

        $sql = "SELECT assignedDate,
		dueDate,
		pinnedAfterDate,
		pinnedUntilDate,
		timeLimit,
		numberOfAttemptsAllowed,
		attemptAggregation,
		totalPointsOrPercent,
		gradeCategory,
		individualize,
		showSolution,
		showSolutionInGradebook,
		showFeedback,
		showHints,
		showCorrectness,
		showCreditAchievedMenu,
		paginate,
		proctorMakesAvailable
		FROM assignment
        WHERE doenetId='$doenetId'
		";

        $result = $conn->query($sql);

        $row = $result->fetch_assoc();

        $assignmentSettings = [
            "assignedDate" => $row["assignedDate"],
            "pinnedAfterDate" => $row["pinnedAfterDate"],
            "pinnedUntilDate" => $row["pinnedUntilDate"],
            "dueDate" => $row["dueDate"],
            "timeLimit" => $row["timeLimit"],
            "numberOfAttemptsAllowed" => $row["numberOfAttemptsAllowed"],
            "attemptAggregation" => $row["attemptAggregation"],
            "totalPointsOrPercent" => $row["totalPointsOrPercent"],
            "gradeCategory" => $row["gradeCategory"],
            "individualize" => $row["individualize"] == "1" ? true : false,
            "showSolution" => $row["showSolution"] == "1" ? true : false,
            "showSolutionInGradebook" =>
                $row["showSolutionInGradebook"] == "1" ? true : false,
            "showFeedback" => $row["showFeedback"] == "1" ? true : false,
            "showHints" => $row["showHints"] == "1" ? true : false,
            "showCorrectness" => $row["showCorrectness"] == "1" ? true : false,
            "showCreditAchievedMenu" =>
                $row["showCreditAchievedMenu"] == "1" ? true : false,
            "paginate" => $row["paginate"] == "1" ? true : false,
            "proctorMakesAvailable" =>
                $row["proctorMakesAvailable"] == "1" ? true : false,
        ];
    } else {
        $sql = "
        UPDATE course_content
        SET jsonDefinition=JSON_SET(jsonDefinition,'$.draftCid','$cid')
        WHERE doenetId='$doenetId'
        AND courseId='$courseId'
        ";
        $result = $conn->query($sql);
    }
}

$response_arr = [
    "success" => $success,
    "message" => $message,
    "cid" => $cid,
    "assignmentSettings" => $assignmentSettings,
];

// set response code - 200 OK
http_response_code(200);

// make it json format
echo json_encode($response_arr);
$conn->close();

?>
