
Score = function () {
	var scoreArea;
	return {
		load: function () {
			scoreArea = $("#marker")[0].getContext('2d');
		},
		set: function () {
			scoreArea.fillStyle = "white";
			scoreArea.font = '48px arial';
			scoreArea.textAlign = 'left';
			scoreArea.textBaseline = 'middle';
		},
		draw: function () {
			yMarker = 0;
			for(var i = 0; i < colors.length; i++) {
				scoreArea.beginPath();
				scoreArea.fillStyle = colors[i];
				scoreArea.fillRect(xMarker, yMarker, wMarker, hMarker);
				scoreArea.closePath();
				yMarker += yMax/6;
			}
		},
		drawScoresForWorms: function () {
			var playingWorms = getPlayingWorms();
			$.each(playingWorms, function (){
				if(this.isActive) {
					var color = this.color;
					var score = "--";

					if(colors[i].score < 10)
						score = "0" + this.score;
					else
						score = this.score;

					scoreArea.beginPath();
					scoreArea.font = "40pt serif";
					scoreArea.fillStyle = "black";
					scoreArea.fillText(score, score_x, (score_y+(i*(yMax/6))));
					scoreArea.fillStyle = "white";
					scoreArea.fillText(score, score_x-2, (score_y-2+(i*(yMax/6))));
					scoreArea.closePath();

				}
			});
		}
	}
}

Game = function () {
	var gameArea;
	return {
		load: function () {
			gameArea = $("#screen")[0].getContext('2d');
		},
		set: function () {
			gameArea.font = '36px arial';
			gameArea.textAlign = 'left';
			gameArea.textBaseline = 'middle';
			gameArea.fillStyle = "rgb(0,0,0)";
		},
		draw: function () {
			gameArea.fillRect(0, 0, xMax, yMax);
		}
	}
}

Worm = function (color) {
	var color = color;
	var currentMove = 0;
	var angle = 0;
	var isAlive = true;
	var isPlaying = false;
	var score = 0;
	var length = 0;
	var historicalMoves = [];
	var historicalHoles = [];
	var lastHoleStarted = 0;

	return {
		draw: function () {
			$.each(historicalMoves, function (){
				if(!this.isHole) {
					context.beginPath();
					context.fillStyle = this.wormColor
					context.fillRect(this.x, this.y, 1, 1);
					context.fillRect(this.x, this.y+1, 1, 1);
					context.fillRect(this.x, this.y-1, 1, 1);
					context.fillRect(this.x+1, this.y, 1, 1);
					context.fillRect(this.x-1, this.y, 1, 1);
					context.fill();
					context.closePath();
				}
			});
		}
	}
}

WormPosition = function () {
	var movementId; 		// Movement Identification (PK)
	var wormColor;			// The Worm Color (A letter maybe)
	var isHole;				// Boolean Determines if have to print
	var x;					// The Horizontal Position of the pixel
	var y;					// The Vertical Position of the pixel
	var matchId;			// Identifies the Unique Game identifier
	var roundNumber;		// The number of the rounds in the game
	var movementNumber;		// The number of movement in the round
}
