
//var keys = new array(6);


function labelClicked(color, caller)
{
	switch(color)
	{
		case 'red': 
			var play = $("#red_play");
			var label = $("#red_label");
			var left = $("#red_left");
			var right = $("#red_right");
			break;
		case 'blue': 
			var play = $("#blue_play");
			var label = $("#blue_label");
			var left = $("#blue_left");
			var right = $("#blue_right");
			break;
		case 'green': 
			var play = $("#green_play");
			var label = $("#green_label");
			var left = $("#green_left");
			var right = $("#green_right");
			break;
		case 'purple': 
			var play = $("#purple_play");
			var label = $("#purple_label");
			var left = $("#purple_left");
			var right = $("#purple_right");
			break;
		case 'cyan': 
			var play = $("#cyan_play");
			var label = $("#cyan_label");
			var left = $("#cyan_left");
			var right = $("#cyan_right");
			break;
		case 'yellow': 
			var play = $("#yellow_play");
			var label = $("#yellow_label");
			var left = $("#yellow_left");
			var right = $("#yellow_right");
			break;
		default: 
			break;
	}
	if(caller == 'check')
	{
		if(play.is(':checked') == true)
		{
			label.css('color', color);
			label.css('background', 'white');
			left.show("fade");
			right.show("fade");
		}
		else
		{
			label.css('color', 'white');
			label.css('background', 'lightgray');
			left.hide("fade");
			right.hide("fade");
		}
	}
	else if(caller == 'label')
	{
		if(play.is(':checked') == true)
		{
			label.css('color', 'white');
			label.css('background', 'lightgray');
			play.attr('checked', false);
			left.hide("fade");
			right.hide("fade");
		}
		else
		{
			label.css('color', 'white');
			label.css('background', color);
			play.attr('checked', true);
			left.show("fade");
			right.show("fade");
		}
	}
} 

$(document).ready(function()
{
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
	
	/*
	$("input:hidden").each(function(i) {
		this.id = this.id + "_" + i;
		alert(this.id);
    });
	*/
	
});

function setMoveKey(color, direction, keyCode, charCode)
{
	/*
	$("input:hidden").each(function(i) {
		this.id = this.id + "_" + i;
		alert(this.id+"\n"+this.val()+"\n"+this.text());
    });
	*/
	
	if(keyCode != 9)
	{
		$("#"+color+"_"+direction).val("");
		$("#"+color+"_"+direction+"_value").val(keyCode);
	}
	//alert("Character: "+$("#"+color+"_"+direction).val()+"\nNumber: "+$("#"+color+"_"+direction+"_value").val());
}

function disableKeys()
{
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

function settings()
{
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

function save()
{
	/**
	* Save the options to the XML File
	*/
	pindonga = "poasadasdsad";
	alert(pindonga);
	window.close();
}

