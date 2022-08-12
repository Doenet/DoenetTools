<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
include 'db_connection.php';

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

$_POST = json_decode(file_get_contents('php://input'), true);
$doenetId = mysqli_real_escape_string($conn, $_POST['doenetId']);
$attemptNumber = mysqli_real_escape_string($conn, $_POST['attemptNumber']);
$credit = mysqli_real_escape_string($conn, $_POST['credit']);
$itemNumber = mysqli_real_escape_string($conn, $_POST['itemNumber']);
$componentsSubmitted = mysqli_real_escape_string(
    $conn,
    $_POST['componentsSubmitted']
);

//TODO: check if attempt is older than given attempt

$success = true;
$message = '';

if ($doenetId == '') {
    $success = false;
    $message = 'Internal Error: missing doenetId';
} elseif ($attemptNumber == '') {
    $success = false;
    $message = 'Internal Error: missing attemptNumber';
} elseif ($credit == '') {
    $success = false;
    $message = 'Internal Error: missing credit';
} elseif ($itemNumber == '') {
    $success = false;
    $message = 'Internal Error: missing itemNumber';
} elseif ($componentsSubmitted == '') {
    $success = false;
    $message = 'Internal Error: missing componentsSubmitted';
} elseif ($userId == '') {
    if ($examUserId == '') {
        $success = false;
        $message = 'No access - Need to sign in';
    } elseif ($examDoenetId != $doenetId) {
        $success = false;
        $message = "No access for doenetId: $doenetId";
    } else {
        $userId = $examUserId;
    }
}

