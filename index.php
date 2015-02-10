<?php

$header = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	<html>
	<head>
		<title>Pune! - Html5, Canvas, jQuery Game</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta content="javascript, game, games, jquery, gamequery, game engine, framework, development" name="keywords">
		<link rel="icon" href="/favicon.gif" type="image/gif">

		<!-- Adding all the JS sources -->
		<!-- <script src="static/js/jquery-1.4.2.js" type="text/javascript"></script> -->
		<script src="static/js/jquery-1.8.0.min.js" type="text/javascript"></script>
		<script src="static/js/vars.js" type="text/javascript"></script>
		<script src="static/js/worms.js" type="text/javascript"></script>
		<script src="static/js/graphics.js" type="text/javascript"></script>
		<script src="static/js/sounds.js" type="text/javascript"></script>
		<script src="static/js/keys.js" type="text/javascript"></script>
		<script src="static/js/settings.js" type="text/javascript"></script>
		<script src="static/js/ajax.js" type="text/javascript"></script>
		<script src="static/js/jquery-ui-1.8.23.custom.min.js" type="text/javascript"></script>
		<script src="static/js/modal.js" type="text/javascript"></script>

		<!-- Adding the Styling Sources -->
		<link href="static/js/jquery-ui-1.8.23.custom.css" rel="stylesheet" type="text/css">

		<link href="static/css/common.css" rel="stylesheet" type="text/css">
		<link href="static/css/nav-bar.css" rel="stylesheet" type="text/css">
		<link href="static/css/footer-bar.css" rel="stylesheet" type="text/css">
		<link href="static/css/pre-game.css" rel="stylesheet" type="text/css">
	</head>
	<body>';

$startContent = '<div class="demo">
		<div class="ui-widget" id="dialog-form" title="Create a new game: Configure Keys and Settings!">
		<p style="font-size: 10px"> Click over the input or in the checkbox to add the worm of the color yo choose! </p>
		<table class="ui-widget ui-widget-content">
			<tr class="ui-widget-header">
				<th>Worm</th><th>Play</th><th>Left</th><th>Right</th>
			</tr>
			<tr class="ui-widget-content">
				<td><input type="label" style="color: white; background: lightgray" value="Red Worm" readonly="true" id="red_label"/></td>
				<td align="center"><input type="checkbox" id="red_play" name="red"/></td>
				<td align="center"><input type="text" id="redLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="redRightInput" size="1"/></td>
			</tr>
			<tr class="ui-widget-content">
				<td><input type="label" style="color: white; background: lightgray;;" value="Blue Worm" readonly="true" id="blue_label"/></td>
				<td align="center"><input type="checkbox" id="blue_play" name="blue"/></td>
				<td align="center"><input type="text" id="blueLeftInput" size="1" /></td>
				<td align="center"><input type="text" id="blueRightInput" size="1" /></td>
			</tr>
			<tr class="ui-widget-content">
				<td><input type="label" style="color: white; background: lightgray;" value="Green Worm" readonly="true" id="green_label"/></td>
				<td align="center"><input type="checkbox" id="green_play" name="green"/></td>
				<td align="center"><input type="text" id="greenLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="greenRightInput" size="1"/></td>
			</tr>
			<tr class="ui-widget-content">
				<td><input type="label" style="color: white; background: lightgray;" value="Purple Worm" readonly="true" id="purple_label"/></td>
				<td align="center"><input type="checkbox" id="purple_play" name="purple"/></td>
				<td align="center"><input type="text" id="purpleLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="purpleRightInput" size="1"/></td>
			</tr>
			<tr class="ui-widget-content">
				<td><input type="label" style="color: white; background: lightgray;" value="Cyan Worm" readonly="true" id="cyan_label"/></td>
				<td align="center"><input type="checkbox" id="cyan_play" name="cyan"/></td>
				<td align="center"><input type="text" id="cyanLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="cyanRightInput" size="1"/></td>
			</tr>
			<tr class="ui-widget-content">
				<td><input type="label" style="color: white; background: lightgray;" value="Yellow Worm" readonly="true" id="yellow_label"/></td>
				<td align="center"><input type="checkbox" id="yellow_play" name="yellow"/></td>
				<td align="center"><input type="text" id="yellowLeftInput" size="1"/></td>
				<td align="center"><input type="text" id="yellowRightInput" size="1"/></td>
			</tr>
		</table><hr/>

		<table class="ui-widget ui-widget-content">
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
				<td><select id="gap_spacing">
						<option>Close</option>
						<option>Normal</option>
						<option>Far Apart</option>
					</select></td>
			</tr>
			<tr>
				<td>Gap Size</td>
				<td><select id="gap_sizing">
						<option>Small</option>
						<option>Normal</option>
						<option>Large</option>
					</select></td>
			</tr>
		</table>

	</div>
	<!-- Modal Content -->
	<div id="users-contain" class="ui-widget">
		<h1>Welcome to Pune HTML!</h1>
		<hr/>
		<img src="images/wormclean.jpg">
	</div>
	<hr/>
	<button id="create-game">Create new game</button>
	<button id="post-it">Share!</button>
	<button id="read-about">About</button>
	</div>
	<div class="demo-description"></div>
	<div id="count_1">1</div>
	<div id="count_2">2</div>
	<div id="count_3">3</div>
	';

