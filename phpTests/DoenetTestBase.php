<?php

namespace Legacy {
     function file_get_contents($path) {
        global $mockedJsonBody;
        if ($path == "php://input") {
            return json_encode($mockedJsonBody);
        }
    }

    function mail($emailaddress,$subject,$htmlContent, $headers) {}
}

namespace Tests {

    require 'public/api/models/baseModel.php';
    use \Firebase\JWT\JWT;
    require_once "vendor/autoload.php";

    class DoenetTestBase extends \PHPUnit\Framework\TestCase {

        private $user1;
        public $course1;
        private $testDbConn;
        private $jwtKey;

        public function setUp(): void {
            global $_SERVER;
            $_SERVER['HTTP_HOST'] ='localhost';
            global $conn;
            global $init_array;
            include 'public/api/db_connection.php';
            $this->testDbConn = $conn;
            $this->jwtKey = $ini_array['key'];
            $this->createUser();
            $this->signIn();
            $this->createCourse();
        }

        function mockJsonBody($body) {
            global $mockedJsonBody;
            $mockedJsonBody = $body;
        }

        function runScriptExpectJson($path) {
            ob_start( null, 0, PHP_OUTPUT_HANDLER_CLEANABLE | PHP_OUTPUT_HANDLER_REMOVABLE);
            include $path;
            $this->assertEquals(200, http_response_code());
            $response = ob_get_clean();
            $decoded = json_decode($response, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception("Response was not valid JSON:" . $response);
            }
            return $decoded;
        }
        
        function createUser() {
            $email = "user1@test.com";
            $_REQUEST["emailaddress"] = $email;
            $response = $this->runScriptExpectJson("public/api/sendSignInEmail.php");
            $this->assertTrue($response['success']);

            $rows = \Base_Model::queryFetchAssoc($this->testDbConn,
                "SELECT userId
                FROM user
                WHERE email='$email'");

            $this->user1 = $rows[0]['userId'];
        }

        function createCourse() {
            $response = $this->runScriptExpectJson("public/api/createCourse.php");
            $this->assertTrue($response['success']);

            $this->course1 = $response['courseId'];
        }

        function signIn() {
            global $ini_array;
            $payload = [
                // "email" => $emailaddress,
                'userId' => $this->user1,
                'deviceName' => "a test device name",
                // "expires" => $expirationTime
            ];
            $key = $this->jwtKey;
            $jwt = JWT::encode($payload, $key);
            $_COOKIE = ['JWT' => $jwt];
        }

        function signOut() {

        }
    }
}
?>
