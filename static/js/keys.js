document.onkeydown = onEventDown;
document.onkeypress = onEventPress; 
document.onkeyup = onEventUp;

function clearKeys() {
	$.each(players, function(){
		player = this;
		if(typeof(player.leftKey) !== 'undefined' && typeof(player.rightKey) !== 'undefined' ) {
			keysBeenPressed[player.leftKey] = false;
			keysBeenPressed[player.rightKey] = false;
		}
	});
}

function clearWormKeys(currentWorm) {
	if(typeof(currentWorm.leftKey) !== 'undefined' && typeof(currentWorm.rightKey) !== 'undefined' ) {
		keysBeenPressed[currentWorm.leftKey] = false;
		keysBeenPressed[currentWorm.rightKey] = false;
	}
}

function onEventPress(event) {
	if(event == null) keyCode = window.event.keyCode; 
	else keyCode = event.keyCode; 
	
	// Set and unset pause and speeding
	if(keyCode == 32) pauseSwitcher();
	else if(keyCode == 34) doSpeeding();
	else if(keyCode == 33) reduceSpeeding();
	if(!onPause && gameHasStarted && keyIsDefined(keyCode)) {
		keysBeenPressed[keyCode] = true;
	}
}

function onEventDown(event) {
}

function onEventUp(event) {
	if(event == null) keyCode = window.event.keyCode; 
	else keyCode = event.keyCode; 
	keysBeenPressed[keyCode] = false;
}

function getKey(currentWorm, direction) {
	if(direction == "right") return currentWorm.rightKey;
	else if (direction == "left") return currentWorm.leftKey;
}

function evalKeyPress(currentWorm, direction) {
	if(keysBeenPressed[getKey(currentWorm, direction)]) 
		changeAngle(direction, currentWorm);
}

function modifyWormsAngle() {
	if(gameHasStarted) {
		$.each(players, function() {
			if(this.playing && this.alive) { 
				evalKeyPress(this, "right");
				evalKeyPress(this, "left");
			}
		});
	}
}

function testKeysPage(source) {
	getDbKeys(source);
}

function showAjaxData(data, source){
	console.log("Into showAjaxData")
	console.log(data)
	console.log(source)
	getKeysArray(data, source);
}

function getKeysArray(keys, source) {
	console.log("Into getKeysArray")
	console.log(keys)
	console.log(source)

	if(source == "main") {
		usingDefaultKeys = false;



		$.each(keys, function() {
			$.each(this, function(key, value) {
				var i = 0;
				$.each(colors, function(){
					if(key == this+"_r") {
						currentKeys[i]["right"] = value;

					} if(key == this+"_l") {
						currentKeys[i]["left"] = value;
					}
					i++;
				})
			})
		})
		$("#log").text($("#log").text()+"\nNow using custom Keys!");

		// var keys = defaultKeys;
		//if(!usingDefaultKeys) 
		console.log(currentKeys);
		keys = currentKeys;

		$.each(keys, function(index, key) {
			// console.log("==========================================")
			// console.log(index)
			// console.log(key)
			// console.log("Worm: " + key["color"])
			// console.log("left: " + getCharFromKeyCode(key["left"]))
			// console.log("right: " + getCharFromKeyCode(key["right"]))

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

