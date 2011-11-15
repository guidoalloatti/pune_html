

Match = function () {
	var fields = new Array();
	fields['started'] = "";
	fields['ended'] = "";
	fields['players'] = 0;
}


ScoreArea = function () {
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


GameArea = function () {
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
	// Class Atributes
	var fields = new Array();
	var currentPosition = null;
	var lastPosition = null;

	return {
		initialize : function() {
			fields = {	"color" 		: color ,
						"currentMove" 	: 0,
						"angle" 		: 0,
						"isAlive"		: true,
						"score"			: 0,
						"length"		: 0,
						"historicalMoves" : new Array(),
						"historicalHoles" : new Array(),
						"lastHoleStarted" : 0
			};
		},
		getCurrentPosition : function() {
			return currentPosition;
		},
		getLastPosition : function() {

		},
		startRound : function() {
			// Getting Random Positions and Angle
			var wormPosition = new WormPosition();

			var params = {
				"wormColor" 		: fields["color"],
				"x"					: Math.floor(Math.random()*xMax-30),
				"y"					: Math.floor(Math.random()*yMax-20),
				"matchId"			: getMatchId(),
				"isHole"			: false,
				"movementNumber" 	: 1,
				"movementId"		: getNewMovementId(),
				"roundNumber"		: getRoundNumber()
			};

			wormPosition.setAllParams(params);

			fields.historicalMoves.push(wormPosition);
			fields.angle = Math.floor(Math.random()*angleMax);
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
		doOneStep : function() {
			lastPosition = currentPosition;
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


var WormPosition = function (params) {

	var fields = new Array();
	function init(params) {
		initialize();
		setAllParams(params);
	}

	function initialize(){
		fields = {
			"movementId" 		: 0,		// Movement Identification (PK)
			"wormColor"			: "no color",		// The Worm Color (A letter maybe)
			"isHole"			: false,	// Boolean Determines if have to print
			"x"					: 0,		// The Horizontal Position of the pixel
			"y"					: 0,		// The Vertical Position of the pixel
			"matchId"			: 0,		// Identifies the Unique Game identifier
			"roundNumber"		: 0,		// The number of the rounds in the game
			"movementNumber"	: 0			// The number of movement in the round
		};
	}

	function setAllParams(params){
		if( typeof(params) == "undefined" ) {
			return;
		}
		
		$.each(params, function(key, value) {
			fields[key] = value;
		});
	}

	init(params);

	return {
		getOneParam : function(key) {
			return fields[key];
		},
		getAllParams : function() {
			return fields;
		},
		setOneParam : function(key, value) {
			fields[key] = value;
		},
		setAllParams : function(params) {
			setAllParams(params);
		}
	}
}


NextWormPosition = function(worm) {
	var fields = new Array();
	return {
		initialize : function () {
			fields = {
				"x" 			: 100,
				"y"				: 200,
				"movementNumber": -1,
				"movementId"	: -1,
				"isHole"		: false,
				"roundNumber"	: 10,
				"wormColor"		: -1,
				"matchId"		: -1
			}
		},
		getX : function() {
			return fields["x"]+1;
		},
		getY : function() {
			return fields["y"]+1;
		},
		getMovementId : function() {
			return fields["movementId"]+1;
		},
		getRoundNumber : function() {
			return fields["roundNumber"];
		},
		getIsHole : function() {
			var isHole = false;
			var module = worm.getOne("length")%(holeSize+spaceBetweenHoles);
			if(module <= holeSize)
				isHole = true;
			return isHole;
		},
		getOne : function(key) {
			return fields[key];
		},
		getAll : function() {
			return fields;
		}

	}
}
