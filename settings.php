
<?php

echo '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> 
<html> 
    <head> 
        <title>Pune! Settings - Html5, Canvas, jQuery Game</title> 
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
        <meta content="javascript, game, games, jquery, gamequery, game engine, framework, development" name="keywords"> 
        <link rel="icon" href="/favicon.gif" type="image/gif"> 
        <script src="static/js/jquery-1.4.2.js" type="text/javascript"></script>
		<!-- <script src="static/js/font.js" type="text/javascript"></script> -->
		<!-- <script src="static/js/include.js" type="text/javascript"></script> -->
		<!-- <script src="js/game.js" type="text/javascript"></script> -->
		<script src="static/js/settings.js" type="text/javascript"></script>
	</head>
    <body>
		
		<input type="hidden" id="red_left_value" value=""/>
		<input type="hidden" id="red_right_value" value=""/>
		<input type="hidden" id="blue_left_value" value=""/>
		<input type="hidden" id="blue_right_value" value=""/>
		<input type="hidden" id="green_left_value" value=""/>
		<input type="hidden" id="green_right_value" value=""/>
		<input type="hidden" id="purple_left_value" value=""/>
		<input type="hidden" id="purple_right_value" value=""/>
		<input type="hidden" id="cyan_left_value" value=""/>
		<input type="hidden" id="cyan_right_value" value=""/>
		<input type="hidden" id="yellow_left_value" value=""/>
		<input type="hidden" id="yellow_right_value" value=""/>		
	';
		echo '<h3><u>Worms Configuration</u></h3>
		<table>
			<tr>
				<th>Worm</th>
				<th>Play</th>
				<th>Left</th>
				<th>Right</th>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Red Worm" readonly="true" id="red_label"/></td>
				<td align="center"><input type="checkbox" id="red_play" /></td>
				<td align="center"><input type="text" id="red_left" size="1"/></td>
				<td align="center"><input type="text" id="red_right" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Blue Worm" readonly="true" id="blue_label"/></td>
				<td align="center"><input type="checkbox" id="blue_play" /></td>
				<td align="center"><input type="text" id="blue_left" size="1" hidden="true"/></td>
				<td align="center"><input type="text" id="blue_right" size="1" hidden="true"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Green Worm" readonly="true" id="green_label"/></td>
				<td align="center"><input type="checkbox" id="green_play" /></td>
				<td align="center"><input type="text" id="green_left" size="1"/></td>
				<td align="center"><input type="text" id="green_right" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Purple Worm" readonly="true" id="purple_label"/></td>
				<td align="center"><input type="checkbox" id="purple_play" /></td>
				<td align="center"><input type="text" id="purple_left" size="1"/></td>
				<td align="center"><input type="text" id="purple_right" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Cyan Worm" readonly="true" id="cyan_label"/></td>
				<td align="center"><input type="checkbox" id="cyan_play" /></td>
				<td align="center"><input type="text" id="cyan_left" size="1"/></td>
				<td align="center"><input type="text" id="cyan_right" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Yellow Worm" readonly="true" id="yellow_label"/></td>
				<td align="center"><input type="checkbox" id="yellow_play" /></td>
				<td align="center"><input type="text" id="yellow_left" size="1"/></td>
				<td align="center"><input type="text" id="yellow_right" size="1"/></td>
			</tr>
		</table>
	
	
	


		<table>
			<tr>
				<td><h3>Game Options</h3></td>
			</tr>
			<tr>
				<td>Hole Points</td>
				<td>
					<select id="hole_points">
						<option>None</option>
						<option>One</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>Speed</td>
				<td>
					<select id="speed">
						<option>Slow</option>
						<option>Normal</option>
						<option>Frantic</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>Gap Spacing</td>
				<td>
					<select id="gap_spacing">
						<option>Close</option>
						<option>Normal</option>
						<option>Far Apart</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>Gap Size</td>
				<td>
					<select id="gap_sizing">
						<option>Small</option>
						<option>Normal</option>
						<option>Large</option>
					</select>
				</td>
			</tr>
		</table>
		
		<table>
			<tr>
				<td><input id="saveButton" type="button" value="Save" onclick="save();" /></td>
			</tr>
		</table>
	</body>
					<!-- <input type="checkbox" id="save_on_close" name="save_on_close" value="">Remove Pause On Save> -->
</html>';

?>