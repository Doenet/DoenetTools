<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");

include "db_connection.php";

$jwtArray = include "jwtArray.php";
$userId = $jwtArray['userId'];

function cmp($a, $b)
{
    return strcmp($a["shortname"], $b["shortname"]);
}


if ($userId == ""){

    $response_arr = array(
        "access"=> FALSE,
        "reason"=> "Not signed in"
    );

}else{

    $_POST = json_decode(file_get_contents("php://input"),true);
    $_POSTCOPY = json_decode(file_get_contents("php://input"),true);
    $number_items = count($_POST);
    usort($_POSTCOPY, "cmp");
    $positionflag = true; //assuming order is same
    for ($i = 0; $i < count($_POST); $i++) {
        if (strcmp($_POST[$i]["courseId"], $_POSTCOPY[$i]["courseId"]) !== 0 ){
            $positionflag = false;
        }
    }
    // var_dump($positionflag);
    // $_POST = array(
    //     array(
    //         "courseId" => 'uTMfKhSmcNtLDaK8oJ3U',
    //         "order" => 2,
    //         "color" => "aaaaaa",
    //         "image" => null
    //     ),
    //     array(
    //         "courseId" => 'NfzKqYtTgYRyPnmaxc7XB',
    //         "order" => 1,
    //         "color" => "bbbbbb",
    //         "image" => null
    //     )
    // );
    
    for ($i = 0; $i < count($_POST); $i++) {

        // var_dump($_POST[$i]);

        $courseId =  mysqli_real_escape_string($conn,$_POST[$i]["courseId"]);
        $position =  mysqli_real_escape_string($conn,$_POST[$i]["position"]);
        $color =  mysqli_real_escape_string($conn,$_POST[$i]["color"]);
        $image =  mysqli_real_escape_string($conn,$_POST[$i]["image"]);
        // var_dump($image);
        // var_dump($position);

        $position = $positionflag ? 'NULL' : $position;

        

        $sql = "SELECT  courseId, shortname, color, image
        FROM course
        WHERE courseId = '$courseId'
        ";

        $result = $conn->query($sql);

        $row = $result->fetch_assoc();

        // var_dump($row);

        if($row['color'] === $color && $row['image'] == $image && $positionflag){
            // var_dump($row);
            $sql = "SELECT *
            FROM user_dashboard_modification as udm
            WHERE courseId = '$courseId'
            AND userId = '$userId'";

            $result = $conn->query($sql);

            if ($result->num_rows >= 1){
                // echo '1';
                $sql = "
                DELETE FROM user_dashboard_modification
                WHERE courseId = '$courseId'
                AND userId = '$userId'
                ";
                // var_dump($sql);
                $result = $conn->query($sql);

            } 


        }else{
            $sql = "SELECT *
            FROM user_dashboard_modification as udm
            WHERE courseId = '$courseId'
            AND userId = '$userId'";

            $result = $conn->query($sql);

            if ($result->num_rows < 1){
                // echo '1';
                $sql = "
                INSERT INTO user_dashboard_modification
                (userId, courseId, position, color, image)
                VALUES
                ('$userId','$courseId',$position,'$color','$image')
                ";

            }else{
                // echo '2';
                $sql = "UPDATE user_dashboard_modification
                SET position = $position, color = '$color', image = '$image'
                WHERE courseId = '$courseId'
                AND userId = '$userId'";
            }

            $result = $conn->query($sql); 
        }

    }

    if ($result === TRUE) {
        // set response code - 200 OK
        http_response_code(200);
    }else {
        echo "Error: " . $sql . "\n" . $conn->error;
    }

}

    $conn->close();

?>