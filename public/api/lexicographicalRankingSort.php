<?php
namespace SortOrder {
    define('SortOrder\LOWER_BOUND_ALPHACODE', 96); // before 'a'
    define('SortOrder\UPPER_BOUND_ALPHACODE', 123); // after 'z'
    define('SortOrder\CHAR_A_ALPHACODE', 97); // char code for 'a'
    define('SortOrder\CHAR_B_ALPHACODE', 98); // char code for 'b'
    define('SortOrder\CHAR_Z_ALPHACODE', 122); // char code for 'z'

    /**
     *
     */
    function getSortOrder($prev, $next)
    {
        $p = $n = $pos = 0;
        $newOrder = '';
        while ($p == $n) {
            $p =
                $pos < strlen($prev)
                    ? ord(substr($prev, $pos, 1))
                    : LOWER_BOUND_ALPHACODE;
            $n =
                $pos < strlen($next)
                    ? ord(substr($next, $pos, 1))
                    : UPPER_BOUND_ALPHACODE;
            $pos++;
        }
        $newOrder = substr($prev, 0, $pos - 1); // get identical substring

        if ($p == LOWER_BOUND_ALPHACODE) {
            // prev string equals next[0:pos]
            while ($n == CHAR_A_ALPHACODE) {
                // next character is 'a'
                $n =
                    $pos < strlen($next)
                        ? ord(substr($next, $pos++, 1))
                        : UPPER_BOUND_ALPHACODE;
                $newOrder .= 'a'; // insert an 'a' to match the 'a'
            }
            if ($n == CHAR_B_ALPHACODE) {
                // next character is 'b'
                $newOrder .= 'a'; // insert an 'a' to match the 'b'
                $n = UPPER_BOUND_ALPHACODE;
            }
        } elseif ($p + 1 == $n) {
            // prev, next are consecutive
            $newOrder .= chr($p); // insert character from prev
            $n = UPPER_BOUND_ALPHACODE; // set to end of alphabet
            $p =
                $pos < strlen($prev)
                    ? ord(substr($prev, $pos++, 1))
                    : LOWER_BOUND_ALPHACODE;
            while ($p == CHAR_Z_ALPHACODE) {
                $p =
                    $pos < strlen($prev)
                        ? ord(substr($prev, $pos++, 1))
                        : LOWER_BOUND_ALPHACODE;
                $newOrder .= 'z'; // insert 'z' to match 'z'
            }
        }
        $middleCharater = chr(ceil($n - ($n - $p) / 2));
        $newOrder .= $middleCharater;

        return $newOrder;
    }

    function lettersToANumber($sequence){
        $valueOfA = 97;
        $num = 0;
        for ($i = 0; $i < strlen($sequence); $i++){
          $letter = substr($sequence, strlen($sequence) - $i - 1, 1);
          $letterNum = ord($letter) - $valueOfA + 1;
          $positionmultiplier = pow(26, $i);
          $valueOfLetterAtThePossition = $letterNum * $positionmultiplier;
          $num = $num + $valueOfLetterAtThePossition;
        }
        return $num;
      }
  
      function numberToLetters($num,$numOfLetters){
        $valueOfA = 97;
        $letters = "";
        $remainingNum = $num;
        for ($i = $numOfLetters; $i >= 0; $i--){
          $divisor = pow(26, $i);
          $quotient = (int) ($remainingNum / $divisor);
          if ($quotient > 0){
            $char = chr($quotient + $valueOfA - 1);
            $letters = $letters . $char;
            $remainingNum = $remainingNum - $quotient * $divisor;
          }
        }
        return $letters;
      }
  
     //This is incomplete!
     //After 'aay' it goes to 'ab'
      function getNextSortOrder($str){
        $str_as_num = lettersToANumber($str);
        return numberToLetters($str_as_num + 1,strlen($str));
      }


    /**
     * Moves a record in a sorted list, managed with a sortOrder column mananged
     * with our lexographical sorting key generator.
     * 
     * Parameters:
     * conn - database connection
     * table - table name for sorted records
     * direction - the direction to move the specified record,
     *             accepted values 'up', 'down', 'left', 'right'
     *             up and left are synonyms, as are right and down, to accomodate
     *             different ways a UI may display the 1 dimensional sort
     * groupFilter - a sql condition to find all records in the table that belong to this
     *               given group, can be left blank if the table is sorted globally
     * itemFilter - a sql condition to find the specific record to be moved
     * 
     * Return, associative array suitable for use as request response body
     * [ success => true, message => 'optional message with a notice to the user]
     * 
     * Does not condier a request to move past the end of the list as invalid,
     * this will report success with a message that could be displayed to a user.
     */
    function moveItemInSortedList($conn, $table, $direction, $groupFilter, $itemFilter) {
        $positionalFunction = "";
        if ($direction == "left" || $direction == "up") {
            $positionalFunction = "lag";
        } else if ($direction == "right" || $direction == "down") {
            $positionalFunction = "lead";
        } else {
            throw new \Exception("Invalid input for direction '$direction',
            'left', 'up', 'right' and 'down' are the only accepted values.");
        }

        $groupFilterWithWhere = '';
        if ($groupFilter) {
            $groupFilterWithWhere = " where " . $groupFilter;
        }
        $sql = 
            "select neighbor, secondNeighbor from (
                select *,
                $positionalFunction(sortOrder) over (order by sortOrder) neighbor,
                $positionalFunction(sortOrder, 2) over (order by sortOrder) secondNeighbor
                from $table $groupFilterWithWhere
            ) tempTable
            where $itemFilter"; 
        $result = $conn->query($sql);
        if ($result && $result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $neighbor = $row['neighbor'];
            $secondNeighbor = $row['secondNeighbor'];
            if (is_null($neighbor)) {
                // this item is already furthest to the left, don't fail the request but don't
                // update anything either
                return [
                    'success' => true,
                    'message' => 'nothing changed, this item is already the end of the list.'
                ];
            } else {
                if ($direction == "left" || $direction == "up") {
                    $sortOrder = getSortOrder($secondNeighbor, $neighbor);
                } else if ($direction == "right" || $direction == "down") {
                    $sortOrder = getSortOrder($neighbor, $secondNeighbor);
                }

                // array_filter removes all falsey strings, which allows groupFilter to be blank
                $combinedFilters = implode(" and ", array_filter(array($groupFilter, $itemFilter)));
                $sql = 
                    "update $table 
                    set sortOrder = '$sortOrder'
                    where $combinedFilters
                    ";

                $result = $conn->query($sql);

                if ($result) {
                    if ($conn->affected_rows == 1) {
                        return [ 'success' => true ];
                    } else {
                        throw new \Exception("Operation unexpectedly impacted more than 1 record" . $conn->error);
                    }
                } else {
                    throw new \Exception("Failed to add move this item. " . $conn->error);
                }
            }
        } else {
            throw new \Exception("Error finding sort order of previous items." . $conn->error . $result->num_rows . $sql);
        }
    }
        
}
?>
