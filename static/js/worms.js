// Starting the Game when page is Ready
$(document).ready(function() {
	//$("#canvas_div").hide();
	// Setting dev instance with no settings in the beginning
	$(this).dialog( "close" );
	$(".demo").hide();
	//$("#canvas_div").show();
	//startGame();
});

// The Function that starts the game including canvas and game
function startGame(colors) {
	context = loadCanvasContext();
	marker  = loadMarkerCanvas();

	if(context && marker) {
		isNewRound = false;

		//Set the keysBeenPressed
		$.each(players, function(){
			if(typeof(this.leftKey) !== 'undefined') keysBeenPressed[this.leftKey] = false;
			if(typeof(this.rightKey) !== 'undefined' ) keysBeenPressed[this.rightKey] = false;
		});
		
		start(colors);
		setRound();
		doSpeeding();
		isNewRound = true;
		speed = startingSpeed;
		$("#rounds").text("1");
		changeInterval(speed);
		setKeyHelp();
	} else {
		alert("Cannot Load Canvas");
	}
}

// This Function Shows how to move (should be shown from the XML)
function explainHowToMove() {
	message += "Red";
	message += "\nBlue";
	message += "\nGreen";
	message += "\nPurple";
	message += "\nCyan";
	message += "\nYellow";
	addMessage(message, "howto");
}

// Function that modify the angle of the moving worm
function changeAngle(direction, currentWorm) {
	if(direction == "left") {
		if((currentWorm.angle-angleStepSize) <= 0)
			currentWorm.angle = angleMax+(currentWorm.angle);
			currentWorm.angle-=angleStepSize; 
	} else if(direction == "right") {
		if((currentWorm.angle+angleStepSize) >= angleMax)
			currentWorm.angle = 0-(angleMax-currentWorm.angle);
			currentWorm.angle+=angleStepSize;
	}
	return currentWorm;
}

// Worm Object Definition
function worm() {
	this.color;
	this.x;
    this.y;
	this.previousX 		= new Array(historyDotsSaved);
	this.previousY 		= new Array(historyDotsSaved);
	this.previousHole 	= new Array(historyDotsSaved);
	this.alive 			= false;
	this.playing 		= false;
	this.score 			= 0;
	this.length 		= 0;
	this.defaultKeys 	= true;
	this.lastHoleStarted = 0;
	this.leftKey;
	this.rightKey;
	this.angle;
	this.index			= 0;
	this.holeScore		= 0;
}

//function startGame(){
//}

//function startRound(){
//}

// Starting the contexts, set speeding and start Worms
function start(colors) {
	setConfigurationOptions();
	setContextProperties();
	setMarkerProperties();	
	context.fillRect(0, 0, xMax, yMax);
	marker.fillRect(xMax, 0, xMax+100, yMax);
	drawMarkers();
	$("#speed").text("Current Speed: "+speed);
	startWorms(colors);
}

// Setting options from the configuration modal
function setConfigurationOptions() {
	// Speed
	if(modalSpeed == "Slow") { startingSpeed = 15; }
	else if(modalSpeed == "Normal") { startingSpeed = 30; }
	else if(modalSpeed == "Frantic") { startingSpeed = 45; }
	
	// Gap Spacing
	if(gapSpacing == "Close") { spaceBetweenHoles = 75; }
	else if(gapSpacing == "Normal") { spaceBetweenHoles = 100; }
	else if(gapSpacing == "Far Apart") { spaceBetweenHoles = 125; }
	
	// Gap Sizing
	if(gapSizing == "Small") { holeSize = 10; }
	else if(gapSizing == "Normal") { holeSize = 20; }
	else if(gapSizing == "Large") { holeSize = 30; }
}

// Start each individual Worm
function startWorms(colors) {
	// First Time Game Starts
	if(!gameHasStarted && typeof(colors) !== 'undefined') {
		$.each(colors, function() {
			startWorm(this);
		});
	}
	
	$.each(players, function() {
		if(this.playing) {
			startWorm(this.color);
		}
	});
	drawScore();
}

// Start a worm each round
function startWorm(color) {
	color = color.toString();
	x 		= Math.floor(Math.random()*xMax);
	y 		= Math.floor(Math.random()*yMax);
	angle 	= Math.floor(Math.random()*angleMax);
	i 		= getWormIndexByColor(color);
	
	if(x < borderSeparation) x+=borderSeparation;
	if(x > (xMax-borderSeparation)) x-=borderSeparation;
	if(y < borderSeparation) y+=borderSeparation;
	if(y > (yMax-borderSeparation)) y-=borderSeparation;
	
	if(!isNewRound || !gameHasStarted) {
		players[i] 			= new worm;
		players[i].score 	= 0;
	}

	players[i].x 			= x;
	players[i].y 			= y;
	players[i].angle 		= angle;
	players[i].color 		= color;
	players[i].alive 		= true;
	players[i].playing 		= true;
	players[i].length 		= 0;
	players[i].leftKey      = currentKeys[i].left;   //getKey(i, "left");
	players[i].rightKey		= currentKeys[i].right;  //getKey(i, "right");
	players[i].index 		= i;
}

