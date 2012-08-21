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
	getDbKeys();
}

function showAjaxData(data){
	getKeysArray(data);
	console.log(currentKeys);
}

function getKeysArray(keys) {
	currentKeys = keys;
	//var keysArray = new Array();
	//$.each(keys, function() {
	//	currentKeys.push(this);
		//$.each(this, function(i, val) {
		//currentKeys.push({})
		//keysArray.push({ i : val });
		//})
	//})
	//return keysArray;
}