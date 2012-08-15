/*
* Sound Functions
*/

var soundOn = true;

function soundSwitcher()
{
	soundOn = !soundOn;		
	
	if(!soundOn)
		$("#soundButton").val("Sound Off");
	else
		$("#soundButton").val("Sound On");

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


