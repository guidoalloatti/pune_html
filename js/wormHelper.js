
NextWormPosition = function(worm) {
	var fields = new Array();
	return {
		initialize : function () {
			fields = {
				"x" 			: 1,
				"y"				: 1,
				"movementNumber": 121
			}
		},
		getCurrentXPosition : function() {

		},
		getCurrentYPosition : function() {

		},
		getNewMovementId : function() {

		},
		getRoundRumber : function() {

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
		}

	}
}


/*
 * Methods for all the worms
 */
function getRoundNumber() {
	return roundNumber;
}

function getMatchId() {
	return matchId;
}

function getNewMovementId () {
	return lastMovementId+1;
}
