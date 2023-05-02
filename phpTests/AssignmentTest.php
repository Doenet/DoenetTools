<?php

namespace Legacy {
     function file_get_contents($path) {
        if ($path == "php://input") {
            return json_encode([
                'driveId' => 'ADFASDF',
                'parentFolderId' => '1234',
                'itemId' => 'itemId123',
                'versionId' => 'versionId123',
                'label' => 'label in test',
                'type' => 'DoenetML',
                'doenetId' => 'doenetId123',
                'userId' => 'cyuserid'
            ]);
        }
    }

    function mail($emailaddress,$subject,$htmlContent, $headers) {}
}

namespace Tests {
    use \Firebase\JWT\JWT;
    require_once "vendor/autoload.php";

    class AssignmentTest extends \PHPUnit\Framework\TestCase {
    /**
         * @runInSeparateProcess
         */
        public function testAddItem() {
            $_SERVER = ['HTTP_HOST' => 'localhost'];
            $_POST = [
                'driveId' => 'ADFASDF',
                'parentFolderId' => '1234',
                'itemId' => 'itemId123',
                'versionId' => 'versionId123',
                'label' => 'label in test',
                'type' => 'DoenetML',
                'doenetId' => 'doenetId123',
                'userId' => 'cyuserid'
            ];
            $_REQUEST["emailaddress"] = "test@test.com";
            include "public/api/sendSignInEmail.php";

            $payload = [
                // "email" => $emailaddress,
                'userId' => "134124234",
                'deviceName' => "a test device name",
                // "expires" => $expirationTime
            ];
            $key = $ini_array['key'];
            $jwt = JWT::encode($payload, $key);
            $_COOKIE = ['JWT' => $jwt];
            
            include 'public/api/addItem.php';
        }
    }
}
?>
