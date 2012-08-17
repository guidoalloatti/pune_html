
// Method Called when the Label is clicked
function labelClicked(color, caller) {
	var play  = $("#"+color+"_play");
	var label = $("#"+color+"_label");
	var left  = $("#"+color+"_left");
	var right = $("#"+color+"_right");
	
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
	}
	else if(caller == 'label') {
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
	disableKeys();
   /**
	* Clicking on Input Functionality
	*/
	$("#red_label").click(function()	{	labelClicked("red", "label");	});	
	$("#blue_label").click(function()	{	labelClicked("blue", "label");	});
	$("#green_label").click(function()	{	labelClicked("green", "label");	});
	$("#purple_label").click(function()	{	labelClicked("purple", "label");});
	$("#cyan_label").click(function()	{	labelClicked("cyan", "label");	});	
	$("#yellow_label").click(function()	{	labelClicked("yellow", "label");});
	
   /**
	* Clicking on Checkbox Functionality
	*/
	$("#red_play").click(function() 	{	labelClicked("red", "check");	});	
	$("#blue_play").click(function() 	{	labelClicked("blue", "check");	});
	$("#green_play").click(function() 	{	labelClicked("green", "check");	});
	$("#purple_play").click(function() 	{	labelClicked("purple", "check");});
	$("#cyan_play").click(function() 	{	labelClicked("cyan", "check");	});
	$("#yellow_play").click(function() 	{	labelClicked("yellow", "check");});	
	
	/** 
	* The Keys Can Be Only One Char
	*/
	$("#red_left").keypress(function(e)		{	setMoveKey("red", "left", event.keyCode, event.charCode); 		});
	$("#red_right").keypress(function(e)	{	setMoveKey("red", "right", event.keyCode, event.charCode); 		});
	$("#blue_left").keypress(function(e)	{	setMoveKey("blue", "left", event.keyCode, event.charCode); 		});
	$("#blue_right").keypress(function(e)	{	setMoveKey("blue", "right", event.keyCode, event.charCode); 	});
	$("#green_left").keypress(function(e)	{	setMoveKey("green", "left", event.keyCode, event.charCode); 	});
	$("#green_right").keypress(function(e)	{	setMoveKey("green", "right", event.keyCode, event.charCode); 	});
	$("#purple_left").keypress(function(e)	{	setMoveKey("purple", "left", event.keyCode, event.charCode); 	});
	$("#purple_right").keypress(function(e)	{	setMoveKey("purple", "right", event.keyCode, event.charCode); 	});
	$("#cyan_left").keypress(function(e)	{	setMoveKey("cyan", "left", event.keyCode, event.charCode); 		});
	$("#cyan_right").keypress(function(e)	{	setMoveKey("cyan", "right", event.keyCode, event.charCode); 	});
	$("#yellow_left").keypress(function(e)	{	setMoveKey("yellow", "left", event.keyCode, event.charCode); 	});
	$("#yellow_right").keypress(function(e)	{	setMoveKey("yellow", "right", event.keyCode, event.charCode); 	});
		
});

function setMoveKey(color, direction, keyCode, charCode) {
	if(keyCode != 9) {
		$("#"+color+"_"+direction).val("");
		$("#"+color+"_"+direction+"_value").val(keyCode);
	}
}

function disableKeys() {
	$("#red_left").hide();
	$("#red_right").hide();
	$("#blue_left").hide();
	$("#blue_right").hide();
	$("#green_left").hide();
	$("#green_right").hide();
	$("#purple_left").hide();
	$("#purple_right").hide();
	$("#cyan_left").hide();
	$("#cyan_right").hide();
	$("#yellow_left").hide();
	$("#yellow_right").hide();
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