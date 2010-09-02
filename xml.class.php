<?php

class manageXML
{

	function manageXML()
	{
	}
	
	function setXmlConfig($config_array, $file)
	{
		$xmlContent = '<?xml version="1.0" encoding="UTF-8" ?>
		<configs>
			<game>
				<hole_size>20</hole_size>
				<hole_spacing>100</hole_spacing>
				<longestWormEver>1000</longestWormEver>
				<startingSpeed>15</startingSpeed>
				<speedingIncrementSpeed>5</speedingIncrementSpeed>
				<intervalMiliSeconds>1000</intervalMiliSeconds>
				<speed>0</speed>
				<fps>0</fps>
				<basicFPSValue>20</basicFPSValue>
				<wormSize>4</wormSize>
				<angleStepSize>1</angleStepSize>
				<sizeMultiplier>2<sizeMultiplier>	
			</game>
		</configs>';

		$this->writeXmLFile($file, $xmlContent);
	}
	
	function getXmlValues($file)
	{
		//$return_array = array();

		if (!$xml=simplexml_load_file($file))
		{
			echo '<br/>Error reading the XML file '.$file;
		}
		else 
		{
			foreach($xml->game as $key=>$value)
			{
			
				$return_array[$key] = $value; 
				//var_dump($key);
			}
			//$value = $xml->game->$key;	
			return $return_array;		
		}		
	}
	
	function getXmlValue($key, $file) 
	{
		if (!$xml=simplexml_load_file($file))
		{
			echo '<br/>Error reading the XML file '.$file;
		}
		else 
		{
			/*
			foreach($xml->game as $key)
			{
				var_dump($key);
			}
			die();
			*/
			$value = $xml->game->$key;	
			return $value;		
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