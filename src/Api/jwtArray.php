<?PHP
include "db_connection.php"; //DELETE

$key = $ini_array['key'];
use \Firebase\JWT\JWT;
require_once "vendor/autoload.php";


$jwt =  mysqli_real_escape_string($conn,$_COOKIE["JWT"]);
$jwt_array = array();

if ($jwt != ""){
$jwt_array = (array) JWT::decode($jwt, $key, array('HS256'));
}

//Keep euserId and userId separate keys so we know the source
$ejwt =  mysqli_real_escape_string($conn,$_COOKIE["EJWT"]);
$ejwt_array = array();
if ($ejwt != ""){
  $ejwt_array = (array) JWT::decode($ejwt, $key, array('HS256'));
}

$merged = array_merge($jwt_array,$ejwt_array);

return $merged;

?>