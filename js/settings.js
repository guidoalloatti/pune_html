
$(document).ready(function()
{
	disableKeys();
});

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
	/*
	if($("#save_on_close").is(':checked') == true)
	{
		alert($("#save_on_close").is(':checked'));
		if(onPause)
			pause();
	}
	*/
	window.close();
}

function player_selected(color)
{
	if(color == "blue")
	{
		$("#blue_left").hide();
		$("#blue_right").hide();
	}
}