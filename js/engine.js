/**
 * Global variables that will be moved to vars.js
 */
var colors 	= new Array("red", "blue", "green", "purple", "cyan", "yellow");
var players = new Array(true, true, false, false, false, false)
var redWorm;
var blueWorm;
var greenWorm;
var purpleWorm;
var cyanWorm;
var yellowWorm;


/**
 * Starting the Game when page is Ready
 */
$(document).ready(function()
{
	$("#hideShowOptions").click(function () {
		$("#helperDiv").toggle("slow");
	});

	$("#startGame").click(function () {
		startGame();
	});

	setupGame();
	
});

/**
 * The Function that setups the game including canvas and game
 */
function setupGame () {
	drawGameArea();
	drawScoreArea();
	setupWorms();
}

function startGame() {
	
}

function drawGameArea () {
	var game = new Game();
	game.load();
	game.set();
	game.draw();
}

function drawScoreArea () {
	var score = new Score();
	score.load();
	score.set();
	score.draw();
}

function getPlayingWorms () {
	
	return PlayingWorms;
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