if ($success) {
    //**Find assessment settings
    $sql = "SELECT attemptAggregation,
        timeLimit,
        numberOfAttemptsAllowed,
        dueDate,
        totalPointsOrPercent
        FROM assignment
        WHERE doenetId='$doenetId'";

    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $attemptAggregation = $row['attemptAggregation'];
    $timeLimit = $row['timeLimit'];
    $numberOfAttemptsAllowed = $row['numberOfAttemptsAllowed'];
    $dueDate = $row['dueDate'];
    $totalPointsOrPercent = $row['totalPointsOrPercent'];

    $valid = 1;

    $timeExpired = false;
    $databaseError = false;
    $pastDueDate = false;
    $exceededAttemptsAllowed = false;
    $viewedSolution = false;

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

        $result = $conn->query($sql);

        if ($result->num_rows < 1) {
            //TODO: handle Owners and Admins not being enrolled.
            // $databaseError = 1;
            // $valid = 0;
        } else {
            $row = $result->fetch_assoc();
            $timeLimit = ceil($timeLimit * $row['timeLimitMultiplier']);
        }
    }

    // Get time began and creditOverride from user_assignment_attempt
    $sql = "SELECT 
        CONVERT_TZ(NOW(), @@session.time_zone, '+00:00') AS now,
        began, 
        creditOverride, 
        credit
        FROM user_assignment_attempt
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        ";
    $result = $conn->query($sql);

    if ($result->num_rows < 1) {
        $databaseError = 2;
        $valid = 0;
    } else {
        $row = $result->fetch_assoc();
        $creditOverride_for_attempt = $row['creditOverride'];
        $previousCredit_for_attempt = $row['credit'];

        if ($timeLimit > 0) {
            // give a buffer of one minute
            $effectiveTimeLimit = $timeLimit + 1;

            // if began more than timeLimit ago, we're past time
            $began_seconds = strtotime($row['began']);
            $now_seconds = strtotime($row['now']);
            $effective_timelimit_seconds = $effectiveTimeLimit * 60;
            $diff_seconds =
                $now_seconds - ($began_seconds + $effective_timelimit_seconds);
            if ($began_seconds + $effective_timelimit_seconds < $now_seconds) {
                $timeExpired = true;
                $valid = 0;
            }
        }
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

    $result = $conn->query($sql);
    if ($result->num_rows < 1) {
        $databaseError = 3;
        $valid = 0;
    } else {
        $row = $result->fetch_assoc();
        $dueDateOverride = $row['dueDateOverride'];
        $creditOverride_for_assignment = $row['creditOverride'];
        $previousCredit_for_assignment = $row['credit'];
        $numberOfAttemptsAllowedAdjustment =
            $row['numberOfAttemptsAllowedAdjustment'];

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
                $pastDueDate = true;
                $valid = 0;
            }
        }

        //$numberOfAttemptsAllowed is '' when unlimited
        if ($numberOfAttemptsAllowed != '') {
            if($numberOfAttemptsAllowedAdjustment) {
                $numberOfAttemptsAllowed = $numberOfAttemptsAllowed + $numberOfAttemptsAllowedAdjustment;
            }
            if ($attemptNumber > $numberOfAttemptsAllowed) {
                $exceededAttemptsAllowed = true;
                $valid = 0;
            }
        }
    }

    $sql = "SELECT credit, creditOverride, viewedSolution
        FROM user_assignment_attempt_item
        WHERE userId = '$userId'
        AND doenetId = '$doenetId'
        AND attemptNumber = '$attemptNumber'
        AND itemNumber = '$itemNumber'
        ";
    $result = $conn->query($sql);

    if ($result->num_rows < 1) {
        $databaseError = 4;
        $valid = 0;
    } else {
        $row = $result->fetch_assoc();

        $previousCredit = $row['credit'];
        $creditOverride_for_item = $row['creditOverride'];
        $viewedSolution = $row['viewedSolution'] == '1';
        if ($viewedSolution) {
            $valid = 0;
        }
    }

    // we update credit in
    //   - user_assignment
    //   - user_assignment_attempt, and
    //   - user_assignment_attempt_item
    // only if valid

    $set_credit_by_item = false;
    $credit_by_item = [];

    if ($valid) {
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
            $result = $conn->query($sql);

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
                $result = $conn->query($sql);
                $total_credits = 0;
                $total_weights = 0;

                $set_credit_by_item = true;

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
                $result = $conn->query($sql);

                // if have credit override on assignment, don't update assignment credit
                if ($creditOverride_for_assignment == null) {
                    //Find maximum credit over all attempts
                    $sql = "SELECT MAX(credit) AS maxCredit
                        FROM user_assignment_attempt
                        WHERE userId = '$userId'
                        AND doenetId = '$doenetId'
                        ";

                    $result = $conn->query($sql);
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
                    $result = $conn->query($sql);
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
    } else {
        // have invalid attempt

        if ($databaseError) {
            $credit_for_item = 0;
            $credit_for_attempt = 0;
            $credit_for_assignment = 0;
        } else {
            $credit_for_item = $previousCredit;
            $credit_for_attempt = $previousCredit_for_attempt;
            $credit_for_assignment = $previousCredit_for_assignment;
        }
    }

    if (!$set_credit_by_item && !$databaseError) {
        // look up the stored credit for each item of attempt
        $sql = "SELECT credit
            FROM user_assignment_attempt_item
            WHERE userId = '$userId'
            AND doenetId = '$doenetId'
            AND attemptNumber = '$attemptNumber'
            ORDER BY itemNumber
            ";
        $result = $conn->query($sql);

        while ($row = $result->fetch_assoc()) {
            $credit_by_item[] = $row['credit'];
        }
    }
}

$response_arr = [
    'success' => $success,
    'message' => $message,
    'access' => true,
    'viewedSolution' => $viewedSolution,
    'timeExpired' => $timeExpired,
    'pastDueDate' => $pastDueDate,
    'exceededAttemptsAllowed' => $exceededAttemptsAllowed,
    'databaseError' => $databaseError,
    'valid' => $valid,
    'creditForItem' => $credit_for_item,
    'creditForAttempt' => $credit_for_attempt,
    'creditForAssignment' => $credit_for_assignment,
    'creditByItem' => $credit_by_item,
    'began_seconds' => $began_seconds,
    'effective_timelimit_seconds' => $effective_timelimit_seconds,
    'now_seconds' => $now_seconds,
    'diff_seconds' => $diff_seconds,
    'dueDate_diff' => $dueDate_diff,
    'totalPointsOrPercent' => $totalPointsOrPercent,
];

// set response code - 200 OK
http_response_code(200);

echo json_encode($response_arr);

$conn->close();
?>
