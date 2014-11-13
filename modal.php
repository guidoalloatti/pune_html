<?php

	echo '

<!-- jQueryIU Starts-->
		<script src="static/js/jquery-1.8.0.min.js" type="text/javascript"></script>
		<script src="static/js/jquery-ui-1.8.23.custom.min.js" type="text/javascript"></script>
		<link href="static/js/jquery-ui-1.8.23.custom.css" rel="stylesheet" type="text/css">

		<script src="static/js/modal.js" type="text/javascript"></script>
		<script src="static/js/settings.js" type="text/javascript"></script>
		<script src="static/js/vars.js" type="text/javascript"></script>
		<script src="static/js/ajax.js" type="text/javascript"></script>
		<script src="static/js/keys.js" type="text/javascript"></script>


	<meta charset="utf-8">
		<style>
			body { font-size: 62.5%; }
			label, input { display:block; }
			input.text { margin-bottom:12px; width:95%; padding: .4em; }
			fieldset { padding:0; border:0; margin-top:25px; }
			h1 { font-size: 1.2em; margin: .6em 0; }
			div#users-contain { width: 350px; margin: 20px 0; }
			div#users-contain table { margin: 1em 0; border-collapse: collapse; width: 100%; }
			div#users-contain table td, div#users-contain table th { border: 1px solid #eee; padding: .6em 10px; text-align: left; }
			.ui-dialog .ui-state-error { padding: .3em; }
			.validateTips { border: 1px solid transparent; padding: 0.3em; }
		</style>

	<div class="demo">

	<div class="ui-widget" id="dialog-form" title="Create a new game: Configure Keys and Settings!">
		<table class="ui-widget ui-widget-content">
			<tr class="ui-widget-header">
				<th>Worm</th>
				<th>Play</th>
				<th>Left</th>
				<th>Right</th>
			</tr>
			<tr class="ui-widget-content">
				<!-- <td><input type="label" style="color: white; background: lightgray; font-size: 12pt;" value="Red Worm" readonly="true" id="red_label"/></td> -->
				<td><input type="label" style="color: white; background: lightgray; font-size: 10pt;" value="Red Worm" readonly="true" id="red_label"/></td>
				<td align="center"><input type="checkbox" id="red_play" /></td>
				<td align="center"><input type="text" id="redLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="redRightInput" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 10pt;" value="Blue Worm" readonly="true" id="blue_label"/></td>
				<td align="center"><input type="checkbox" id="blue_play" /></td>
				<td align="center"><input type="text" id="blueLeftInput" size="1" hidden="true"/></td>
				<td align="center"><input type="text" id="blueRightInput" size="1" hidden="true"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 10pt;" value="Green Worm" readonly="true" id="green_label"/></td>
				<td align="center"><input type="checkbox" id="green_play" /></td>
				<td align="center"><input type="text" id="greenLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="greenRightInput" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 10pt;" value="Purple Worm" readonly="true" id="purple_label"/></td>
				<td align="center"><input type="checkbox" id="purple_play" /></td>
				<td align="center"><input type="text" id="purpleLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="purpleRightInput" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 10pt;" value="Cyan Worm" readonly="true" id="cyan_label"/></td>
				<td align="center"><input type="checkbox" id="cyan_play" /></td>
				<td align="center"><input type="text" id="cyanLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="cyanRightInput" size="1"/></td>
			</tr>
			<tr>
				<td><input type="label" style="color: white; background: lightgray; font-size: 10pt;" value="Yellow Worm" readonly="true" id="yellow_label"/></td>
				<td align="center"><input type="checkbox" id="yellow_play" /></td>
				<td align="center"><input type="text" id="yellowLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="yellowRightInput" size="1"/></td>
			</tr>
		</table><hr/>
		<table style="margin-left:40px;" class="ui-widget ui-widget-content">
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
					<select id="modal_speed">
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
		<!-- <hr/>
		<table>
			<tr>
				<td><input id="saveButton" type="button" value="Save" onclick="save();" /></td>
				<td><input id="testSettings" type="button" value="Test Settings!" onclick="testSettingsPage();" /></td>
				<td><input id="testSettings" type="button" value="Test Settings!" onclick="testSettingsPage();" /></td>
				<td><input id="testKeys" type="button" value="Test Keys!" onclick="testKeysPage(\'settings\');" /></td>
			</tr>
		</table>
		-->
	</div>
	<!-- Modal Content -->

	<div id="users-contain" class="ui-widget">
		<h1>Welcome to Pune HTML!</h1>
		<img src="images/wormclean.jpg">
	</div>
	<button id="create-game">Create new game</button>

	</div><!-- End demo -->

	<div class="demo-description">
	</div><!-- End demo-description -->
	<!-- jQueryUI Ends -->';

?>
