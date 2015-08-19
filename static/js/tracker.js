// This method helps the track of game details
function trackMoves() {
	moves++
	showMoves()
}

// This method helps the track pause moves
function trackPauseMoves() {
	pauseMoves++
	showMoves()
}

function showMoves() {
	console.log("Moves: " + moves + " - Pause Moves: " + pauseMoves)
}