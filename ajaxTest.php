<?php

include_once("./xml.class.php");

$config_array = array(	"hole_size" 			=> "", 
						"hole_spacing" 			=> "",
						"longestWormEver" 		=> "",	
						"startingSpeed"			=> "",
						"speedingIncrementSpeed" => "",
						"intervalMiliSeconds" 	=> "",
						"speed"					=> "",
						"fps"					=> "",
						"basicFPSValue"		 	=> "",
						"wormSize"				=> "",
						"angleStepSize"			=> "",
						"sizeMultiplier"		=> "");

$xmlFile = './config.xml';
$manageXML = new manageXML();

$config_array = $manageXML->getXmlValues($xmlFile);

foreach($config_array['game'] as $key=>$value)
	echo "var ".$key." = '".$value."';";


//var_dump($config_array);



//foreach($config_array as $key=>$value) //$config)
//	$config_array[$key] = $manageXML->getXmlValue($key, $xmlFile);

/*
*/
	
//die();

?>