$gameContent = 
	'
	<!-- Nav Bar, pre game body and and Footer bar HTML start here -->
	<!-- ========================================================= -->
	<div id="nav-bar">
		<div>
			<a href="#" class="create-nav-bar" id="set-game">Create Game</a>
		</div>
		<div>
			<a href="#" class="toggle-nav-bar" id="show-options">Toogle Options</a>
		</div>
		<div>
			<a href="https://github.com/guidoalloatti/pune_html/tree/working" TARGET="_blank" class="pune-nav-bar">Pune HTML5</a>
		</div>
		<div>
			<a href="#" id="sounds-nav-bar">Play Sounds</a>
		</div>
		<div id="sounds-menu" style="display: none;">
			<div>
				<div>Worms Winning Shouts</div>
				<hr/>
				<div id="red-winning-shout">
					<a href="#" id="play-red-winning-shout">
						<div id="red-image"></div>
						<div id="red-text">Red</div>
					</a>
				</div>
				<div id="blue-winning-shout">
					<a href="#" id="play-blue-winning-shout">
						<div id="blue-image"></div>
						<div id="blue-text">Blue</div>
					</a>
				</div>
				<div id="green-winning-shout">
					<a href="#" id="play-green-winning-shout">
						<div id="green-image"></div>
						<div id="green-text">Green</div>
					</a>
				</div>
				<div id="purple-winning-shout">
					<a href="#" id="play-purple-winning-shout">
						<div id="purple-image"></div>
						<div id="purple-text">Purple</div>
					</a>
				</div>
				<div id="yellow-winning-shout">
					<a href="#" id="play-yellow-winning-shout">
						<div id="yellow-image"></div>
						<div id="yellow-text">Yellow</div>
					</a>
				</div>
				<div id="cyan-winning-shout">
					<a href="#" id="play-cyan-winning-shout">
						<div id="cyan-image"></div>
						<div id="cyan-text">Cyan</div>
					</a>
				</div>
					<div>Game Funny Sounds</div>
				<hr/>
				<div id="die-shout">
					<a href="#" id="die-shout">
						<div id="die-image"></div>
						<div id="die-text">Die</div>
					</a>
				</div>
				<div id="yabass-shout">
					<a href="#" id="yabass-shout">
						<div id="yabass-image"></div>
						<div id="yabass-text">Yabass</div>
					</a>
				</div>
				<div id="speeding-shout">
					<a href="#" id="speeding-shout">
						<div id="speeding-image"></div>
						<div id="speeding-text">Speed</div>
					</a>
				</div>
				<div id="winning-shout">
					<a href="#" id="winning-shout">
						<div id="winning-image"></div>
						<div id="winning-text">Win</div>
					</a>
				</div>
				<div id="pause-shout">
					<a href="#" id="pause-shout">
						<div id="pause-image"></div>
						<div id="pause-text">Pause</div>
					</a>
				</div>
				<div id="burp-shout">
					<a href="#" id="burp-shout">
						<div id="burp-image"></div>
						<div id="burp-text">Burp</div>
					</a>
				</div>
			</div>
		</div>
	</div>

	<div id="start-body">
		<div>
			<div id="welcome-body">Welcome to Pune Browser Edition!</div>
			<hr/>
			<div id="worm-image-body"><img src="images/wormclean.jpg"></div>
			<hr/>
			<div id="get-ready-body">Get Ready to crush those worms!</div>
		</div>
	</div>

	<div id="footer-bar">
		<div>
			<a href="http://www.linkedin.com/profile/view?id=50407787" TARGET="_blank" class="footer-created-by">
				Created by: Guido Alloatti
			</a>
		</div>
	</div>
	

	<!-- Game HTML Start Here -->
	<!-- ==================== -->
	<div id="background" style="display: none;">
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
					<td id="options-td">
						<table class="centered" >
						<tbody>
						<tr valign=top>
						  <td colspan=5></td>
						  <td bgcolor=#ffcccc width="54">&nbsp;</td>
						  <td colspan=2></td>
						</tr>
						<tr valign=top>
						  <td width="6"></td>
						  <td bgcolor=#88bbbb width="56">&nbsp;</td>
						  <td colspan=2></td>
						  <td bgcolor=#cc3333 colspan=2 rowspan=2>
							<p class="subtitle">Game Handling</p><hr/>
								<table>
									<tr><td><p id="soundStatus" class="submenu">Sound is ON</font></p></td>
										<td id="soundImage"><a onclick="soundSwitcher();"><img src="images/uncheck.png" alt="Sound is ON" width="32" height="32" border="0" /></a></td></tr>
									<tr><td><p id="pauseStatus" class="submenu">Pause is OFF </p></td>
										<td id="pauseImage"><a onclick="pauseSwitcher();"><img src="images/check.png" alt="Sound is ON" width="32" height="32" border="0" /></a></td></tr>
									<!-- <tr><td><input id="configButton" type="button" value="Settings" onclick="settings();" /></td></tr> -->
									<tr><td><input id="testKeys" type="button" value="Load Custom Key!" onclick="testKeysPage(\'main\');" /></td></tr>
									<tr><td><input id="button" type="button" value="Sound Test [Nasty!]" onclick="playSound(\'burp\');"></td></tr>
									<tr><td><button id="set-game">Settings</button></td></tr>
								</table>
								</font></p>
						  </td>
						  <td bgcolor=#ddaaaa width="3">&nbsp;</td>
						  <td></td>
						</tr>
						<tr valign=top>
						  <td bgcolor=#99cccc width="6">&nbsp;</td>
						  <td bgcolor=#006666 colspan=2 rowspan=2>
							<p><font face="Arial, Helvetica, sans-serif" size="2" color="#8CBABD"><b>Move that Worm!<br></b></font></b>
								<font face="Arial, Helvetica, sans-serif" size="2" color="#FFFFFF">
								<hr/>
								<table>
									<tr>
										<td>Worm | Left | Right</td>
									</tr>
									<tr id="redKeyHelpRow" style="display:none;">
										<td>Red</td>
										<td><input type="button" id="redLeftButton" value=""></td>
										<td><input type="button" id="redRightButton" value=""></td>
									</tr>
									<tr id="blueKeyHelpRow" style="display:none;">
										<td>Blue</td>
										<td><input type="button" id="blueLeftButton" value=""></td>
										<td><input type="button" id="blueRightButton" value=""></td>
									</tr>
									<tr id="greenKeyHelpRow" style="display:none;">
										<td>Green</td>
										<td><input type="button" id="greenLeftButton" value=""></td>
										<td><input type="button" id="greenRightButton" value=""></td>
									</tr>
									<tr id="purpleKeyHelpRow" style="display:none;">
										<td>Purple</td>
										<td><input type="button" id="purpleLeftButton" value=""></td>
										<td><input type="button" id="purpleRightButton" value=""></td>
									</tr>
									<tr id="cyanKeyHelpRow" style="display:none;">
										<td>Cyan</td>
										<td><input type="button" id="cyanLeftButton" value=""></td>
										<td><input type="button" id="cyanRightButton" value=""></td>
									</tr>
									<tr id="yellowKeyHelpRow" style="display:none;">
										<td>Yellow</td>
										<td><input type="button" id="yellowLeftButton" value=""></td>
										<td><input type="button" id="yellowRightButton" value=""></td>
									</tr>
								</table>
							  </font></p>
						  </td>
						  <td width="20">
						  <img src="images/worm.png" width="100" height="120">
						  </td>
						  <td colspan=2 rowspan=2>&nbsp;</td>
						</tr>
						<tr valign=top>
						  <td width="6"></td>
						  <td bgcolor=#254D78 colspan=3 rowspan=3>
							<p align="center"><font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="+3"><b><font size="+2">Sounds<br/>Game & Worms!</font></b></font></p>
							<p align="center"><font face="Arial, Helvetica, sans-serif" size="3"><b><font color="#A5C5E2"></font></b></font></p>
							<table>
								<tr> <td>Die</td> <td>Win</td> <td>Speed</td> <td>Yabass</td> <td>Pause</td> <td>Burp</td> </tr>
								<tr> <td id="die"></td> <td id="win"></td> <td id="speeding"></td> <td id="yabass"></td> <td id="pause"></td> <td id="burp"></td> </tr>
								<tr> <td bgcolor="red">Red</td> <td bgcolor="blue">Blue</td> <td bgcolor="green">Green</td> <td bgcolor="purple">Purple</td> <td bgcolor="cyan">Cyan</td> <td bgcolor="yellow">Yellow</td> </tr>
								<tr> <td id="red"></td> <td id="blue"></td> <td id="green"></td> <td id="purple"></td> <td id="cyan"></td> <td id="yellow"></td></tr>
							</table>
						  </td>
						</tr>
						<tr valign=top>
						  <td colspan=2></td>
						  <td bgcolor=#77aaaa width="58">&nbsp;</td>
						  <td bgcolor=#B9D3EC colspan=2 rowspan=2>&nbsp;</td>
						</tr>
						<tr valign=top>
						  <td width="6">&nbsp;</td>
						  <td bgcolor=#FFCF63 colspan=2 rowspan=4>
							<p><font face="Arial, Helvetica, sans-serif" size="2" color="#FFF4DF"><b><font color="#FFF5DF">Game Log</font><br>
							  </b></font><font face="Arial, Helvetica, sans-serif" size="2">
							  <textarea id="log" name="log" rows="13" cols="25" style="resize: none; border: 3px solid #cccccc; padding: 3px; font-family: Tahoma, sans-serif;" readonly></textarea>
							  </font></p>
						  </td>
						</tr>
						<tr valign=top>
						  <td bgcolor=#FFE3AD width="6" rowspan="3">&nbsp;</td>
						  <td rowspan=3 width="20">
							<p>&nbsp;</p>
						  </td>
						  <td width="10" bgcolor=#BDD3EF></td>
						  <td colspan=3 bgcolor="purple" rowspan=3><font face="Arial, Helvetica, sans-serif" size="2" color="#BDD3EF"><b>Game Info SR&LW </b> </font><font face="Arial, Helvetica, sans-serif" size="2"><br>
							<font color="#FFFFFF">
							<input type="label" id="speed" readonly/>
							<hr/>
							<input type="label" id="rounds" readonly/>
							<hr/>
							<input type="label" id="longest" readonly/>
							<input type="label" id="longest_size" readonly/>
							</font></font></td>
						</tr>
						<tr valign=top>
						  <td width="1" bgcolor="#BDD3EF">&nbsp;</td>
						</tr>
						<tr valign=top>
						  <td width="1">&nbsp;</td>
						</tr>
						</tbody>
					  </table>
					</td>
				</tr>
			</table>
		</div>
	</div>
	</body>
</html>';

if(isset($_GET['gameId'])) {
	$gameId = $_GET['gameId'];
	$gameIdInput = '<input type="hidden" id="gameId" value="'.$gameId.'" />';
}

echo $header;
echo $gameContent;
if(isset($_GET['gameId'])) {
	echo $gameIdInput;
}
echo $startContent;

?>