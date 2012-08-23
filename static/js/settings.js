
function loadInitialValues() {
	$.each(players, function(index, setting) {
		$.each(setting, function(key, value) {
			if(key == "player_1" && value == 1) { labelClicked("red", "label"); }
			if(key == "player_2" && value == 1) { labelClicked("blue", "label"); }
			if(key == "player_3" && value == 1) { labelClicked("green", "label"); }
			if(key == "player_4" && value == 1) { labelClicked("purple", "label"); }
			if(key == "player_5" && value == 1) { labelClicked("cyan", "label"); }
			if(key == "player_6" && value == 1) { labelClicked("yellow", "label"); }
			if(key == "hole_points")  $("#hole_points").val(value);
			if(key == "start_speed")  $("#speed").val(value);
			if(key == "gap_space" )   $("#gap_spacing").val(value);
			if(key == "gap_size" )    $("#gap_sizing").val(value);
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
		$("#"+color+"_label").click(function()	 { labelClicked(color, "label"); });
		$.each(["Right", "Left"], function(){
			var direction = this;
			$("#"+color+direction+"Input").keypress(function(e) {
				setMoveKey(color, direction.toLowerCase(), e.keyCode, getCharFromKeyCode(e.keyCode));
			});
			$("#"+color+direction+"Input").hide();
		})
   })
	testSettingsPage()
});

function setMoveKey(color, direction, keyCode, charCode) {

	/*
	console.log(color);
	console.log(direction);
	console.log(keyCode);
	console.log(charCode);
	console.log("#"+color+capitalize(direction)+"Input");
	console.log($("#"+color+capitalize(direction)+"Input"));
	*/

	if(keyCode != 9) {
		$("#"+color+capitalize(direction)+"Input").attr("value", "");
		//$("#"+color+capitalize(direction)+"Input").attr("value", charCode);
		$("#"+color+capitalize(direction)+"Input").attr("name", keyCode);
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
	var settings = { hole_points : $("#hole_points").val(),
 					 start_speed : $("#speed").val(),
					 gap_space   : $("#gap_spacing").val(),
					 gap_size    : $("#gap_sizing").val(),
					 player_1    : $("#red_play").is(":checked"),
					 player_2    : $("#blue_play").is(":checked"),
					 player_3    : $("#green_play").is(":checked"),
					 player_4    : $("#purple_play").is(":checked"),
					 player_5    : $("#cyan_play").is(":checked"),
					 player_6    : $("#yellow_play").is(":checked")
	}

	var keys = { red_r      : $("#redRightInput").attr("name"), //val(),
				 red_l      : $("#redLeftInput").attr("name"), //val(),
				 blue_r     : $("#blueRightInput").attr("name"), //val(),
				 blue_l     : $("#blueLeftInput").attr("name"), //val(),
				 green_r    : $("#greenRightInput").attr("name"), //val(),
				 green_l    : $("#greenLeftInput").attr("name"), //val(),
				 purple_r   : $("#purpleRightInput").attr("name"), //val(),
				 purple_l   : $("#purpleLeftInput").attr("name"), //val(),
				 cyan_r     : $("#cyanRightInput").attr("name"), //val(),
				 cyan_l     : $("#cyanLeftInput").attr("name"), //val(),
				 yellow_r   : $("#yellowRightInput").attr("name"), //val(),
				 yellow_l   : $("#yellowLeftInput").attr("name") //val()
	}

	console.log(keys);

	saveSettings(1, settings);
	saveKeys(1, keys);
	alert("Settings Properly Saved!");
	window.close();
}

function testSettingsPage() {
	getDbSettings("id");
}

function showSettingsData(settings) {
	//console.log(settings);
	players = settings;
	loadInitialValues();
}

function capitalize(toCapitalize) {
	var str = toCapitalize;
	return str.substr(0,1).toUpperCase() + str.substr(1);
}