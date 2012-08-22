
<?php

echo '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> 
<html> 
    <head> 
        <title>Pune! Settings</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
        <meta content="javascript, game, games, jquery, gamequery, game engine, framework, development" name="keywords"> 
        <link rel="icon" href="/favicon.gif" type="image/gif"> 

		<!-- Javascript files included -->
        <script src="static/js/jquery-1.4.2.js" type="text/javascript"></script>
		<script src="static/js/vars.js" type="text/javascript"></script>
		<script src="static/js/ajax.js" type="text/javascript"></script>
		<script src="static/js/settings.js" type="text/javascript"></script>
		<script src="static/js/keys.js" type="text/javascript"></script>
		<!--
		<script src="static/js/sounds.js" type="text/javascript"></script>
		<script src="static/js/worms.js" type="text/javascript"></script>
		<script src="static/js/graphics.js" type="text/javascript"></script>
		-->

	</head>

	<body>
		<h2>Key Configuration</h2>
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
				<td align="center"><input type="text" id="redLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="redRightInput" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Blue Worm" readonly="true" id="blue_label"/></td>
				<td align="center"><input type="checkbox" id="blue_play" /></td>
				<td align="center"><input type="text" id="blueLeftInput" size="1" hidden="true"/></td>
				<td align="center"><input type="text" id="blueRightInput" size="1" hidden="true"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Green Worm" readonly="true" id="green_label"/></td>
				<td align="center"><input type="checkbox" id="green_play" /></td>
				<td align="center"><input type="text" id="greenLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="greenRightInput" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Purple Worm" readonly="true" id="purple_label"/></td>
				<td align="center"><input type="checkbox" id="purple_play" /></td>
				<td align="center"><input type="text" id="purpleLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="purpleRightInput" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Cyan Worm" readonly="true" id="cyan_label"/></td>
				<td align="center"><input type="checkbox" id="cyan_play" /></td>
				<td align="center"><input type="text" id="cyanLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="cyanRightInput" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Yellow Worm" readonly="true" id="yellow_label"/></td>
				<td align="center"><input type="checkbox" id="yellow_play" /></td>
				<td align="center"><input type="text" id="yellowLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="yellowRightInput" size="1"/></td>
			</tr>
		</table>
	
	
	
<hr/>

		<table>
			<tr>
				<td><h2>Game Options</h2></td>
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
		<hr/>

		<table>
			<tr>
				<td><input id="saveButton" type="button" value="Save" onclick="save();" /></td>
				<!--
				<td><input id="testSettings" type="button" value="Test Settings!" onclick="testSettingsPage();" /></td>
				<td><input id="testKeys" type="button" value="Test Keys!" onclick="testKeysPage(\'settings\');" /></td>
				-->
			</tr>
		</table>
	</body>
</html>';
?>