function clearKeys() {
	keysBeenPressed = new Array(512);
}

document.onkeyup = function(event) {
	if(event == null)
		keyCode = window.event.keyCode; 
	else 
		keyCode = event.keyCode; 
	
	keysBeenPressed[keyCode] = false;
}

document.onkeydown = function(event) {
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

function getKey(index, direction) {
	//console.log(index, direction, defaultKeys, defaultKeys[index][direction]);
	if(worms[index].defaultKeys) 
		return defaultKeys[index][direction];
}

function evalKeyPress(i, direction) {
	if(keysBeenPressed[getKey(i, direction)])
		worms[i] = changeAngle(direction, worms[i]);
}

function modifyWormsAngle() {
	for(var i = 0; i < 5; i++) {
		if(worms[i].playing) {
			if(worms[i].defaultKeys) {
				evalKeyPress(i, "right");
				evalKeyPress(i, "left");
			}
		}
	}
}

function testKeysPage() {
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

	window.open("model/keys.php", "Keys Window", options);
}
