<?PHP
include "db_connection.php"; //DELETE

$key = $ini_array['key'];
use \Firebase\JWT\JWT;
require_once "/vendor/autoload.php";
// $jwt =  mysqli_real_escape_string($conn,$_REQUEST["JWT"]);  
$jwt =  mysqli_real_escape_string($conn,$_COOKIE["JWT"]);
if ($jwt == ""){
  return Array();
}
$jwt_array = (array) JWT::decode($jwt, $key, array('HS256'));
return $jwt_array;

?>