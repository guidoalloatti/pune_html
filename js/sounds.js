/*
* Sound Functions
*/

//var soundOn = true;

function soundSwitcher()
{
	soundOn = !soundOn;		
	
	if(!soundOn)
		$("#soundButton").val("Sound Off");
	else
		$("#soundButton").val("Sound On");

}

function playSound(action) 
{
	if(soundOn)
		document.getElementById(action).innerHTML= '<object data="sounds/'+action+'.mp3" type="audio/mpeg" width="5" height="5" hidden="true"></object>';
}


