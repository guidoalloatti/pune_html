<?php

class manageXML()
{

	$xmlFile = './new_conf.xml';

	manageXML(){}
	
	function setXmlConfig($config_array, $file)
	{
		$xmlContent = '<?xml version="1.0" encoding="UTF-8" ?>
		<configs>
			<game>
				<hole_size>100</hole_size>
				<hole_spacing>20</hole_spacing>
				<>
			</game>
		</configs>';

		$this->writeXmLFile($xmlFile, $xmlContent);
	}
	
	
//$ret = $this->getXmlValue("hole_size", $xmlFile);
//echo $ret;


	function getXmlValue($key, $file) 
	{
		if (!$xml=simplexml_load_file($file))
		{
			echo 'Error reading the XML file '.$file;
		}
		else 
		{
			foreach($xml->game as $key)
			{
				var_dump($key);
			}
			die();
			//$value = $xml->game->$key;	
			//return $value;		
		}		
	}

	function writeXmlFile($file, $string) 
	{
		$fh = fopen($file, 'w') or die("No se pudo abrir el archivo: ".$file);
		fwrite($fh, $string);
		fclose($fh); 
	}

}
?>