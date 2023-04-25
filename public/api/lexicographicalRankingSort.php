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
    
}
?>
