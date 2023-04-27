<?php

class Base_Model {

    /**
     * Execute a SQL query, returning the results as an array of associative arrays.  
     * 
     * If query returns no results, return empty array. 
     * 
     * If the query has an error, logs the specific error, a uniquely generated error ID,
     * and the query that failed. In this case it also throws an expection
     * safe to show to users reporting a generic interal error, with the unique error id.
     */
    public static function queryFetchAssoc($conn, $query) {
        $result = $conn->query($query);
        if (!$result) {
            $errorId = uniqid();
            error_log("Error occurred " . $errorId  .
                      "\n " . $conn->error .
                      "\n" . $query);
            throw new Exception(
                "Unexpected internal error occurred, please provide this error id to the doenet team " . $errorId);
        } else {
            if ($result->num_rows > 0) {
                $rows = [];
                while($row = $result->fetch_assoc()){ 
                    $rows[] = $row;
                }
                return $rows;
            } else {
                return [];
            }
        }
    }

    /**
     * Runs a SQL query, returning a single row result as an associative array.
     * 
     * If no rows are returned by the query, returns null.
     * 
     * If more than one row is returned, throws an exception.
     */
    public static function queryExpectingOneRow($conn, $query) {
        $rows = Base_Model::queryFetchAssoc($conn, $query);

        if (count($rows) == 1) {
            return $rows[0];
        } else if (count($rows) == 0) {
            return null;
        } else {
            throw new Exception("Unexpected error, only expected one row from this query.");
        }
    }

    /**
     * Validate that a list of keys are present in a given associative array.
     * 
     * Can be used to validate any of the standard PHP input arrays like
     * $_POST, $_GET, $_REQUEST, $_COOKIE.
     * 
     * Inputs:
     * $inputArray     Assumed to be input from a user to be validated, needs
     *                 to be an associatve array
     * $requiredKeys   A list of keys that are required to be present. 
     */
    public static function checkForRequiredInputs($inputArray, $requiredKeys) {
        foreach($requiredKeys as $key) {
            if (!array_key_exists($key, $inputArray)) {
                throw new Exception("Missing required field '$key'.");
            }
        }
    }
}
?>
