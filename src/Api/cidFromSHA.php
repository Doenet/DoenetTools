<?php
include "base32.php";
use Base32\Base32;

function cidFromSHA($SHA){
  $hashLen = '20'; //32 bit
  $algorithm = '12'; //SHA2-256
  // (eventually we want dag-pb)
  $multiHash =  $algorithm . $hashLen . $SHA; 
  $multiCodec = '55'; //raw binary
  $cidVersion = '01'; //2nd version of Multiformat (starts at 0) 

  $hexCid = $cidVersion . $multiCodec . $multiHash;

  $encoded = Base32::encode(hex2bin($hexCid));
  $encoded = str_replace("=","",$encoded);

  $base = 'b'; //code https://github.com/multiformats/multibase/blob/master/multibase.csv
  $cid = $base . $encoded;
  return $cid;
}

?>