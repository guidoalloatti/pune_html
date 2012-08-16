function clearKeys()
{
	keysBeenPressed = new Array(512);
}

document.onkeyup = function(event)
{
	if(event == null)
		keyCode = window.event.keyCode; 
	else 
		keyCode = event.keyCode; 
	
	keysBeenPressed[keyCode] = false;
}

document.onkeydown = function(event)
{  
	if(event == null)
		keyCode = window.event.keyCode; 
	else 
		keyCode = event.keyCode; 

	/* Set and unset pause and speeding */
	if(keyCode == 32)
        pauseSwitcher();
	else if(keyCode == 34)
		doSpeeding();
	else if(keyCode == 33)
		reduceSpeeding();
		
	keysBeenPressed[keyCode] = true;
}

function modifyWormsAngle()
{
	
	/* Red Worm Moving */
	if(players[0])
	{
		if(keysBeenPressed[49])
			worms[0] = changeAngle("right", worms[0]);
		if(keysBeenPressed[192])
			worms[0] = changeAngle("left", worms[0]);	
	}
	
	/* Blue Worm Moving */
	if(players[1])
	{
		if(keysBeenPressed[88])
			worms[1] = changeAngle("right", worms[1]);
		if(keysBeenPressed[90])
			worms[1] = changeAngle("left", worms[1]);
	}
	
	/* Green Worm Moving */
	if(players[2])
	{
		if(keysBeenPressed[86])
			worms[2] = changeAngle("right", worms[2]);
		if(keysBeenPressed[66])
			worms[2] = changeAngle("left", worms[2]);
	}
	
	/* Purple Worm Moving */
	if(players[3])
	{
		if(keysBeenPressed[54])
			worms[3] = changeAngle("right", worms[3]);
		if(keysBeenPressed[55])
			worms[3] = changeAngle("left", worms[3]);
	}
		
	/* Cyan Worm Moving */
	if(players[4])
	{
		if(keysBeenPressed[222])
			worms[4] = changeAngle("right", worms[4]);
		if(keysBeenPressed[187])
			worms[4] = changeAngle("left", worms[4]);
	}
			
	/* Yellow Worm Moving */
	if(players[5])
	{
		if(keysBeenPressed[39])
			worms[5] = changeAngle("right", worms[5]);
		if(keysBeenPressed[40])
			worms[5] = changeAngle("left", worms[5]);
	}
			
}