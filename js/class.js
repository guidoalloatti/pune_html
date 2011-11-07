Match = function () {
	var fields = new Array();
	fields['started'] = "";
	fields['ended'] = "";
	fields['players'] = 0;
}

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
	var fields = new Array();
	fields['color'] = color;
	fields['currentMove'] = 0;
	fields['angle'] = 0;
	fields['isAlive'] = true;
	fields['isPlaying'] = false;
	fields['score'] = 0;
	fields['length'] = 0;
	fields['historicalMoves'] = [];
	fields['historicalHoles'] = [];
	fields['lastHoleStarted'] = 0;

	return {
		startRound : function() {
			// Getting Random Postitions and Angle
			var wormPosition = new WormPosition();
			wormPosition.setOne("wormColor", fields['color']);
			wormPosition.setOne("x", Math.floor(Math.random()*xMax-30));
			wormPosition.setOne("y", Math.floor(Math.random()*yMax-20));
			fields['historicalMoves'].push(wormPosition);
			fields['angle'] = Math.floor(Math.random()*angleMax);
		},
		draw : function () {
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
		},
		setOne : function(key, value) {
			fields[key] = value;
		},
		getOne : function(key) {
			return fields[key];
		},
		getAll : function() {
			return fields;
		}
	}
}

WormPosition = function () {
	var fields = new Array();
	fields['movementId'] = 0; 		// Movement Identification (PK)
	fields['wormColor'] = "";		// The Worm Color (A letter maybe)
	fields['isHole'] = false;		// Boolean Determines if have to print
	fields['x'] = 0;				// The Horizontal Position of the pixel
	fields['y'] = 0;				// The Vertical Position of the pixel
	fields['matchId'] = 0;			// Identifies the Unique Game identifier
	fields['roundNumber'] = 0;		// The number of the rounds in the game
	fields['movementNumber'] = 0;	// The number of movement in the round

	return {
		setOne : function(key, value) {
			fields[key] = value;
		},
		getOne : function(key) {
			return fields[key];
		},
		getAll : function() {
			return fields;
		}
	}
}
