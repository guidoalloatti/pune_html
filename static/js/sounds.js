/*
* Sound Functions
*/



function soundSwitcher()
{
	soundOn = !soundOn;
	
	if(!soundOn) {
		$("#soundImage").html('<a  onclick="soundSwitcher();"><img src="images/check.png" alt="Sound is OFF" width="32" height="32" border="0" /></a>');
        //$("#soundButton").val("Turn Sound On");
		$("#soundStatus").html("Sound is OFF");
        $("#log").text($("#log").text()+"\nSound is OFF");
	} else {
        $("#soundImage").html('<a onclick="soundSwitcher();"><img src="images/uncheck.png" alt="Sound is OON" width="32" height="32" border="0" /></a>');
		//$("#soundButton").val("Turn Sound Off");
		$("#soundStatus").html("Sound is ON");
        $("#log").text($("#log").text()+"\nSound is ON");
	}
}

function pauseSwitcher()
{
	pauseOn = !pauseOn;

	if(!pauseOn) {
		$("#pauseImage").html('<a  onclick="pauseSwitcher();"><img src="images/check.png" alt="Pause is OFF" width="32" height="32" border="0" /></a>');
		$("#pauseStatus").html("Pause is OFF");
        $("#log").text($("#log").text()+"\nPause is OFF");
        pause();
	} else {
        $("#pauseImage").html('<a onclick="pauseSwitcher();"><img src="images/uncheck.png" alt="Pause is ON" width="32" height="32" border="0" /></a>');
		$("#pauseStatus").html("Pause is ON");
        $("#log").text($("#log").text()+"\nPause is ON");
        pause();
	}
}

function playSound(audio) 
{
	if(soundOn)
	{
		var audio = new Audio("sounds/" + audio + ".mp3");
		audio.play();
		
		//document.getElementById(action).innerHTML = '<object data="sounds/'+action+'.mp3" type="audio/mpeg" width="30" height="4" style="color:'+action+';"></object>';
	}	
}


