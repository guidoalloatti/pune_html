document.onkeydown = onEventDown;
document.onkeypress = onEventPress; 
document.onkeyup = onEventUp;

function clearKeys() {
	$.each(players, function(){
		if(typeof(this.leftKey) !== 'undefined' && typeof(this.rightKey) !== 'undefined' ) {
			keysBeenPressed[this.leftKey] = false;
			keysBeenPressed[this.rightKey] = false;
		}
	});
}

function onEventPress(event) {
	if(event == null) keyCode = window.event.keyCode; 
	else keyCode = event.keyCode; 
	/* Set and unset pause and speeding */
	if(keyCode == 32) pauseSwitcher();
	else if(keyCode == 34) doSpeeding();
	else if(keyCode == 33) reduceSpeeding();
	if(!onPause && gameHasStarted && keyIsDefined(keyCode)) {
		keysBeenPressed[keyCode] = true;
	}
}



function onEventDown(event) {
	if(event == null) keyCode = window.event.keyCode; 
	else keyCode = event.keyCode; 
	if(!onPause && gameHasStarted && keyIsDefined(keyCode)) {
		keysBeenPressed[keyCode] = true;
	}
}

function onEventUp(event) {
	if(event == null) keyCode = window.event.keyCode; 
	else KeyCode = event.keyCode; 
	
	clearKeys();
	keysBeenPressed[keyCode] = false;
	}


function getKey(index, direction) {
	if(currentKeys[index][direction] != '' && typeof(currentKeys[index][direction]) !== 'undefined') {
		return currentKeys[index][direction];
	} else {
		return defaultKeys[index][direction];
	}
}

function evalKeyPress(i, direction) {
	currentWorm = players[i];
	if(keysBeenPressed[getKey(i, direction)]) changeAngle(direction, currentWorm);
}

function modifyWormsAngle() {
	if(gameHasStarted) {
		$.each(players, function() {
			if(this.playing && this.alive) { 
				evalKeyPress(this.index, "right");
				evalKeyPress(this.index, "left");
			}
		});
	}
}

function testKeysPage(source) {
	getDbKeys(source);
}

function showAjaxData(data, source){
	getKeysArray(data, source);
}

function getKeysArray(keys, source) {
	console.log(keys);
	console.log(source);

	if(source == "main") {
		usingDefaultKeys = false;
		$.each(keys, function() {
			$.each(this, function(key, value) {
				var i = 0;
				$.each(colors, function(){
					if(key == this+"_r") currentKeys[i]["right"] = value;
					if(key == this+"_l") currentKeys[i]["left"] = value;
					i++;
				})
			})
		})
		$("#log").text($("#log").text()+"\nNow using custom Keys!");

		var keys = defaultKeys;
		if(!usingDefaultKeys) keys = currentKeys;

		$.each(keys, function(index, key) {
			$("#"+key["color"]+"RightButton").val(getCharFromKeyCode(key["right"]));
			$("#"+key["color"]+"LeftButton").val(getCharFromKeyCode(key["left"]));
		})
	} else if(source == "settings") {
		usingDefaultKeys = false;
		$.each(keys, function() {
			$.each(this, function(key, value) {
				var i = 0;
				$.each(colors, function(){
					if(key == this+"_r") currentKeys[i]["right"] = value;
					if(key == this+"_l") currentKeys[i]["left"] = value;
					i++;
				})
			})
		})
		$("#log").text($("#log").text()+"\nNow using custom Keys!");

		var keys = defaultKeys;
		if(!usingDefaultKeys) keys = currentKeys;

		$.each(keys, function(index, key) {
			$("#"+key["color"]+"RightInput").val(getCharFromKeyCode(key["right"]));
			$("#"+key["color"]+"RightInput").attr("name", key["right"]);

			$("#"+key["color"]+"LeftInput").val(getCharFromKeyCode(key["left"]));
			$("#"+key["color"]+"LeftInput").attr("name", key["left"]);
		})
	}
}

function getCharFromKeyCode(keyCode) {
	return String.fromCharCode(keyCode);
}

function keyIsDefined(keyCode) {
	//console.log(players);
	var keyFound = false;
	$.each(players, function(){
		if((typeof(this.leftKey) !== 'undefined' && typeof(this.rightKey) !== 'undefined' ) &&
		  (this.leftKey == keyCode || this.rightKey == keyCode)) {
			keyFound = true;
		}
	});
	return keyFound;
}

