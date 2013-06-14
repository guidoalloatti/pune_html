
function drawMarkers() {
	yMarker = 0;
	for(var i = 0; i < colors.length; i++) {
		drawMarker(colors[i], xMarker, yMarker, wMarker, hMarker);
		yMarker += yMax/6;
	}	
}

function drawMarker(color, x, y, w, h) {
	marker.beginPath();
	marker.fillStyle = color;
	marker.fillRect(x, y, w, h);
	marker.closePath();
}

function drawScore() {
	var score = "00";
	$.each(players, function () { 	
		if(this.playing && this.score < 10) score = "0"+this.score;
		else score = this.score;
		
		var i = this.index;
		
		marker.beginPath();
		marker.font = "40pt serif";
		marker.fillStyle = "black";
		marker.fillText(score, score_x, (score_y+(i*(yMax/6))));
		marker.fillStyle = "white";
		marker.fillText(score, score_x-2, (score_y-2+(i*(yMax/6))));
		marker.closePath();
	});
}

function drawWorm(currentWorm) {
	context.beginPath();
	context.fillStyle = currentWorm.color;
	context.arc(currentWorm.x, currentWorm.y, wormSize, 0, Math.PI*2, true);
	context.fill();
	context.closePath();
	if(isHole(currentWorm)) {
		context.beginPath();
		context.fillStyle = "rgb(0, 0, 0)";
		context.arc(currentWorm.previousX[8], currentWorm.previousY[8], wormSize+1, 0, Math.PI*2, true);
		context.fill();
		context.closePath();
		context.beginPath();
		context.fillStyle = "rgb(2, 2, 2)";
		context.arc(currentWorm.previousX[11], currentWorm.previousY[11], 2, 0, Math.PI*2, true);
		context.fill();
		context.closePath();
		currentWorm.previousHole[currentWorm.length] = true;
	} else {
		currentWorm.previousHole[currentWorm.length] = false;
	}
	currentWorm.length++;
}

function getPixelColor(x, y, w, h) {
	var gi = context.getImageData(x, y, w, h);
	alert("red: "+gi.data[0]+"\ngreen: "+gi.data[1]+"\nblue: "+gi.data[2]+"\nalpha: "+gi.data[3]);
}

function setContextProperties() {
	context.font = '36px arial';
	context.textAlign = 'left';
	context.textBaseline = 'middle';
	context.fillStyle = "rgb(0,0,0)";
}

function setMarkerProperties() {
	marker.fillStyle = "white";
	marker.font = '48px arial';
	marker.textAlign = 'left';
	marker.textBaseline = 'middle';
}

function loadCanvasContext() {
	//if( typeof($("#screen")[0]) != "undefined") {

		context = $("#screen")[0].getContext('2d');
		if(context)
			return context;
		return false;
	//}
	//return "undef";
}

function loadMarkerCanvas() {
	//if( typeof($("#marker")[0]) != "undefined") {
		marker = $("#marker")[0].getContext('2d');
		if(marker)
			return marker;
		return false;
	//}
	//return "undef";
}

// Render Worm: This function render one specific worm
function renderWorm(currentWorm) {
	context.fillStyle = currentWorm.color;
	for(var i = 0; i < currentWorm.lenght; i++) {
		if(currentWorm.previousHole[i])
			context.fillStyle = "rgb(2, 2, 2)";

		context.beginPath();
		context.arc(currentWorm.previousX[i], currentWorm.previousY[i], wormSize, 0, Math.PI*2, true);
		context.fill();
		context.closePath();
	}
}

// Render Screen: This function draws all
function renderScreen() {
	// draw canvas
	$.each(players, function() {
		if(this.playing && this.score > maxScore)
			renderWorm(players[i]);
	});
}