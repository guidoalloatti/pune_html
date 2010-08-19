<?php

echo '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> 
<html> 
    <head> 
        <title>Pune! - Html5, Canvas, jQuery Game</title> 
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
        <meta content="javascript, game, games, jquery, gamequery, game engine, framework, development" name="keywords"> 
        <link rel="icon" href="/favicon.gif" type="image/gif"> 
        <script src="js/jquery-1.4.2.js" type="text/javascript"></script> 
		<script src="js/game.js" type="text/javascript"></script> 
		<script src="js/settings.js" type="text/javascript"></script> 
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
				</tr>
			</table>
		</div>
			
		<div>
			<table>
				<tr>
					<td id="die"></td>
					<td id="winning"></td>
					<td id="speeding"></td>
					<td id="yabass"></td>
					<td id="red"></td>
					<td id="blue"></td>
					<td id="green"></td>
					<td id="purple"></td>
					<td id="cyan"></td>
					<td id="yellow"></td>
				</tr>
			</table>
		</div>		
	</body>
</html>';			
			
?>