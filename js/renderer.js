/**
 * Defining the global variables
 */
var playingWorms;
var playingWormsObjetcs = new Array();
var currentWorm;

var wormRed;
var wormBlue;
var wormGreen;
var wormPurple;
var wormCyan;
var wormYellow;

var plusWidth = 3;
var plusDensity = 1;


/**
 * This method returns the Playing worms
 * TODO: remove the hardcoded and get it from the configuration
 */
function getPlayingWorms()
{
	playingWorms = {
		'red'	: true,
		'blue'	: false,
		'green'	: false,
		'purple': false,
		'cyan'	: false,
		'yellow': false
	};
	return playingWorms;
}

/**
 * Setup for all the worms
 * @param color
 */
function setupWorms()
{
	var playingWorms = getPlayingWorms();
	$.each(playingWorms, function(color, active){

		playingWormsObjetcs.push(currentWorm);

		switch(color) {
			case "red":
				wormRed = new Worm("red");
				break;
			case "blue":
				wormBlue = currentWorm;
				break;
			case "green":
				wormGreen = currentWorm;
				break;
			case "purple":
				wormPurple = currentWorm;
				break;
			case "cyan":
				wormCyan = currentWorm;
				break;
			case "yellow":
				wormYellow = currentWorm;
				break;
			default:
				break;
		}
		if(active) {
			currentWorm = setupWorm(color);
		}
	});
}

/**
 *
 * @param color
 */
function setupWorm(color)
{
	currentWorm = new worm(color);
	return currentWorm;
}

/**
 * Defining the worm historical previous steps
 * Every Position is a pixel
 */
function wormPosition()
{
	this.movementId; 		// Movement Identification (PK)
	this.wormColor;			// The Worm Color (A letter maybe)
	this.isHole;			// Boolean Determines if have to print
	this.x;					// The Horizontal Position of the pixel
	this.y;					// The Vertical Position of the pixel
	this.matchId;			// Identifies the Unique Game identifier
	this.roundNumber;		// The number of the rounds in the game
	this.movementNumber;	// The number of movement in the round
}

/**
 * Get the worm that is represented by the color
 * @param color
 */
function getWormByColor(color)
{
	switch(color)
	{
		case "red":
			currentWorm = wormRed;
		case "blue":
			currentWorm = wormBlue;
		case "green":
			currentWorm = wormGreen;
		case "purple":
			currentWorm = wormPurple;
		case "cyan":
			currentWorm = wormCyan;
		case "yellow":
			currentWorm = wormYellow;
	}
	return currentWorm;
}

/**
 * Store the current position to the historical array
 * @param color
 */
function moveCurrentPositionToHistorical(color)
{
	var currentWorm = getWormByColor(color);
	currentWorm.historicalMoves.push(currentWorm.currentMove);
}

/**
 * Amount of movements made by that color worm
 * @param color
 */
function getRoundPositionsByColor(color)
{
	var currentWorm = getWormByColor(color);
	return currentWorm.historicalMoves.length();
}

/**
 * Worm Object definition structure
 */
function worm(color)
{
	// Atributes
	this.color = color;
	this.currentMove;
	this.historicalMoves = [];
	this.angle;
	this.alive = true;
	this.playing = false;
	this.score = 0;
	this.length = 0;
	this.lastHoleStarted = 0;

	// Methods
	this.drawWorm = drawWorm;

}

/*
worm.prototype.drawWorm = function() {
    return this.color + ' ' + this.type + ' apple';
};
*/


function drawCanvas()
{
	/**
	 * TODO: Create the empty canvas
	 */

}

function drawWormPosition(position)
{
	if(!position.isHole)
	{

		context.beginPath();
		context.fillStyle = position.wormColor

		// Central Dot
		context.fillRect(position.x, position.y, 1, 1);
		// Vertical Dots
		context.fillRect(position.x, position.y+1, 1, 1);
		context.fillRect(position.x, position.y-1, 1, 1);
		// Vertical Dots
		context.fillRect(position.x+1, position.y, 1, 1);
		context.fillRect(position.x-1, position.y, 1, 1);
		// Draw and end
		context.fill();
		context.closePath();


		/**
		 * Replacing with simple plus symbol
		 */

		/*
		context.beginPath();
		context.fillStyle = position.wormColor
		// Linea horizontal
		context.fillRect(position.x-1, position.y, plusWidth, plusDensity);
		// Linea Vertical
		context.fillRect(position.x, position.y+1, plusDensity, plusWidth);
		context.fill();
		context.closePath();
		*/
	}
}

function drawWorm(color)
{
	/**
	 * TODO: Create the complete worm
	 */

	// Get the Worm
	var currentWorm = getWormByColor(color);

	// Draw Historical Worms
	$.each(currentWorm.historicalMoves, function(){
		//drawWormPosition(this);
		currentWorm.drawWorm(this);
	});

	// Draw Current Worm, Add Position to History
	

	/*
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

		currentWorm.previousHole[currentWorm.length] = true;
	}
	else
		currentWorm.previousHole[currentWorm.length] = false;

	currentWorm.length++;
	*/
}

function playTurn()
{
	// Draw Canvas and Score
	var playingWorms = getPlayingWorms();
	$.each(playingWorms, function(color, active){
		drawWorm(color);
	});
}

/**
 *
 */
function drawMarkers()
{
	yMarker = 0;
	for(var i = 0; i < colors.length; i++)
	{
		drawMarker(colors[i], xMarker, yMarker, wMarker, hMarker);
		yMarker += yMax/6;
	}
}

/*
function drawMarker(color, x, y, w, h)
{
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
*/

function getPixelColor(x, y, w, h)
{
	var gi = context.getImageData(x, y, w, h);
	alert("red: "+gi.data[0]+"\ngreen: "+gi.data[1]+"\nblue: "+gi.data[2]+"\nalpha: "+gi.data[3]);
}

function setGameAreaProperties()
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

function loadGameAreaContext()
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
