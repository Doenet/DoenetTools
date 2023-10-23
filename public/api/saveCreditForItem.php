<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
include 'db_connection.php';
include 'baseModel.php';

date_default_timezone_set('UTC');
// America/Chicago

$jwtArray = include 'jwtArray.php';
$userId = $jwtArray['userId'];
$examUserId = array_key_exists('examineeUserId', $jwtArray)
    ? $jwtArray['examineeUserId']
    : '';
$examDoenetId = array_key_exists('doenetId', $jwtArray)
    ? $jwtArray['doenetId']
    : '';

$response_arr = [];
$credit_by_item = [];
try {
    $_POST = json_decode(file_get_contents('php://input'), true);

    //validate input
    Base_Model::checkForRequiredInputs(
        $_POST,
        [
            'activityId',
            'attemptNumber',
            'credit',
            'itemNumber',
        ]
    );

    //exam security
    if ($userId == '') {
        if ($examUserId == '') {
            http_response_code(401);
            throw new Exception('No access - Need to sign in');
        } elseif ($examDoenetId != $doenetId) {
            http_response_code(403);
            throw new Exception("No access for doenetId: $doenetId");
        } else {
            $userId = $examUserId;
        }
    }

    //sanitize input
    $doenetId = mysqli_real_escape_string($conn, $_POST['activityId']);
    $attemptNumber = mysqli_real_escape_string($conn, $_POST['attemptNumber']);
    $credit = mysqli_real_escape_string($conn, $_POST['credit']);
    $itemNumber = mysqli_real_escape_string($conn, $_POST['itemNumber']);

    //TODO: check if attempt is older than given attempt

    /* Begin data lookup */
    //**Find assessment settings
    $sql =
        "SELECT attemptAggregation,
        timeLimit,
        numberOfAttemptsAllowed,
        dueDate,
        totalPointsOrPercent
        FROM assignment
        WHERE doenetId='$doenetId'";

    $row = Base_Model::queryExpectingOneRow($conn, $sql);
    $attemptAggregation = $row['attemptAggregation'];
    $timeLimit = $row['timeLimit'];
    $numberOfAttemptsAllowed = $row['numberOfAttemptsAllowed'];
    $dueDate = $row['dueDate'];
    $totalPointsOrPercent = $row['totalPointsOrPercent'];

    // Get time began and creditOverride from user_assignment_attempt
    $sql =
        "SELECT 
        CONVERT_TZ(NOW(), @@session.time_zone, '+00:00') AS now,
        began, 
        creditOverride, 
        credit
        FROM user_assignment_attempt
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'";

    $row = Base_Model::queryExpectingOneRow($conn, $sql);

    $now_seconds = strtotime($row['now']);
    $began_seconds = strtotime($row['began']);
    $creditOverride_for_attempt = $row['creditOverride'];
    $previousCredit_for_attempt = $row['credit'];

    // look up the stored credit for each item of attempt
    $sql =
        "SELECT credit
        FROM user_assignment_attempt_item
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        ORDER BY itemNumber
        ";
    $result = Base_Model::runQuery($conn, $sql);

    while ($row = $result->fetch_assoc()) {
        $credit_by_item[] = $row['credit'];
    }

    // look for a overrides in due date, credit, or number of attempts allowed for asssignment,
    // which includes check for user_assignment having an entry
    $sql = "SELECT 
        CONVERT_TZ(NOW(), @@session.time_zone, '+00:00') AS now,
        dueDateOverride, 
        creditOverride, 
        numberOfAttemptsAllowedAdjustment,
        credit
        FROM user_assignment
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        ";

    $result = Base_Model::queryExpectingOneRow($conn, $sql);
    $row = $result->fetch_assoc();
    $dueDateOverride = $row['dueDateOverride'];
    $creditOverride_for_assignment = $row['creditOverride'];
    $previousCredit_for_assignment = $row['credit'];
    $numberOfAttemptsAllowedAdjustment =
        $row['numberOfAttemptsAllowedAdjustment'];

    //look for current credit or credit override, as well as viewed solution state
    $sql = "SELECT credit, creditOverride, viewedSolution
        FROM user_assignment_attempt_item
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        AND itemNumber = '$itemNumber'
        ";
    $row = Base_Model::queryExpectingOneRow($conn, $sql);

    $previousCredit = $row['credit'];
    $creditOverride_for_item = $row['creditOverride'];
    $viewedSolution = $row['viewedSolution'] == '1';
    /* End data lookup */

    /* start invalidating guards */

    //is solution is viewd, no credit can be awarded
    if ($viewedSolution) {
        http_response_code(412);
        throw new Exception("No credit awarded since the solution has been viewed.");
    }

    // If there is a due date override for this user
    // use that for the due date
    if ($dueDateOverride) {
        $dueDate = $dueDateOverride;
    }

    //If null then it's never past due
    if ($dueDate) {
        $dueDate_seconds = strtotime($dueDate);
        $now_seconds = strtotime($row['now']);
        $dueDate_diff = $now_seconds - $dueDate_seconds;
        // give one minute buffer on due date
        if ($dueDate_seconds < $now_seconds) {
            http_response_code(412);
            throw new Exception("No credit awarded since the due date has passed.");
        }
    }

    //$numberOfAttemptsAllowed is '' when unlimited
    if ($numberOfAttemptsAllowed != '') {
        if ($numberOfAttemptsAllowedAdjustment) {
            $numberOfAttemptsAllowed = $numberOfAttemptsAllowed + $numberOfAttemptsAllowedAdjustment;
        }
        if ($attemptNumber > $numberOfAttemptsAllowed) {
            http_response_code(412);
            throw new Exception("No credit awarded since the number of attempts allowed has been exceeded.");
        }
    }

    // if there is a time limit,
    // multiply by factor for user
    if ($timeLimit > 0) {
        // have to use course_content
        // to get courseId from doenetID
        $sql = "SELECT timeLimitMultiplier 
            FROM course_user cu
            INNER JOIN course_content cc
                ON cc.courseId = cu.courseId
            WHERE cc.doenetId = '$doenetId'
            AND cu.userId = '$userId'
            ";

        $row = Base_Model::queryExpectingOneRow($conn, $sql);
        $timeLimit = ceil($timeLimit * $row['timeLimitMultiplier']);

        // give a buffer of one minute
        $effectiveTimeLimit = $timeLimit + 1;

        // if began more than timeLimit ago, we're past time

        $effective_timelimit_seconds = $effectiveTimeLimit * 60;
        $diff_seconds =
            $now_seconds - ($began_seconds + $effective_timelimit_seconds);
        if ($began_seconds + $effective_timelimit_seconds < $now_seconds) {
            http_response_code(412);
            throw new Exception("No credit awarded since the time allowed has expired.");
        }
    }

    /* end invalidating guards */

    // we update credit in
    //   - user_assignment
    //   - user_assignment_attempt, and
    //   - user_assignment_attempt_item
    // only if valid


    // if have a credit override on that item
    // then there is nothing to do,
    // as the score for the item must stay unchanged,
    // which means the resulting score for attempt and assignment
    // also cannot change
    if ($creditOverride_for_item == null) {
        if ($attemptAggregation == 'm') {
            // Find previous credit if maximizing scores
            // Update credit in the database if it's larger
            $credit_for_item = MAX($previousCredit, $credit);
        } elseif ($attemptAggregation == 'l') {
            $credit_for_item = $credit;
        }

        // Store credit in user_assignment_attempt_item
        $sql = "UPDATE user_assignment_attempt_item
            SET credit='$credit_for_item'
            WHERE userId = '$userId'
            AND doenetId = '$doenetId'
            AND attemptNumber = '$attemptNumber'
            AND itemNumber = '$itemNumber'
            ";
        $result = Base_Model::runQuery($conn, $sql);

        // if have a credit override on the attempt
        // then we don't need to recalculate credit on the attempt or the assignment

        if ($creditOverride_for_attempt == null) {
            // **update user_assignment_attempt for the content

            // Get the attempt's defined weights and credits
            $sql = "SELECT credit,itemNumber,weight
                FROM user_assignment_attempt_item
                WHERE userId = '$userId'
                AND doenetId = '$doenetId'
                AND attemptNumber = '$attemptNumber'
                ORDER BY itemNumber
                ";
            $result = Base_Model::runQuery($conn, $sql);
            $total_credits = 0;
            $total_weights = 0;

            $credit_by_item = [];
            while ($row = $result->fetch_assoc()) {
                $loopItemNumber = $row['itemNumber'];
                $item_weight = $row['weight'];
                $total_weights = $total_weights + $item_weight;
                //Not guaranteed for credit to be stored due to async communication with db
                //So use value given here to be careful
                if ($loopItemNumber == $itemNumber) {
                    $item_credit = $credit_for_item;
                } else {
                    $item_credit = $row['credit'];
                }

                $total_credits =
                    $total_credits + $item_credit * $item_weight;

                $credit_by_item[] = $item_credit;
            }
            $credit_for_attempt = 0;
            if ($total_weights > 0) {
                //Prevent divide by zero
                $credit_for_attempt = $total_credits / $total_weights;
            }

            // Store credit in user_assignment_attempt
            $sql = "UPDATE user_assignment_attempt
                SET credit='$credit_for_attempt'
                WHERE userId = '$userId'
                AND doenetId = '$doenetId'
                AND attemptNumber = '$attemptNumber'
                ";
            $result = Base_Model::runQuery($conn, $sql);

            // if have credit override on assignment, don't update assignment credit
            if ($creditOverride_for_assignment == null) {
                //Find maximum credit over all attempts
                $sql = "SELECT MAX(credit) AS maxCredit
                    FROM user_assignment_attempt
                    WHERE userId = '$userId'
                    AND doenetId = '$doenetId'
                    ";

                $result = Base_Model::runQuery($conn, $sql);
                $row = $result->fetch_assoc();

                $credit_for_assignment = MAX(
                    $credit_for_attempt,
                    $row['maxCredit']
                );

                // update credit in user_assigment
                $sql = "UPDATE user_assignment
                    SET credit='$credit_for_assignment'
                    WHERE userId = '$userId'
                    AND doenetId = '$doenetId'
                    ";
                $result = Base_Model::runQuery($conn, $sql);
            } else {
                // have non-NULL override of credit for assignment
                $credit_for_assignment = $creditOverride_for_assignment;
            }
        } else {
            // have non-NULL override of credit for attempt
            $credit_for_attempt = $creditOverride_for_attempt;
            $credit_for_assignment = $previousCredit_for_assignment;
        }
    } else {
        // have non-NULL override of credit for item
        $credit_for_item = $creditOverride_for_item;
        $credit_for_attempt = $previousCredit_for_attempt;
        $credit_for_assignment = $previousCredit_for_assignment;
    }

    $response_arr = [
        'success' => true,
        'message' => "Credit for item $itemNumber saved",
        'access' => true,
        'valid' => $valid,
        'creditByItem' => $credit_by_item,
        'creditForItem' => $credit_for_item,
        'creditForAttempt' => $credit_for_attempt,
        'creditForAssignment' => $credit_for_assignment,
        'began_seconds' => $began_seconds,
        'effective_timelimit_seconds' => $effective_timelimit_seconds,
        'now_seconds' => $now_seconds,
        'diff_seconds' => $diff_seconds,
        'dueDate_diff' => $dueDate_diff,
        'totalPointsOrPercent' => $totalPointsOrPercent,
    ];
} catch (Exception $e) {
    $response_arr['success'] = false;
    $response_arr['message'] = $e->getMessage();
    $response_arr = [
        'success' => false,
        'message' => $e->getMessage(),
        'creditByItem' => $credit_by_item,
        'creditForItem' => $previousCredit ?? 0,
        'creditForAttempt' => $previousCredit_for_attempt ?? 0,
        'creditForAssignment' => $previousCredit_for_assignment ?? 0,
    ];

    if (http_response_code() == 200) {
        http_response_code(500);
    }
} finally {
    $response_arr['creditByItem'] = $credit_by_item;

    // set response code - 200 OK
    http_response_code(200);

    echo json_encode($response_arr);
    $conn->close();
}
