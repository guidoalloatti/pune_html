/*
* Sound Functionality
* Pause Functionality
*/

function soundSwitcher() {
	soundOn = !soundOn;
	
	if(!soundOn) {
		$("#soundImage").html('<a  onclick="soundSwitcher();"><img src="images/check.png" alt="Sound is OFF" width="32" height="32" border="0" /></a>');
		$("#soundStatus").html("Sound is OFF");
		$("#log").text($("#log").text()+"\nSound is OFF");
	} else {
		 $("#soundImage").html('<a onclick="soundSwitcher();"><img src="images/uncheck.png" alt="Sound is ON" width="32" height="32" border="0" /></a>');
		$("#soundStatus").html("Sound is ON");
		$("#log").text($("#log").text()+"\nSound is ON");
	}
}

function playSound(audio) {
	if(soundOn) {
		var audio = new Audio("sounds/" + audio + ".mp3");
		audio.play();
	}
}

function pauseSwitcher() {
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

//Pause Function
function pause() {
	onPause = !onPause;
	playSound("pause");
}