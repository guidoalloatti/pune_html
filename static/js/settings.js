
function loadInitialValues() {
	$.each(players, function(index, setting) {
		$.each(setting, function(key, value) {
			if(key == "player_1" && value == 1) { labelClicked("red", "label"); }
			if(key == "player_2" && value == 1) { labelClicked("blue", "label"); }
			if(key == "player_3" && value == 1) { labelClicked("green", "label"); }
			if(key == "player_4" && value == 1) { labelClicked("purple", "label"); }
			if(key == "player_5" && value == 1) { labelClicked("cyan", "label"); }
			if(key == "player_6" && value == 1) { labelClicked("yellow", "label"); }
		})
	})
	testKeysPage("settings");
}

// Method Called when the Label is clicked
function labelClicked(color, caller) {
	var play  = $("#"+color+"_play");
	var label = $("#"+color+"_label");
	var left  = $("#"+color+"LeftInput");
	var right = $("#"+color+"RightInput");
	
	if(caller == 'check') {
		if(play.is(':checked') == true) {
			label.css('color', color);
			label.css('background', 'white');
			left.show("fade");
			right.show("fade");
		} else {
			label.css('color', 'white');
			label.css('background', 'lightgray');
			left.hide("fade");
			right.hide("fade");
		}
	} else if(caller == 'label') {
		if(play.is(':checked') == true) {
			label.css('color', 'white');
			label.css('background', 'lightgray');
			play.attr('checked', false);
			left.hide("fade");
			right.hide("fade");
		} else {
			label.css('color', 'white');
			label.css('background', color);
			play.attr('checked', true);
			left.show("fade");
			right.show("fade");
		}
	}
}

$(document).ready(function() {
   /**
	* Adding Checkbox click event &&
    * Adding Label Click event &&
    * Hiding Original Inputs &&
    * Adding KeyPress Event to Inputs
	*/
   $.each(colors, function(){
	   var color = this;
		$("#"+color+"_play").click(function()    { labelClicked(color, "check"); });
		$("#"+color+"_label").click(function()	{ labelClicked(color, "label"); });
		$.each(["Right", "Left"], function(){
			var direction = this;
			$("#"+color+direction+"Input").keypress(function(e) {
				setMoveKey(color, direction.toLowerCase(), event.keyCode, event.charCode);
			});
			$("#"+color+direction+"Input").hide();
		})
   })
	testSettingsPage()
});

function setMoveKey(color, direction, keyCode, charCode) {
	if(keyCode != 9) {
		$("#"+color+capitalize(direction)+"Input").val("");
	}
}

function settings() {
	if(!onPause)
		pause();
	
	var options = "status=0, ";
	options += "toolbar=0, ";
	options += "location=0, ";
	options += "menubar=0, ";
	options += "directories=0, ";
	options += "resizable=0, ";
	options += "scrollbars=0, ";
	options += "height=600, ";
	options += "width=400";
	
	window.open("settings.php", "Settings Window", options);
}

function save() {
	/**
	* Save the options
	*/
	var message = "Method to store configuration is not yet implemented, ooops!";
	alert(message);
	window.close();
}

function testSettingsPage() {
	getDbSettings();
}

function showSettingsData(settings) {
	console.log(settings);
	players = settings;
	loadInitialValues();
}

function capitalize(toCapitalize) {
	var str = toCapitalize;
	return str.substr(0,1).toUpperCase() + str.substr(1);
}