// This function gets the worm who is winning with it size
function getLongestWorm() {
	$.each(players, function() {		
		if( this.playing && this.alive && this.length > longestWormSize) {
			longestWorm       = this;
			longestWormSize   = this.length;
			longestWormColor  = this.color;
			message = "Longest Worm: "+ longestWormColor;
			addMessage(message, "longest");
			message = "Size: "+ (longestWormSize/10) +" cm";  
			addMessage(message, "longest_size");
		}
	});
}

// Set Time interval (must not exists any more when render will be implemented)
function changeInterval(speed) {
	fps = speed+basicFPSValue;
	clearInterval(interval);
	if(!onPause) interval = setInterval(moveWorms, intervalMiliSeconds/fps);
}

// This function do the real speeding
function doSpeeding() {
	playSound("speeding");
	speed += speedingIncrementSpeed;
	changeInterval(speed);
	addMessage("Current Speed: "+speed, "speed");
}

// This function do the real speeding reduce
function reduceSpeeding() {
	playSound("ohh");
	speed -= speedingIncrementSpeed;
	changeInterval(speed);
	addMessage("Current Speed: "+speed, "speed");
}

// This function evaluates and if random numbers matchs speeds
function speeding() {
	random_1 = Math.floor(Math.random()*(speedingChance+speed));
	random_2 = (speedingChance+speed) - Math.floor(Math.random()*(speedingChance+speed));
	if(random_1 == random_2)
		doSpeeding();
}

// This function move each worm and is called in the time interval
function moveWorms() {
	if(onPause) return;
	
	speeding();
	modifyWormsAngle();
	
	$.each(players, function() {	
		if(gameHasStarted && this.playing && this.alive) moveWorm(this);
	});
} 

// Add the score to all non dead worms
function addScore() {
	$.each(players, function() {
		if(this.playing && this.alive) this.score++;
	});
}

// Determines wich worms are alive
function getWormsAlive() {
	wormsAlive = 0;
	$.each(players, function() {
		if(this.playing && this.alive)
			wormsAlive++;
	});
}

// Get the highest Score and the Winning Worm
function getMaxScore() {
	maxScore = 0;
	$.each(players, function() {
		if(	this.playing && this.score > maxScore) {
			maxScore = this.score;
			winningWorm = this.color;
		}
	});
}

// Get the score needed to win the match
function getScoreToWin() {
	scoreToWin = -10;
	$.each(players, function() {
		if(this.playing)
			scoreToWin+=10;
	});
}

// Calculates if the worm crush with other worm, also play yabass if passed through a hole
function isWormHit(currentWorm) {
	radians = currentWorm.angle*(Math.PI/180);
	sin = Math.sin(radians*sizeMultiplier);
	cos = Math.cos(radians*sizeMultiplier);

	x = currentWorm.x+(cos*(Math.PI*2));
	y = currentWorm.y+(sin*(Math.PI*2));

	imageArray = context.getImageData(x, y, 1, 1);
	var redValue = imageArray.data[0];
	var greenValue = imageArray.data[1];
	var blueValue = imageArray.data[2];
	var alphaValue = imageArray.data[3];
	
	if(redValue != 0 || greenValue != 0 || blueValue != 0) {
		if( redValue < 3 && greenValue < 3 && blueValue < 3) {
			playSound("yabass");
			if(holePoints == "One") { 
				currentWorm.holeScore += 1;
				if(currentWorm.holeScore > 3) {
					currentWorm.holeScore = 0;
					currentWorm.score += 1;
					drawMarkers();
					drawScore();
				}
			}
		} else {
			return true;
		}
	}
	
	return false;
}

// Stablish the current round
function setRound() {
	currentRound++;
	speed = startingSpeed;
	changeInterval(speed);
	addMessage("Current Round: "+currentRound, "rounds");
	addMessage("Current Speed: "+speed, "speed");
}

