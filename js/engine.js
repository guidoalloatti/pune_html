


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

	$.each(playingWormsObjetcs, function(index, worm) {
		worm.initialize();
		worm.startRound();

		var wormMovement = new WormPosition();
		wormMovement.initialize();

		var nextPosition = new NextWormPosition(worm);


		var params = {
			"wormColor" 		: worm.getOne["color"],
			"x"					: nextPosition.getOne("x"),
			"y"					: nextPosition.getOne("y"),
			"matchId"			: matchId,
			"isHole"			: false, //getIsHole(),
			"movementNumber" 	: nextPosition.getOne("movementNumber"), // worm.lastMovement[movementNumber]+1,
			"movementId"		: getNewMovementId(),
			"roundNumber"		: getRoundNumber()
		};

		wormMovement.add(params);

		console.log(wormMovement.getAll());

		/*
		var wormInstance = worm.getAll();
		var wormMovementInstance = wormInstance.historicalMoves;
		var wormHistoricalInstance = $(wormMovementInstance).getAll();
		console.log(wormHistoricalInstance);
		*/

		/*
		 colorOne = worm.getOne("color");
		 console.log(colorOne);
		 console.log(worm.getAll());
		 console.log(worm.getAll());
		 var colorOne = worm.getOne("color");
		 console.log(colorOne);
		 worm.setOne("color", "blue");
		 console.log(colorOne);
		 colorOne = worm.getOne("color");
		 console.log(worm.getOne("red"));
		 console.log(this);
		 console.log(index);
		 console.log(worm);
		 worm.setOne("color", "blue");
		 console.log(worm.getOne("color"));
		 console.log(worm.getAll());
		 console.log(playingWormsObjetcs.color);
		*/
	});



}

function drawGameArea () {
	var gameArea = new GameArea();
	gameArea.load();
	gameArea.set();
	gameArea.draw();
}

function drawScoreArea () {
	var scoreArea = new ScoreArea();
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
