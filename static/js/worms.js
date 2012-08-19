// Starting the Game when page is Ready
$(document).ready(function() {
	startGame();
});

// The Function that starts the game including canvas and game
function startGame() {
	context = loadCanvasContext();
	marker = loadMarkerCanvas();
	
	if(context && marker)
	{
		setArrays();
		isNewRound = false;
		start();
		setRound();
		doSpeeding();
		isNewRound = true;
		explainHowToMove();
		speed = startingSpeed;
		$("#rounds").text("1");
		changeInterval(speed);
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

// Setting Worms Arrays (should be from XML)
function setArrays() {
	// Who is playing
	players[0] = true;
	players[1] = true;
	players[2] = true; //true;
	players[3] = true; //true;
	players[4] = true;	//true;
	players[5] = false; //true;
	
	// Which are they colors
	colors[0] = "red"; 
	colors[1] = "blue"; 
	colors[2] = "green";
	colors[3] = "purple";
	colors[4] = "cyan";
	colors[5] = "yellow";
}

// Worm Object Definition
function worm() {
	this.color;
	this.x;
    this.y;
	this.previousX 		= new Array(histotyDotsSaved);
	this.previousY 		= new Array(histotyDotsSaved);
	this.previousHole 	= new Array(histotyDotsSaved);
	this.angle;
	this.alive 		= false	;
	this.playing 	= false;
	this.score 		= 0;
	this.length 	= 0;
	this.lastHoleStarted = 0;	
	this.leftKey;
	this.rightKey;
	this.defaultKeys = true;
}

// Starting the contexts, set speeding and start Worms
function start() {
	setContextProperties();
	setMarkerProperties();	
	context.fillRect(0, 0, xMax, yMax);
	marker.fillRect(xMax, 0, xMax+100, yMax);
	drawMarkers();
	$("#speed").text("Current Speed: "+speed);
	startWorms();
}

// Start each individual Worm
function startWorms() {
	for(var i = 0; i < colors.length; i++) {
		if(players[i])
			startWorm(colors[i]);
	}	
	drawScore();
}

// Start a worm each round
function startWorm(color) {
	// Getting Random Postitions and Angle
	x 		= Math.floor(Math.random()*xMax);
	y 		= Math.floor(Math.random()*yMax);
	angle 	= Math.floor(Math.random()*angleMax);
	i 		= getWormIndexByColor(color);
	
	if(!isNewRound) {
		worms[i] 		= new worm;
		worms[i].score 	= 0;
	}
	
	worms[i].x 			= x;
	worms[i].y 			= y;
	worms[i].angle 		= angle;
	worms[i].color 		= color;
	worms[i].alive 		= true;
	worms[i].playing 	= true;
	worms[i].length 	= 0; //31;
	worms[i].leftKey 	= getKey(i, "left");
	worms[i].rightKey 	= getKey(i, "right");
	
	drawWorm(worms[i]);
}

// This function gets the worm who is winning with it size
function getLongestWorm() {
	for(var i = 0; i < worms.length; i++) {
		if(players[i])  {
			if(worms[i].alive && worms[i].length > longestWormSize) {
				//console.log(longestWormColor, longestWormSize);
				longestWorm       = worms[i];
				longestWormSize   = worms[i].length;
				longestWormColor  = worms[i].color;
				message = "Longest Worm: "+ longestWormColor;
				addMessage(message, "longest");
				message = "Size: "+ longestWormSize;  
				addMessage(message, "longest_size");
			}
		}
	}

}

// Set Time interval (must not exists any more when render will be implemented)
function changeInterval(speed) {
	fps = speed+basicFPSValue;
	clearInterval(interval);
	interval = setInterval(moveWorms, intervalMiliSeconds/fps);
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
	if(onPause)
		return;
	speeding();
	modifyWormsAngle();
	for(var i = 0; i < colors.length; i++) {
		if(players[i] && worms[i].alive)
			moveWorm(worms[i]);
	}
} 

// Add the score to all non dead worms
function addScore() {
	for(var i = 0; i < worms.length; i++) {
		if(players[i] && worms[i].alive)
			worms[i].score++;
	}
}

// Determines wich worms are alive
function getWormsAlive() {
	wormsAlive = 0;
	for(var i = 0; i < worms.length; i++) {
		if(players[i] && worms[i].alive)
			wormsAlive++;
	}
}

// Get the highest Score and the Winning Worm
function getMaxScore() {
	maxScore = 0;
	for(var i = 0; i < worms.length; i++) {
		if(players[i] && worms[i].score > maxScore) {
			maxScore = worms[i].score;
			winningWorm = i;
		}
	}
}

// Get the score needed to win the match
function getScoreToWin() {
	scoreToWin = -10;
	for(var i = 0; i < worms.length; i++) {
		if(players[i])
			scoreToWin+=10;
	}
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
		//showPixelInfo(currentWorm, imageArray);
		if(redValue == 1 && greenValue == 1 && blueValue == 1)
			playSound("yabass");
		else
			return true;
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
	drawWorm(currentWorm);	
}
	
// The worm is dead, so we need to kill her	
function wormCrushes(currentWorm) {
	playSound("die");
	currentWorm.alive = false;
	getLongestWorm();
	addScore();
	getWormsAlive();
	
	if(wormsAlive < 2)
		lastWormCrushes(currentWorm);

	drawMarkers();
	drawScore();
	
	getLongestWorm();
	message = "Longest Worm: "+ longestWormColor;
	addMessage(message, "longest");
	message = "Size: "+ longestWormSize;  
	addMessage(message, "longest_size");
}

// The last worm is dead, needs to start a new round and maybe a new match
function lastWormCrushes(currentWorm) {
	clearKeys();
	getMaxScore();
	getScoreToWin();
	setRound();

	if(maxScore >= scoreToWin)
		matchOver(currentWorm);
	else
		roundOver(currentWorm);
}

// This function is called when the match is over
function matchOver(currentWorm) {
	playSound("win");
	currentRound = 0;
	isNewRound = false;
	alert("Winner!\nThe Winner Worm with "+maxScore+" points is....\nThe Glorious "+colors[winningWorm]+" Worm!!");
	startGame();
}

// This function is called when the round is over
function roundOver(currentWorm) {
	yMarker = 0;
	if(winningWorm == 0) 
		playSound("red");
	else if(winningWorm == 1) 
		playSound("blue");
	else if(winningWorm == 2) 
		playSound("green");
	else if(winningWorm == 3) 
		playSound("purple");
	else if(winningWorm == 4) 
		playSound("cyan");
	else if(winningWorm == 5) 
		playSound("yellow");
	start();
}

// This function stores the previuos coordinates of ther worms
function storePreviuosCoordinates(currentWorm) {
	for(var i = histotyDotsSaved; i > 0; i--) {
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

// Gets the worm index by the color
function getWormIndexByColor(color) {
	switch(color) {
		case "red":
			return 0;
			break;
		case "blue":
			return 1;
			break;
		case "green":
			return 2;
			break;
		case "purple":
			return 3;
			break;
		case "cyan":
			return 4;
			break;
		case "yellow":
			return 5;
			break;
		default:
			return 100;
			break;
	}
}

// This function adds a message to different textareas
function addMessage(message, id) {
	if(id == "howto")
		$("#"+id).text(message);
	else
		$("#"+id).val(message);
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





