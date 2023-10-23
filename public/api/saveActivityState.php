<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db_connection.php";
include "baseModel.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray["userId"];
$examUserId = $jwtArray["examineeUserId"];
$examDoenetId = $jwtArray["doenetId"];

$device = $jwtArray["deviceName"];

$response_arr = [];
try {
    $_POST = json_decode(file_get_contents("php://input"), true);

    //validate input
    Base_Model::checkForRequiredInputs(
        $_POST,
        [
            "activityId",
            "cid",
            "attemptNumber",
            "variantIndex",
            "activityInfo",
            "activityState",
            "saveId",
            // "serverSaveId", 
            "updateDataOnContentChange"
        ]
    );

    //sanitize input
    $doenetId = mysqli_real_escape_string($conn, $_POST["activityId"]);
    $cid = mysqli_real_escape_string($conn, $_POST["cid"]);
    $attemptNumber = mysqli_real_escape_string($conn, $_POST["attemptNumber"]);
    $variantIndex = mysqli_real_escape_string($conn, $_POST["variantIndex"]);
    $activityInfo = mysqli_real_escape_string($conn, $_POST["activityInfo"]);
    $activityState = mysqli_real_escape_string($conn, $_POST["activityState"]);
    $saveId = mysqli_real_escape_string($conn, $_POST["saveId"]);
    $serverSaveId = mysqli_real_escape_string($conn, $_POST["serverSaveId"]);
    $updateDataOnContentChange = mysqli_real_escape_string(
        $conn,
        $_POST["updateDataOnContentChange"]
    );

    //exam security
    if ($userId == "") {
        if ($examUserId == "") {
            throw new Exception("No access - Need to sign in");
            http_response_code(401);
        } elseif ($examDoenetId != $doenetId) {
            throw new Exception("No access for doenetId: $doenetId");
            http_response_code(403);
        } else {
            $userId = $examUserId;
        }
    }

    $stateOverwritten = false;
    $savedState = false;
    $cidChanged = false;

    // check if cid of assignment has changed,
    // if so, include {cidChanged: true} in response
    // in order to alert the user

    $sql =
        "SELECT JSONdefinition->>'$.assignedCid' as assignedCid
        FROM course_content
        WHERE doenetId = '$doenetId'";

    //TODO: could be a queryExpectingOneRow?
    $result = Base_Model::runQuery($conn, $sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $newCid = $row["assignedCid"];

        if ($newCid != $cid) {
            $cidChanged = true;
        }
    } elseif ($updateDataOnContentChange != "1") {
        // something strange happened
        throw new Exception("Database error 1");
        http_response_code(500);
    }

    if ($serverSaveId != "") {
        $sql = "UPDATE activity_state SET
        activityState = '$activityState',
        saveId = '$saveId',
        deviceName = '$device'
        WHERE userId='$userId'
        AND doenetId='$doenetId'
        AND attemptNumber='$attemptNumber'
        AND cid = '$cid'
        AND saveId = '$serverSaveId'
        ";

        //TODO: verify that this works for the following if statement
        Base_Model::runQuery($conn, $sql);

        if ($conn->affected_rows > 0) {
            $savedState = true;
        }
    }

    if (!$savedState) {
        // no rows were updated
        // so either there is no activity_state saved
        // or the saveId was changed by another device

        // as long as we aren't updating data on content change
        // first check if there is a new attempt number
        // (as could be no row at the current attempt number even if we passed it a new attempt number)
        if ($updateDataOnContentChange != "1") {
            // get new attempt number from user_assignment_attempt
            // since that gets updated as soon as a new attempt is created

            $sql =
                "SELECT MAX(attemptNumber) as maxAttemptNumber
                FROM user_assignment_attempt 
                WHERE userId = '$userId' 
                AND doenetId = '$doenetId'";

            $result = Base_Model::runQuery($conn, $sql);
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $newAttemptNumber = $row["maxAttemptNumber"];
            } else {
                // something strange happened
                throw new Exception("Database error 2");
                http_response_code(500);
            }

            if ($newAttemptNumber !== $attemptNumber) {
                $stateOverwritten = true;

                // Note: don't need any more information if attempt number changes
                // as will reset activity
            }
        }

        if (!$stateOverwritten) {
            // attempt to insert a rows in activity_state

            $sql =
                "INSERT INTO activity_state
                (userId,doenetId,cid,attemptNumber,deviceName,saveId,variantIndex,activityInfo,activityState)
                VALUES ('$userId','$doenetId','$cid','$attemptNumber','$device','$saveId','$variantIndex','$activityInfo','$activityState')";

            //TODO: verify that this works for the following if statement
            Base_Model::runQuery($conn, $sql);

            if ($conn->affected_rows < 1) {
                // no rows were inserted
                // so the saveId was changed by another device

                $modifiedDBRecord = false;

                if ($updateDataOnContentChange == "1") {
                    // if the cid changed,
                    // then update the table rather than getting information from the table

                    $sql =
                        "SELECT cid
                        FROM activity_state
                        WHERE userId='$userId'
                        AND doenetId='$doenetId'
                        AND attemptNumber = '$attemptNumber'";

                    $result = Base_Model::runQuery($conn, $sql);

                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();
                        if ($row["cid"] != $cid) {
                            // update the matching row in activity_state
                            // to match current cid and state
                            $sql =
                                "UPDATE activity_state SET
                                cid = '$cid',
                                variantIndex = '$variantIndex',
                                activityInfo = '$activityInfo',
                                activityState = '$activityState',
                                saveId = '$saveId',
                                deviceName = '$device'
                                WHERE userId='$userId'
                                AND doenetId='$doenetId'
                                AND attemptNumber='$attemptNumber'";

                            //TODO: verify that this works for the following if statement
                            Base_Model::runQuery($conn, $sql);

                            $modifiedDBRecord = true;

                            if (!($conn->affected_rows > 0)) {
                                // something went wrong
                                throw new Exception("Database error 3");
                                http_response_code(500);
                            }
                        }
                    }
                }

                if (!$modifiedDBRecord) {
                    // need additional information since keeping same attempt number

                    $stateOverwritten = true;
                    $newAttemptNumber = $attemptNumber;

                    $sql =
                        "SELECT cid, attemptNumber, saveId, deviceName, variantIndex, activityInfo, activityState
                        FROM activity_state
                        WHERE userId = '$userId'
                        AND doenetId = '$doenetId'
                        AND attemptNumber = '$attemptNumber'";

                    $result = Base_Model::runQuery($conn, $sql);

                    if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();

                        $newCid = $row["cid"];
                        $saveId = $row["saveId"];
                        $newDevice = $row["deviceName"];
                        $newVariantIndex = $row["variantIndex"];
                        $newActivityInfo = $row["activityInfo"];
                        $newActivityState = $row["activityState"];
                    } else {
                        // something strange happened (another process changed the database in between queries?)
                        throw new Exception("Database error 4");
                        http_response_code(500);
                    }
                }
            }
        }
    }

    //build response array
    $response_arr = [
        "success" => true,
        "saveId" => $saveId,
        "stateOverwritten" => $stateOverwritten,
        "cid" => $newCid,
        "attemptNumber" => $newAttemptNumber,
        "variantIndex" => $newVariantIndex,
        "activityInfo" => $newActivityInfo,
        "activityState" => $newActivityState,
        "device" => $newDevice,
        "message" => "Activity state saved",
        "cidChanged" => $cidChanged,
    ];

    //set response code - 200 OK
    http_response_code(200);
} catch (Exception $e) {
    $response_arr = [
        "success" => false,
        "message" => $e->getMessage(),
    ];
    //TODO: review http response code pattern for Doenet
    if (http_response_code() == 200) {
        http_response_code(500);
    }
} finally {
    // make it json format and echo it out
    echo json_encode($response_arr);
    //close database connection
    $conn->close();
}
