<?php

echo '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> 
<html> 
    <head> 
        <title>jQuery|HTML5 Canvas|gameQuery Experiment</title> 
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
        <meta content="javascript, game, games, jquery, gamequery, game engine, framework, development" name="keywords"> 
        <link rel="icon" href="/favicon.gif" type="image/gif"> 
        <script src="js/jquery-1.4.2.js" type="text/javascript"></script> 
		<script src="js/game.js" type="text/javascript"></script> 
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
				<td align="top">
					<textarea id="message" name="message" rows="8" cols="29"></textarea>
				</td>
			</tr>
		</table>
		</div> 
		<div>
			<table>
				<tr>
					<td><input id="soundButton" type="button" value="Sound On" onclick="soundSwitcher();" /></td>
					<td><input id="pauseButton" type="button" value="Pause Off" onclick="pause();" /></td>
				</tr>
			</table>
			<table>
				<tr>
					<td><span id="die"></span></td>
					<td><span id="winning"></span></td>
					<td><span id="speeding"></span></td>
					<td><span id="yabass"></span></td>
					<td><span id="red"></span></td>
					<td><span id="blue"></span></td>
					<td><span id="green"></span></td>
					<td><span id="purple"></span></td>
					<td><span id="cyan"></span></td>
					<td><span id="yellow"></span></td>
				</tr>
			</table>
		</div>
		
		<!--
		<table>
			<tr>
				<td><input type="button" value="Start" onclick="start();" /></td>
				
				<td><input type="button" value="Restart" onclick="restart();" /></td>
				<td><input type="label" id="angle" size="10"/></td>
				<td><input type="label" id="x" size="10"/></td>
				<td><input type="label" id="y" size="10"/></td>
			</tr>
			<tr>
				<td></td>
				<td><input type="button" value="Up" onclick="moveUp();" /></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
			<tr>
				<td>
					<input type="button" value="Left" onclick="moveLeft();" />
				</td>
				<td>
					<input type="button" value="Down" onclick="moveDown();" />
				</td>
				<td>
					<input type="button" value="Right" onclick="moveRight();" />
				</td>
			</tr>
		</table>
		</div>
		-->
	</body>
</html>';			
			
?>