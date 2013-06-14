function clearKeys() {
	keysBeenPressed = new Array(512);
}

document.onkeyup = function(event) {
	if(event == null) keyCode = window.event.keyCode; 
	else KeyCode = event.keyCode; 
	keysBeenPressed[keyCode] = false;
}

document.onkeydown = function(event) {
	if(event == null) keyCode = window.event.keyCode; 
	else keyCode = event.keyCode; 
	
	/* Set and unset pause and speeding */
	if(keyCode == 32) pauseSwitcher();
	else if(keyCode == 34) doSpeeding();
	else if(keyCode == 33) reduceSpeeding();
	keysBeenPressed[keyCode] = true;
}

function getKey(index, direction) {
	/* TODO: We have 3 set of keys:
	 *    1. DefaultKeys -> Predefined and used when a game starts
	 *    2. CustomKeys  -> Keys defined by the user
	 *    3. CurrentKeys -> Keys that are in use for the game
	 */
	//var keys = defaultKeys;
	//if(!usingDefaultKeys) {
	//	keys = currentKeys;
	//}
	//console.log("getKey");
	return currentKeys[index][direction];
}

function evalKeyPress(i, direction) {
	console.log("asads");
	if(keysBeenPressed[getKey(i, direction)])
		players[i] = changeAngle(direction, players[i]);
}

function modifyWormsAngle() {
	if(gameHasStarted) {
		$.each(players, function() {
			if(this.playing && this.alive) {   // && this.defaultKeys) {
				evalKeyPress(i, "right");
				evalKeyPress(i, "left");
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


