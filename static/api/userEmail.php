<?PHP

$key = "super_secret_key";
use \Firebase\JWT\JWT;
require_once "/var/www/html/vendor/autoload.php";
$jwt =  mysqli_real_escape_string($conn,$_REQUEST["jwt"]);  
$jwt_array = (array) JWT::decode($jwt, $key, array('HS256'));
return $jwt_array["email"];

?>