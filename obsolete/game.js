/*

// Game Vars
var showMessages = false;
var holeSize = 30;
var spaceBetweenHoles = 100;
var isNewRound = false;
var roundNumber = 0;
var onPause = false;
var wormsAlive;
var scoreToWin;
var maxScore = 0;
var wormHasCrush = false;
var imageArray;
//var soundOn = true;
var winningWorm;
var longestWormSize;
var longestWorm;
var wormIsInHole = false;

// How Will Worm Move
var startingSpeed = 15;		// How fast will worms start moving
var speedingIncrementSpeed = 5;
var intervalMiliSeconds = 1000;
var speed = 0;
var basicFPSValue = 20;
var fps; 					// Is defined by speed+basicFPSValue
var wormSize = 4; 			// The size of the circle
var angleStepSize = 1; 		// How much will it turn
var sizeMultiplier = 2;		// How much will the worm move every interval
var currentRound = 0;		// Set initial value for round, previous start

// Canvas and Js Vars
var xMax = 640; //800;
var yMax = 480; //600;
var angleMax = 360;
var interval;
var context;
var marker;
var keyCode;
var i;
var score_x = 13;
var score_y = 42;

// Math Vars
var sin;
var cos;
var angle;
var x;
var y;

// Information Vars
var message = '';
var actionCounter = 0;

// Marker Vars
var xMarker = 0; //xMax+5;
var yMarker = 0;
var wMarker = yMax/6;
var hMarker = yMax/6;

// Arrays Declarations
var keysBeenPressed = new Array(512);
var worms = new Array(6);
var players = new Array(6);
var colors = new Array(6); 
var rgbColors = new Array(6);

// XML Settings
var xmlFileDir = "/xml";
var xmlFileName = "xml_jquery.xml"
//var xmlFileName = "config.xml"

// Variables Declarations Finished

// XML Functionality

function testXML()
{
	loadValuesFromXml();
}

function loadValuesFromXml()
{
  $.ajax({
    type: "GET",
    url: xmlFileName,
    dataType: "xml",
    success: parseXml
  });
}

function parseXml(xml)
{

	$(xml).find("Tutoria").each(function()
	{
	  $("#log").append("\n"+$(this).find("Title").text());
	  $(this).find("Category").each(function()
	  {
		$("#log").append("\n"+$(this).text());
	  });
		$("#log").append("\n");
	});

	//find every Tutorial and print the author
	//$(xml).find("Configuration").each(function()
	//{
    //$("#log").append("\n"+$(this).attr("Game"));
	//$("#log").append(": " + $(this).find("Title").text() + "<br />");
	//});
}




function clearKeys()
{
	keysBeenPressed = new Array(512);
}	
	
$(document).ready(function()
{
	startGame();
});

function startGame()
{
	context = loadCanvasContext();
	marker = loadMarkerCanvas();
	setArrays();
	//drawImage();
	
	if(context && marker)
	{
		//alert("Starting New Match");
		isNewRound = false;
		start();
		setRound();
		doSpeeding();
		isNewRound = true;
		explainHowToMove();
		speed = startingSpeed;
		$("#rounds").text("1");
		changeInterval(speed);
	}
	else
	{
		alert("Cannot Load Canvas");
	}
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
	
	// Set and unset pause 
	if(keyCode == 32)
		pause();
		
	keysBeenPressed[keyCode] = true;
}

function modifyWormsAngle()
{
	
	// Red Worm Moving 
	if(players[0])
	{
		if(keysBeenPressed[49])
			worms[0] = changeAngle("right", worms[0]);
		if(keysBeenPressed[192])
			worms[0] = changeAngle("left", worms[0]);	
	}
	
	// Blue Worm Moving
	if(players[1])
	{
		if(keysBeenPressed[88])
			worms[1] = changeAngle("right", worms[1]);
		if(keysBeenPressed[90])
			worms[1] = changeAngle("left", worms[1]);
	}
	
	// Green Worm Moving
	if(players[2])
	{
		if(keysBeenPressed[86])
			worms[2] = changeAngle("right", worms[2]);
		if(keysBeenPressed[66])
			worms[2] = changeAngle("left", worms[2]);
	}
	
	// Purple Worm Moving
	if(players[3])
	{
		if(keysBeenPressed[54])
			worms[3] = changeAngle("right", worms[3]);
		if(keysBeenPressed[55])
			worms[3] = changeAngle("left", worms[3]);
	}
		
	// Cyan Worm Moving
	if(players[4])
	{
		if(keysBeenPressed[222])
			worms[4] = changeAngle("right", worms[4]);
		if(keysBeenPressed[187])
			worms[4] = changeAngle("left", worms[4]);
	}
			
	// Yellow Worm Moving
	if(players[5])
	{
		if(keysBeenPressed[39])
			worms[5] = changeAngle("right", worms[5]);
		if(keysBeenPressed[40])
			worms[5] = changeAngle("left", worms[5]);
	}
			
}

function explainHowToMove()
{
	message += "Red Worm\t<-[\\]\t[1]->";
	message += "\nBlue Worm\t<-[z]\t[x]->";
	message += "\nGreen Worm\t<-[v]\t[b]->";
	message += "\nPurple Worm\t<-[6]\t[7]->";
	message += "\nCyan Worm\t<-[']\t[\�]->";
	message += "\nYellow Worm\t<-[V]\t[->]->";
	addMessage(message, "howto");
}

function changeAngle(direction, currentWorm)
{
	if(direction == "left")
	{
		if((currentWorm.angle-angleStepSize) <= 0)
			currentWorm.angle = 360+(currentWorm.angle);
			currentWorm.angle-=angleStepSize; 
	}
	else if(direction == "right")
	{
		if((currentWorm.angle+angleStepSize) >= 360)
			currentWorm.angle = 0-(360-currentWorm.angle);
			currentWorm.angle+=angleStepSize;
	}
	return currentWorm;
}

function setArrays()
{
	// Who is playing
	players[0] = true;
	players[1] = true;
	players[2] = false;
	players[3] = false;
	players[4] = false;
	players[5] = false;
	
	// Which are they colors
	colors[0] = "red"; 
	colors[1] = "blue"; 
	colors[2] = "green";
	colors[3] = "purple";
	colors[4] = "cyan";
	colors[5] = "yellow";
}

function loadCanvasContext()
{
	context = $("#screen")[0].getContext('2d');
	if(context)
		return context;
	return false;
}

function loadMarkerCanvas()
{
	marker = $("#marker")[0].getContext('2d');
	if(marker)
		return marker;
	return false;
}

// Worm Object Definition
function worm()
{
	this.color;
	this.x;
    this.y;
	this.previousX = new Array(20);
	this.previousY = new Array(20);
	this.angle;
	this.alive = true;
	this.playing = false;
	this.score = 0;
	this.length = 0;
	this.lastHoleStarted = 0;	
}

function setContextProperties()
{
	context.font = '36px arial';
	context.textAlign = 'left';
	context.textBaseline = 'middle';
	context.fillStyle = "rgb(0,0,0)";
}

function setMarkerProperties()
{
	marker.fillStyle = "white";
	marker.font = '48px arial';
	marker.textAlign = 'left';
	marker.textBaseline = 'middle';
}

function getPixelColor(x, y, w, h)
{
	var gi = context.getImageData(x, y, w, h);
	alert("red: "+gi.data[0]+"\ngreen: "+gi.data[1]+"\nblue: "+gi.data[2]+"\nalpha: "+gi.data[3]);
}

function start()
{	
	setContextProperties();
	setMarkerProperties();	
	context.fillRect(0, 0, xMax, yMax);
	marker.fillRect(xMax, 0, xMax+100, yMax);
	drawMarkers();
	$("#speed").text("Current Speed: "+speed);
	startWorms();
}

function getLongestWorm()
{
	longestWormSize = 0;

	for(var i = 0; i < worms.length; i++)
	{
		if(players[i] && worms[i].size >= longestWormSize)
		{
			longestWorm = worms[i];
			longestWormSize = worms[i].size;
		}
	}
}

function startWorms()
{
	for(var i = 0; i < colors.length; i++)
	{
		if(players[i])
			startWorm(colors[i]);
	}	
	drawScore();
}

function changeInterval(speed)
{
	fps = speed+basicFPSValue;
	clearInterval(interval);
	interval = setInterval(moveWorms, intervalMiliSeconds/fps);
}

function doSpeeding()
{
	playSound("speeding");
	speed += speedingIncrementSpeed;
	changeInterval(speed);
	addMessage("Current Speed: "+(speed), "speed");
}

function speeding()
{
	random_1 = Math.floor(Math.random()*(300+speed));
	random_2 = (300+speed) - Math.floor(Math.random()*(300+speed));
	if(random_1 == random_2)
		doSpeeding();
}

function moveWorms()
{
	if(onPause)
		return;
	
	speeding();
	modifyWormsAngle();
	
	for(var i = 0; i < colors.length; i++)
	{
		if(players[i] && worms[i].alive)
			moveWorm(worms[i]);
	}
} 

function addScore()
{
	for(var i = 0; i < worms.length; i++)
	{
		if(players[i] && worms[i].alive)
			worms[i].score++;
	}
}

function getWormsAlive()
{
	wormsAlive = 0;
	for(var i = 0; i < worms.length; i++)
	{
		if(players[i] && worms[i].alive)
			wormsAlive++;
	}
}

function getMaxScore()
{
	maxScore = 0;
	for(var i = 0; i < worms.length; i++)
	{
		if(players[i] && worms[i].score > maxScore)
		{
			maxScore = worms[i].score;
			winningWorm = i;
		}
	}
	
}

function getScoreToWin()
{
	scoreToWin = -10;
	for(var i = 0; i < worms.length; i++)
	{
		if(players[i])
			scoreToWin+=10;
	}
}

function isWormHit(currentWorm)
{
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
	
	if(redValue != 0 || greenValue != 0 || blueValue != 0)
	{
		//showPixelInfo(currentWorm, imageArray);
		if(redValue == 1 && greenValue == 1 && blueValue == 1)
			playSound("yabass");
		else
			return true;
	}
			
	return false;
	
}

function setRound()
{
	currentRound++;
	addMessage("Current Round: "+currentRound, "rounds");
}

function moveWorm(currentWorm)
{
	wormHasCrush = isWormHit(currentWorm);
		
	if(	currentWorm.x+wormSize > xMax || 
		currentWorm.x-wormSize < 0 || 
		currentWorm.y+wormSize > yMax || 
		currentWorm.y-wormSize < 0 || 
		wormHasCrush)
	{
		playSound("die");
		speed = startingSpeed;
		changeInterval(speed);
		currentWorm.alive = false;
		addScore();
		getWormsAlive();	
		
		if(wormsAlive < 2)
		{
			clearKeys();
			getMaxScore();
			getScoreToWin();
			setRound();

			if(maxScore >= scoreToWin)
			{
				playSound("win");
				currentRound = 0;
				isNewRound = false;
				alert("Winner!\nThe Winner Worm with "+maxScore+" points is....\nThe Glorious "+colors[winningWorm]+" Worm!!");
				startGame();
			}
			else
			{
				yMarker = 0;
				start();
				
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
				
			}	
		}
		drawMarkers();
		drawScore();
	}
	else
	{
		radians = currentWorm.angle*(Math.PI/180);
		sin = Math.sin(radians*sizeMultiplier);
		cos = Math.cos(radians*sizeMultiplier);
		
		storePreviuosCoordinates(currentWorm);
		currentWorm.y += sin;
		currentWorm.x += cos;
		
		drawWorm(currentWorm);
	}	
}

function storePreviuosCoordinates(currentWorm)
{
	for(var i = 19; i > 0; i--)
	{
		currentWorm.previousX[i] = currentWorm.previousX[i-1];
		currentWorm.previousY[i] = currentWorm.previousY[i-1];
	}
	currentWorm.previousX[0] = currentWorm.x;
	currentWorm.previousY[0] = currentWorm.y;
	
}

function drawMarkers()
{
	yMarker = 0;
	for(var i = 0; i < colors.length; i++)
	{
		drawMarker(colors[i], xMarker, yMarker, wMarker, hMarker);
		yMarker += yMax/6;
	}	
}

function drawMarker(color, x, y, w, h)
{
	//addMessage("drawMarker", color, "\nx: "+x+"\ny: "+y+"\nw: "+w+"\nh: "+h);
	//alert("Draw Marker: "+color+"\nx: "+x+"\ny: "+y+"\nw: "+w+"\nh: "+h);
	marker.beginPath();
	marker.fillStyle = color;
	marker.fillRect(x, y, w, h);
	marker.closePath();
}

function drawScore()
{
	for(var i = 0; i < worms.length; i++)
	{
		var score = "00";
		if(players[i])
		{
			if(worms[i].score < 10)
				score = "0"+worms[i].score;
			else
				score = worms[i].score;
		}
		
		marker.beginPath();
		marker.font = "40pt serif";
		marker.fillStyle = "black";
		marker.fillText(score, score_x, (score_y+(i*(yMax/6))));
		marker.fillStyle = "white";
		marker.fillText(score, score_x-2, (score_y-2+(i*(yMax/6))));	
		marker.closePath();
	}
}

function isHole(currentWorm)
{
	var module = currentWorm.length%(holeSize+spaceBetweenHoles);
	if(module <= holeSize)
		return true;
	return false;
}

function drawWorm(currentWorm)
{
		context.beginPath();
		context.fillStyle = currentWorm.color;
		context.arc(currentWorm.x, currentWorm.y, wormSize, 0, Math.PI*2, true);
		//context.stroke();
		context.fill();
		context.closePath();
		
		if(isHole(currentWorm))
		{
			context.beginPath();
			context.fillStyle = "rgb(0, 0, 0)";
			context.arc(currentWorm.previousX[8], currentWorm.previousY[8], wormSize+1, 0, Math.PI*2, true);
			context.fill();
			context.closePath();
			
			context.beginPath();
			//context.fillStyle = "rgb(220, 80, 100)";
			context.fillStyle = "rgb(2, 2, 2)";
			context.arc(currentWorm.previousX[11], currentWorm.previousY[11], 2, 0, Math.PI*2, true);
			context.fill();
			context.closePath();
		}
	currentWorm.length++;
}

function getWormIndexByColor(color)
{
	switch(color)
	{
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

function startWorm(color)
{
	// Getting Random Postitions and Angle
	x = Math.floor(Math.random()*xMax);
	y = Math.floor(Math.random()*yMax);
	angle = Math.floor(Math.random()*angleMax);
	i = getWormIndexByColor(color);

	if(!isNewRound)
	{
		worms[i] = new worm;
		worms[i].score = 0;
	}
		
	worms[i].x = x;
	worms[i].y = y;
	worms[i].angle = angle;
	worms[i].color = color;
	worms[i].alive = true;
	worms[i].playing = true;
	worms[i].length = 31;
	drawWorm(worms[i]);
	
	//showWormInfo(worms[i]);
	//addMessage("startWorm", color);
}

function addMessage(message, id) //fun, ext1)
{
	if		(id == "howto") 	$("#howto").text(message);
	else if	(id == "speed") 	$("#speed").text(message);
	else if	(id == "rounds") 	$("#rounds").text(message);	
}

function showWormInfo(currentWorm)
{
	alert(	"color: "+currentWorm.color+
			"\nx: "+currentWorm.x+
			"\ny: "+currentWorm.y+
			"\nangle: "+currentWorm.angle+
			"\nalive: "+currentWorm.alive+
			"\nplaying: "+currentWorm.playing+
			"\nscore: "+currentWorm.score+
			"\nlength: "+currentWorm.length);		
}  
 
function showPixelInfo(currentWorm, imageArray)
{
	alert(	"current.x: "+currentWorm.x+
			"\ncurrent.y: "+currentWorm.y+
			"\nnext.x: "+x+
			"\nnext.y: "+y+
			"\nred: "+imageArray.data[0]+
			"\ngreen: "+imageArray.data[1]+
			"\nblue: "+imageArray.data[2]+
			"\nalpha: "+imageArray.data[3]+
			"\nlength: "+currentWorm.length);
} 

/*
* Sound Functions
*
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
*/

/*
* Pause Function
*/
function pause()
{
	onPause = !onPause;
	playSound("pause");
	
	if(!onPause)
	{
		$("#pauseButton").val("Pause Off");
		$("#log").text($("#log").text()+"\nPause Removed");
	}
	else
	{
		$("#pauseButton").val("Pause On");
		$("#log").text($("#log").text()+"\nGame Paused");
	}
}
