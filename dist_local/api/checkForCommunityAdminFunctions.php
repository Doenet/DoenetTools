<?php

// throws exception if current user is not an admin
function checkForAdmin($userId, $conn) {
    if (!userIsAdmin($userId, $conn)) {
        throw new Exception("You do not have admin permissions.");
    }
}

// does not throw exception, just returns a boolean if the a user is logged in
// and is an admin
function userIsAdmin($userId, $conn) {
    if ($userId == '') {
        return false;
    } else {
        $sql = 
            "select userId from community_admin
            where userId = '$userId'
            ";

        $result = $conn->query($sql);
        if ($result->num_rows == 0) {
            return false;
        }
        return true;
    }
}

?>