<?php

/*
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

/*
echo "<br/>config_array[0]: ".$config_array[0];
echo "<br/>config_array[1]: ".$config_array[1];
echo "<br/>config_array['hole_size']: ".$config_array["hole_size"];
echo "<br/>config_array['hole_spacing']: ".$config_array["hole_spacing"];
$key = array_search(20, $config_array); 
echo "<br/>key: ".$key;  
*/

/*
foreach($config_array as $key=>$value) //$config)
	$config_array[$key] = $manageXML->getXmlValue($key, $xmlFile);

foreach($config_array as $key=>$value)
	echo "<br/>config_array['".$key."']: ".$value;

die();
*/
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> 
<html> 
    <head> 
        <title>Pune! - Html5, Canvas, jQuery Game</title> 
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
        <meta content="javascript, game, games, jquery, gamequery, game engine, framework, development" name="keywords"> 
        <link rel="icon" href="/favicon.gif" type="image/gif"> 
        <script src="js/jquery-1.4.2.js" type="text/javascript"></script> 
		<script src="js/game.js" type="text/javascript"></script> 
		<script src="js/sounds.js" type="text/javascript"></script> 
		<!--
		<script src="js/graphics.js" type="text/javascript"></script> 
		<script src="js/settings.js" type="text/javascript"></script> 
		<script src="js/include.js" type="text/javascript"></script>
		<link href="css/style.css" rel="stylesheet" type="text/css"> 
		-->
	</head>
    <body>
		<div id="canvas_div"> 
		<table>
			<tr>
				<td>
					<canvas id="screen" width="640" height="480">
						This text is displayed if our browser does not support HTML5 Canvas.
					</canvas>
				</td>
				<td>
					<canvas id="marker" width="100" height="480">
						This text is displayed if our browser does not support HTML5 Canvas.
					</canvas>
				</td>
				<td>
					<table>
						<tr><td>How to move the Worms</td></tr>
						<tr><td><textarea id="howto" name="howto" rows="6" cols="30"></textarea></td></tr>
						<tr><td>Speed</td></tr>
						<tr><td><textarea id="speed" name="speed" rows="2" cols="30"></textarea></td></tr>
						<tr><td>Rounds</td></tr>
						<tr><td><textarea id="rounds" name="rounds" rows="2" cols="30"></textarea></td></tr>
						<tr><td>Game Log</td></tr>
						<tr><td><textarea id="log" name="log" rows="5" cols="30"></textarea></td></tr>
					</table>
				</td>
			</tr>
		</table>
		</div> 
		<div>
			<table>
				<tr>
					<td><input id="soundButton" type="button" value="Sound On" onclick="soundSwitcher();" /></td>
					<td><input id="pauseButton" type="button" value="Pause Off" onclick="pause();" /></td>
					<td><input id="configButton" type="button" value="Settings" onclick="settings();" /></td>
					<td><input id="testXML" type="button" value="Test XML" onclick="testXML();" /></td>
					<td><input type="button" value="Click" id="button" onclick="playSound('speeding');"></td>
				</tr>
			</table>
		</div>
			
		<div>
			<table>
				<tr>
					<td>
					</td>
				</tr>
				<tr>
					<td id="die"></td>
					<td id="win"></td>
					<td id="speeding"></td>
					<td id="yabass"></td>
					<td id="red"></td>
					<td id="blue"></td>
					<td id="green"></td>
					<td id="purple"></td>
					<td id="cyan"></td>
					<td id="yellow"></td>
					<td id="pause"></td>
				</tr>
			</table>
		</div>		
	</body>
</html>