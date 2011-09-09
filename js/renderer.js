/**
 * Created by JetBrains PhpStorm.
 * User: guido alloatti
 * Date: 8/12/11
 * Time: 11:45 AM
 * To change this template use File | Settings | File Templates.
 */



/**
 * Defining the used global vars
 */
var maxHistoricalPositions = 10000;
var wormRed;
var wormBlue;
var wormGreen;
var wormPurple;
var wormCyan;
var wormYellow;
var playingWorms;

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
		'blue'	: true,
		'green'	: true,
		'purple': true,
		'cyan'	: true,
		'yellow': true
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
		if(active)
		{
			currentWorm = setupWorm(color);
			switch(color)
			{
				case "red":
					wormRed = currentWorm;
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
 */
function wormPosition()
{
	this.movementId;
	this.wormColor;
	this.isHole;
	this.x;
	this.y;
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
	this.color = color;
	this.currentMove;
	this.historicalMoves = [];
	this.angle;
	this.alive = true;
	this.playing = false;
	this.score = 0;
	this.length = 0;
	this.lastHoleStarted = 0;
}

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
		// Linea horizontal
		context.fillRect(position.x-1, position.y, plusWidth, plusDensity);
		// Linea Vertical
		context.fillRect(position.x, position.y+1, plusDensity, plusWidth);
		context.fill();
		context.closePath();
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
		drawWormPosition(this);
	});
	// Draw Current Worm, Add Position to History
	current


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
}

function playTurn()
{
	// Draw Canvas and Score
	var playingWorms = getPlayingWorms();
	$.each(playingWorms, function(color, active){

		drawWorm(color);

	});
}