// Huge function, move a worm, evaluate if the worm has crushed 
function moveWorm(currentWorm) {
	wormHasCrush = isWormHit(currentWorm);

	if(currentWorm.x+wormSize > xMax || 
	   currentWorm.x-wormSize < 0 || 
	   currentWorm.y+wormSize > yMax || 
	   currentWorm.y-wormSize < 0 || 
	   wormHasCrush)
		  wormCrushes(currentWorm);
	else
		  wormIsAlive(currentWorm);
}	

// The worm has not crush and can move
function wormIsAlive(currentWorm) {
	radians = currentWorm.angle*(Math.PI/180);
	sin = Math.sin(radians*sizeMultiplier);
	cos = Math.cos(radians*sizeMultiplier);
	storePreviuosCoordinates(currentWorm);
	currentWorm.y += sin;
	currentWorm.x += cos;

	if(currentWorm.alive && currentWorm.playing) {
		drawWorm(currentWorm);
	}
}
	
// The worm is dead, so we need to kill her	
function wormCrushes(currentWorm) {
	playSound("die");
	currentWorm.alive = false;
	getLongestWorm();
	addScore();
	getWormsAlive();
	
	if(wormsAlive < 2) lastWormCrushes(currentWorm);

	drawMarkers();
	drawScore();
	getLongestWorm();
}

// The last worm is dead, needs to start a new round and maybe a new match
function lastWormCrushes(currentWorm) {
	clearKeys();
	getMaxScore();
	getScoreToWin();
	setRound();

	if(maxScore >= scoreToWin) matchOver(currentWorm);
	else roundOver(currentWorm);
}

// This function is called when the match is over
function matchOver(currentWorm) {
	playSound("win");
	currentRound = 0;
	isNewRound = false;
	alert("Winner!\nThe champion worm with "+maxScore+" points is....\nThe glorious "+winningWorm+" worm!!");
	startGame();
}

// This function is called when the round is over
function roundOver(currentWorm) {
	yMarker = 0;
	playSound(winningWorm);
	start();
}

// This function stores the previuos coordinates of ther worms
function storePreviuosCoordinates(currentWorm) {
	for(var i = historyDotsSaved; i > 0; i--) {
		currentWorm.previousX[i] = currentWorm.previousX[i-1];
		currentWorm.previousY[i] = currentWorm.previousY[i-1];
	}
	currentWorm.previousX[0] = currentWorm.x;
	currentWorm.previousY[0] = currentWorm.y;
}

// Stablish if the worm should a hole
function isHole(currentWorm) {
	var module = currentWorm.length%(holeSize+spaceBetweenHoles);
	if(module <= holeSize)
		return true;
	return false;
}

function getWormColorByIndex(index) {
	switch(index) {
		case 0: return "red"; break;
		case 1: return "blue"; break;
		case 2: return "green"; break;
		case 3: return "purple"; break;
		case 4: return "cyan"; break;
		case 5: return "yellow"; break;
		default: return 100; break;
	}
}

// Gets the worm index by the color
function getWormIndexByColor(color) {
	color = color.toString();
	switch(color) {
		case "red": return 0; break;
		case "blue": return 1; break;
		case "green": return 2; break;
		case "purple": return 3; break;
		case "cyan": return 4; break;
		case "yellow": return 5; break;
		default: return 100; break;
	}
}

// This function adds a message to different textareas
function addMessage(message, id) {
	//console.log(message, id);
	if(id == "howto") $("#"+id).text(message);
	else $("#"+id).val(message);
}

// This function shows the current worm info
function showWormInfo(currentWorm) {
	pause();
	console.log(	"color: "+currentWorm.color+
			"\nx: "+currentWorm.x+
			"\ny: "+currentWorm.y+
			"\nangle: "+currentWorm.angle+
			"\nalive: "+currentWorm.alive+
			"\nplaying: "+currentWorm.playing+
			"\nscore: "+currentWorm.score+
			"\nlength: "+currentWorm.length);		
}  

// This function shows the information related with the selected picture
function showPixelInfo(currentWorm, imageArray) {
	console.log("current.x: "+currentWorm.x+
			"\ncurrent.y: "+currentWorm.y+
			"\nnext.x: "+x+
			"\nnext.y: "+y+
			"\nred: "+imageArray.data[0]+
			"\ngreen: "+imageArray.data[1]+
			"\nblue: "+imageArray.data[2]+
			"\nalpha: "+imageArray.data[3]+
			"\nlength: "+currentWorm.length);
} 

function setKeyHelp() {
	$.each(players, function(){
		$("#"+this.color+"KeyHelpRow").css("display", "block");
		$("#"+this.color+"RightButton").val(String.fromCharCode(this.rightKey));
		$("#"+this.color+"LeftButton").val(String.fromCharCode(this.leftKey));
	});
}



