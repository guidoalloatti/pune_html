


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
});

/**
 * The Function that setups the game including canvas and game
 */
function setupGame () {
	//drawGameArea();
	//drawScoreArea();
	setupWorms();
}



function startGame() {
	setupGame();

	$.each(playingWormsObjetcs, function(index, worm){
		worm.startRound();
		console.log(worm.getAll());
		
		/*
		var colorOne = worm.getOne("color");
		console.log(colorOne);

		worm.setOne("color", "blue");
		colorOne = worm.getOne("color");
		console.log(colorOne);
		*/

		/*
		console.log(worm.getOne("red"));
		//console.log(this);
		//console.log(index);
		console.log(worm);
		*/
	});

	//console.log(playingWormsObjetcs.color);

}

function drawGameArea () {
	var gameArea = new Game();
	gameArea.load();
	gameArea.set();
	gameArea.draw();
}

function drawScoreArea () {
	var scoreArea = new Score();
	scoreArea.load();
	scoreArea.set();
	scoreArea.draw();
}

function getPlayingWorms () {
	return playingWorms;
}

/**
 * Setup for all the worms
 * @param color
 */
function setupWorms()
{
	var playingWorms = getPlayingWorms();
	$.each(playingWorms, function(index, worm) {
		if(worm.active) {
			var currentWorm = new Worm(worm.color);
			playingWormsObjetcs.push(currentWorm);
		}
	});
}
