


/**
 * Starting the Game when page is Ready
 */
$(document).ready(function()
{
	$("#hideShowOptions").click(function () {
		toogleOptions();
	});

	$("#startGame").click(function () {
		showSettings();
	});

	$("#startGame").click(function () {
		startGame();
	});

	toogleOptions();
});


function showSettings() {
	// TODO:
	// * Turn backend gray and reload after save
	// * Build modal with options
	// * Save options and make them accesible
}

function toogleOptions() {
	$("#helperDiv").toggle("slow");
}

/**
 * The Function that setups the game including canvas and game
 */
function setupGame () {
	//drawGameArea();
	//drawScoreArea();
	setupWorms();
}


function playWormRound(index, worm) {
		worm.initialize();
		worm.startRound();

		var nextPosition = new NextWormPosition(worm);
		nextPosition.initialize();

		var params = {
			"wormColor" 		: worm.getOne("color"),
			"x"					: nextPosition.getX(), //getOne("x"),
			"y"					: nextPosition.getY(), //One("y"),
			"matchId"			: matchId,
			"isHole"			: false, //getIsHole(),
			"movementNumber" 	: nextPosition.getMovementId(), // One("movementNumber"), // worm.lastMovement[movementNumber]+1,
			"movementId"		: getNewMovementId(),
			"roundNumber"		: getRoundNumber()
		};

		var wormMovement = new WormPosition(params);

		console.log("MOVEMENT OBJECT: WormPosition");
		console.log(wormMovement.getAllParams());


		//console.log(w.getAllParams());
		//console.log("NEXT POSITION: NextWormPosition");
		//console.log(nextPosition.getAll());

		/*
		//console.log(wormMovement.getAll());
		//console.log(nextPosition.getAll());
		*/

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
}


function playRound() {
		$.each(playingWormsObjetcs, function(index, worm) {
			playWormRound(index, worm);
	});
}


function startGame() {
	setupGame();


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
